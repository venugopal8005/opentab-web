// src/app/dashboard/notepad/DocumentManager.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NotepadPage from './NotepadPage';

export default function DocumentManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageId = parseInt(searchParams.get('page')) || 1;
  
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    const savedPages = localStorage.getItem('notepadPages');
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages);
      setPages(parsedPages);
      
      // Find or create current page
      let page = parsedPages.find(p => p.id === pageId);
      if (!page) {
        page = { id: pageId, title: `Untitled Page ${pageId}`, content: '' };
        const newPages = [...parsedPages, page];
        localStorage.setItem('notepadPages', JSON.stringify(newPages));
        setPages(newPages);
      }
      setCurrentPage(page);
    } else {
      // Create first page
      const firstPage = [{ id: 1, title: 'Untitled Page 1', content: '' }];
      localStorage.setItem('notepadPages', JSON.stringify(firstPage));
      setPages(firstPage);
      setCurrentPage(firstPage[0]);
    }
  }, [pageId]);

  const updatePage = (id, title, content) => {
    const updatedPages = pages.map(p => 
      p.id === id ? { ...p, title, content } : p
    );
    localStorage.setItem('notepadPages', JSON.stringify(updatedPages));
    setPages(updatedPages);
    
    // Update boards too
    const boards = JSON.parse(localStorage.getItem('notepadBoards') || '["","","","",""]');
    const boardIndex = boards.findIndex(b => b && b.pageId === id);
    if (boardIndex !== -1 && boards[boardIndex]) {
      boards[boardIndex].name = title;
      localStorage.setItem('notepadBoards', JSON.stringify(boards));
    }
    
    // Dispatch custom event to update sidebar in same tab
    window.dispatchEvent(new CustomEvent('boardsUpdated'));
  };

  const deletePage = (id) => {
    if (!pages.length) return;

    // If there is only one page, clear and go back to dashboard
    if (pages.length === 1) {
      // Clear pages
      localStorage.removeItem('notepadPages');
      setPages([]);
      setCurrentPage(null);

      // Clean up boards that point to this page
      const boards = JSON.parse(localStorage.getItem('notepadBoards') || '["","","","",""]');
      const updatedBoards = boards.map(b =>
        b && b.pageId === id ? "" : b
      );
      localStorage.setItem('notepadBoards', JSON.stringify(updatedBoards));
      window.dispatchEvent(new CustomEvent('boardsUpdated'));

      // Redirect to dashboard
      router.push('/dashboard');
      return;
    }

    // Multiple pages: remove this one and go to first remaining
    const remainingPages = pages.filter(p => p.id !== id);
    if (!remainingPages.length) return;

    localStorage.setItem('notepadPages', JSON.stringify(remainingPages));
    setPages(remainingPages);

    // Remove any boards pointing to this page
    const boards = JSON.parse(localStorage.getItem('notepadBoards') || '["","","","",""]');
    const updatedBoards = boards.map(b => (b && b.pageId === id ? "" : b));
    localStorage.setItem('notepadBoards', JSON.stringify(updatedBoards));
    window.dispatchEvent(new CustomEvent('boardsUpdated'));

    const nextPage = remainingPages[0];
    setCurrentPage(nextPage);
    router.push(`?page=${nextPage.id}`);
  };

  if (!currentPage) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">Loading...</div>;
  }

  return (
    <NotepadPage 
      pageData={currentPage} 
      onUpdate={updatePage}
      currentPageId={currentPage.id}
      totalPages={pages.length}
      onDeletePage={deletePage}
    />
  );
}
