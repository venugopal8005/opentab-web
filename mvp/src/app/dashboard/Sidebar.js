import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EmojiPicker from 'emoji-picker-react';
import { Rnd } from 'react-rnd';




export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
 
  const getBoards = () => {
    try {
      const saved = localStorage.getItem('notepadBoards');
      return saved ? JSON.parse(saved) : ['', '', '', '', ''];
    } catch {
      return ['', '', '', '', ''];
    }
  };


  // Initialize to default empty array to match server render
  const [boards, setBoards] = useState(['', '', '', '', '']);


  // Load real data on client mount only (fixes hydration)
  useEffect(() => {
    const loadBoards = () => setBoards(getBoards());
    loadBoards(); // Initial load


    const handleStorage = () => loadBoards(); // Sync across tabs
    const handleCustom = () => loadBoards(); // Sync for same-tab updates (e.g., title changes)


    window.addEventListener('storage', handleStorage);
    window.addEventListener('boardsUpdated', handleCustom);


    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('boardsUpdated', handleCustom);
    };
  }, []);


  const addNewPage = () => {
    const pages = JSON.parse(localStorage.getItem('notepadPages') || '[]');
    const newId = pages.length + 1;
   
    // Define newPage before using it
    const newPage = { id: newId, title: `Untitled Page ${newId}`, content: '' };
    pages.push(newPage);
    localStorage.setItem('notepadPages', JSON.stringify(pages));
   
    const newBoards = [...boards];
    const emptyIndex = newBoards.findIndex(b => !b || typeof b === 'string');
    if (emptyIndex !== -1) {
      newBoards[emptyIndex] = { name: newPage.title, pageId: newId };
      localStorage.setItem('notepadBoards', JSON.stringify(newBoards));
      setBoards(newBoards);
    }
   
    // Dispatch custom event to notify other components (though not needed here)
    window.dispatchEvent(new CustomEvent('boardsUpdated'));
   
    router.push(`/dashboard/notepad?page=${newId}`);
  };


  const currentPage = parseInt(searchParams.get('page')) || 1;


  return (
    <div className="w-[265px] flex-shrink-0 h-full flex flex-col justify-between bg-[#141424] border-r border-[#2A2A3E] p-3">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="text-base font-semibold bg-[#7B59A6] text-white rounded-xl px-4 py-2 cursor-pointer shadow flex-1">
            Dashboard
          </div>
          <div
            className="w-10 h-10 bg-[#7B59A6] hover:bg-[#A67BC6] rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={addNewPage}
          >
            <span className="text-white font-bold text-lg">+</span>
          </div>
        </div>
       
        <div className="text-base font-semibold text-white rounded-xl px-4 py-2 mb-3 bg-[#23233a] cursor-pointer">
          Personality Matrix
        </div>


        <div className="text-sm font-semibold text-white mb-1 mt-4">Boards</div>
        <div className="text-xs text-[#8A8A9E] px-2 py-1 mb-2">Public</div>


        <div className="space-y-2 mb-2">
          {boards.map((board, i) => (
            typeof board === 'object' ? (
              <Link
                key={i}  // Use i for uniqueness (avoids duplicates)
                href={`/dashboard/notepad?page=${board.pageId}`}
                className={`h-[48px] rounded-xl cursor-pointer flex items-center px-3 hover:opacity-90 transition ${
                  board.pageId === currentPage ? 'bg-[#7B59A6] shadow-lg' : 'bg-[#23233a] hover:bg-[#23233a]/80'
                }`}
              >
                <span className="text-sm text-white truncate">{board.name}</span>
              </Link>
            ) : (
              <div key={i} className="h-[48px] bg-[#23233a] rounded-xl" />
            )
          ))}
        </div>


        <div className="h-[75px] bg-[#7B59A6] rounded-lg mb-3 mt-4" />
        <ProfileCard />
      </div>
      <div className="h-[20px]" />
    </div>
  );
}


function ProfileCard() {
  return (
    <div className="bg-[#141424] border-t border-[#2A2A3E] mt-2 rounded-xl p-3">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 border-2 border-white"></div>
        <div>
          <div className="font-bold text-sm text-white">Abid Shaik</div>
          <div className="text-xs text-green-400">Available</div>
        </div>
      </div>
      <div className="text-xs text-[#8A8A9E] mb-1">
        Full-stack developer & UI/UX enthusiast building the future of collaborative tools.
      </div>
      <div className="flex flex-wrap gap-1 mb-1">
        <Tag color="bg-blue-600">React</Tag>
        <Tag color="bg-purple-700">TypeScript</Tag>
        <Tag color="bg-pink-600">UI/UX</Tag>
      </div>
      <div className="text-xs text-[#8A8A9E] mt-2">Currently Working On</div>
      <div className="text-xs text-white">Landing Page Redesign</div>
    </div>
  );
}


function Tag({ children, color }) {
  return (
    <span className={`text-[10px] ${color} text-white px-2 py-0.5 rounded-full`}>
      {children}
    </span>
  );
}