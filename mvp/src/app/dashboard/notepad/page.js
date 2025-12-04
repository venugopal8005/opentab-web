// src/app/dashboard/notepad/page.js
import { Suspense } from 'react';
import DocumentManager from './DocumentManager';

// Server Component page (no "use client" here)
export default function NotepadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] text-white">
          Loading notepad...
        </div>
      }
    >
      {/* Client Component that uses useSearchParams */}
      <DocumentManager />
    </Suspense>
  );
}
