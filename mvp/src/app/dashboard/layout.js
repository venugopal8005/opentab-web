'use client';

import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-['Inter']">

      <aside>
        <Sidebar />
      </aside>

      <div className="flex flex-1 overflow-y-auto overflow-x-hidden p-0 m-0 min-w-0">
        {children}
      </div>
    </div>
  );
}
