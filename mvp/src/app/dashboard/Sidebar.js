// src/app/dashboard/Sidebar.js
'use client';

const Colors = {
  bgSidebar: 'bg-[#141424]',
  border: 'border-[#2A2A3E]',
  sidebarPurple: 'bg-[#7B59A6]',
  textMuted: 'text-[#8A8A9E]',
};

const boards = new Array(5).fill('');  // Placeholder for board slots

export default function Sidebar() {
  return (
    <div className="w-[265px] flex-shrink-0 h-full flex flex-col justify-between bg-[#141424] border-r border-[#2A2A3E] p-3">
      <div>
        <div className="text-base font-semibold bg-[#7B59A6] text-white rounded-xl px-4 py-2 mb-3 cursor-pointer shadow">Dashboard</div>
        <div className="text-base font-semibold text-white rounded-xl px-4 py-2 mb-3 bg-[#23233a] cursor-pointer">Personality Matrix</div>
        <div className="text-sm font-semibold text-white mb-1 mt-4">Boards</div>
        <div className="text-xs text-[#8A8A9E] px-2 py-1 mb-2">Public</div> 
        <div className="space-y-2 mb-4">
          {boards.map((_, i) => (
            <div key={i} className="h-[48px] bg-[#23233a] rounded-xl" />
          ))}
        </div>
        <div className="h-[75px] bg-[#7B59A6] rounded-lg mb-3" />
        <ProfileCard />
      </div>
      <div className="h-[20px]" /> {/* Spacer */}
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
    <span className={`text-[10px] ${color} text-white px-2 py-0.5 rounded-full`}>{children}</span>
  );
}
