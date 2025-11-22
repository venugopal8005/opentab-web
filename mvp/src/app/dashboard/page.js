'use client';

import React from 'react';
// NOTE: These components must contain the specific content styles shown in the image.
import CalendarSection from './CalendarSection';
import SkillTracker from './SkillTracker';
import TodoList from './TodoList'; 
import FocusModeBox from './FocusModeBox'; // <--- Imported here

// --- Sidebar and ProfileCard components are defined here for a complete file ---
const boards = new Array(5).fill(''); 

function Tag({ children, color }) {
  return (
    <span className={`text-[10px] ${color} text-white px-2 py-0.5 rounded-full`}>{children}</span>
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
      <button className="flex items-center justify-start px-2 py-1 rounded bg-red-700/80 text-white text-sm font-medium mt-3 w-full">
        <div className="w-4 h-4 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center mr-2">
          N
        </div>
        1 Issue
        <span className="ml-auto text-sm">×</span>
      </button>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-[265px] flex-shrink-0 h-full flex flex-col justify-between bg-[#141424] border-r border-[#2A2A3E] p-3">
      <div className="flex flex-col flex-grow">
        <div className="text-base font-semibold bg-[#7B59A6] text-white rounded-xl px-4 py-2 mb-3 cursor-pointer shadow">Dashboard</div>
        <div className="text-base font-semibold text-white rounded-xl px-4 py-2 mb-3 bg-[#23233a] cursor-pointer">Personality Matrix</div>
        
        <div className="mt-2 flex-grow flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Boards</div>
            <button className="text-white border border-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">+</button>
          </div>
          <div className="text-xs text-[#8A8A9E] px-2 py-1 mb-2">Public</div> 
          
          {/* Board Items */}
          <div className="space-y-2 mb-4">
            {boards.map((_, i) => (
              <div key={i} className={`h-[40px] rounded-xl ${i === 3 ? 'bg-[#7B59A6]' : 'bg-[#23233a]'}`} />
            ))}
          </div>

          {/* Spacer to push profile to bottom if content is short */}
          <div className="flex-grow min-h-[1rem]"></div> 
        </div>

        {/* Profile Card and Issue Button */}
        <ProfileCard />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-['Inter']">
      
      {/* 1. Left Sidebar */}
      <aside className="flex-shrink-0">
          <Sidebar /> 
      </aside>

      {/* 2. Main Content */}
      <div className="flex flex-1 overflow-y-auto overflow-x-hidden pl-2 pr-4 py-4 min-w-0">
        
        <main className="flex flex-col flex-grow min-w-0 space-y-32"> 

          {/* TOP ROW: Calendar + Kanban Board */}
          <section className="flex flex-col lg:flex-row gap-20 flex-shrink-0 min-w-0 h-2/5">
            <div className="w-[300px] flex-shrink-0 min-w-[280px] h-full"> 
              <CalendarSection />
            </div>
            <div className="flex w-200 h-110">
              <div className="flex-1 min-w-0 h-full">
                <TodoList /> 
              </div>
            </div>
          </section>

          {/* BOTTOM ROW: Skill Tracker + Focus Mode */}
          <section className="lg:flex-col gap-24 flex-grow min-w-0 h-3/5">
            <section className="lg:flex-col gap-24 flex-grow min-w-0 h-3/5">
              <div className="flex h-auto gap-2">
                <div className="lg:flex-row gap-24 flex-1 min-w-[800px] max-w-[700px] h-auto">
                  <SkillTracker />
                </div>
                <div className="flex-[2] h-full">
                  <FocusModeBox />
                </div>
              </div>
            </section>
          </section>

        </main>
      </div>
    </div>
  );
}