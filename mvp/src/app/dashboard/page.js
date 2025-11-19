'use client';

import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { MdAdd, MdDelete, MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import TodoList from './TodoList'; // Your existing TodoList component

// Color Palette & Utilities
const Colors = {
  bgDark: 'bg-[#000000]',
  bgPanel: 'bg-[#1A1A2E]',
  bgSidebar: 'bg-[#141424]',
  border: 'border-[#2A2A3E]',
  accentPurple: 'bg-[#9575CD]',
  sidebarPurple: 'bg-[#7B59A6]',
  eventTime: 'bg-[#1E1E34]',
  textMuted: 'text-[#8A8A9E]',
  kanbanBorder: 'border-[#424141]',
  taskToDo: '#4748BF',
  taskDoing: '#8B90D7',
  taskDone: '#CFE7FF',
  taskTextWhite: 'text-white',
  taskTextBlack: 'text-black',
};

// Hide scrollbar utility
const scrollbarHide = 'scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';

// Icon component
const Icon = ({ name, className = '' }) => {
  const icons = { Plus: '+', Target: '◉', Trash: '🗑', Settings: '⚙' };
  return <span className={`inline-block ${className}`}>{icons[name] || '?'}</span>;
};

// Helper components
const Tag = ({ children, color }) => (
  <span className={`text-[10px] ${color} text-white px-2 py-0.5 rounded-full`}>
    {children}
  </span>
);

const NavItem = ({ label, selected = false }) => (
  <div className={`py-2 px-4 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors mb-2
      ${selected ? Colors.sidebarPurple : 'hover:bg-gray-800 bg-opacity-30'} 
      ${selected ? 'shadow-lg' : ''}`}>
    {label}
  </div>
);

const BoardItem = ({ label, selected = false }) => (
  <div className={`h-8 rounded-md cursor-pointer mb-1 px-3 py-2 text-sm
      ${selected ? Colors.sidebarPurple : 'bg-[#1E1E34] hover:bg-gray-800'}
      text-white`}>
    {label}
  </div>
);

// Sidebar
const Sidebar = () => (
  <div className={`w-[250px] flex-shrink-0 ${Colors.bgSidebar} flex flex-col h-full ${Colors.border} border-r p-3`}>
    <div>
      <NavItem label="Dashboard" selected={true} />
      <NavItem label="Personality Matrix" />
    </div>
    <div className={`mt-4 p-1.5 text-white text-sm flex justify-between items-center font-semibold`}>
      Boards
      <Icon name="Plus" className="text-lg cursor-pointer" />
    </div>
    <div className={`flex-1 overflow-y-auto pr-1 ${scrollbarHide}`}>
      <div className={`text-xs ${Colors.textMuted} px-2 py-1 flex items-center`}>
        Public <Icon name="Target" className='text-[8px] ml-1' />
      </div>
      <BoardItem label="Public Board 1" />
      <BoardItem label="Private Project" selected />
      <BoardItem label="Team Hub" />
      <BoardItem label="Q4 Planning" />
      <BoardItem label="Design Assets" />
      <BoardItem label="Client Review" />
      <BoardItem label="Marketing Strategy" />
      <BoardItem label="Backend Infrastructure" />
    </div>
    <div className={`w-full h-20 bg-blue-600 rounded-lg my-4`}></div>
    <div className={`p-4 mx-1 mb-2 rounded-lg ${Colors.bgSidebar} ${Colors.border} border-t-2 border-r-2 mt-4 shadow-xl`}>
      <div className="flex items-center mb-3">
        <div className='w-12 h-12 rounded-full bg-gray-300 mr-3 border-2 border-white'></div>
        <div>
          <h4 className='text-sm font-semibold text-white'>Abid Shaik</h4>
          <span className='text-xs text-green-400'>Available</span>
        </div>
      </div>
      <p className={`text-xs mt-1 ${Colors.textMuted} line-clamp-3`}>
        Full-stack developer & UI/UX enthusiast building the future of collaborative tools.
      </p>
      <div className='flex flex-wrap gap-1 mt-2'>
        <Tag color="bg-blue-600">React</Tag>
        <Tag color="bg-purple-700">TypeScript</Tag>
        <Tag color="bg-pink-600">UI/UX</Tag>
      </div>
      <p className={`text-xs mt-3 ${Colors.textMuted}`}>Currently Working On</p>
      <div className='text-xs text-white'>Landing Page Redesign</div>
    </div>
  </div>
);

// Calendar and Events
const CalendarEvents = () => {
  const totalSlots = 7 * 5;
  const dates = Array.from({ length: totalSlots }, (_, i) => i + 1);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className={`p-4 rounded-xl ${Colors.bgPanel} flex flex-col h-full overflow-hidden`}>
      <div className='flex items-center justify-between text-white mb-2'>
        <span className='cursor-pointer text-xl'>&lt;</span>
        <span className='font-semibold text-base'>September 2025</span>
        <span className='cursor-pointer text-xl'>&gt;</span>
      </div>
      <div className='grid grid-cols-7 text-center text-xs gap-1'>
        {dayLabels.map(day => (
          <div key={day} className='text-white font-medium pb-1'>{day}</div>
        ))}
        {dates.map(date => {
          const displayDate = date;
          const isCurrent = date >= 1 && date <= 30;
          const isToday = date === 9;
          if (!isCurrent) return <div key={date} className='h-7' />;
          return (
            <div key={date}
              className={`p-0.5 h-7 rounded-md flex items-center justify-center cursor-pointer
                  ${isToday ? `${Colors.accentPurple} text-white` : 'text-white hover:bg-gray-800'}`}>
              {displayDate}
            </div>
          );
        })}
      </div>
      <div className='flex space-x-2 mt-4 text-xs'>
        <button className={`py-1 px-3 rounded-md ${Colors.eventTime} text-white`}>Day</button>
        <button className={`py-1 px-3 rounded-md ${Colors.eventTime} text-white`}>Month</button>
        <button className={`py-1 px-3 rounded-md ${Colors.eventTime} text-white`}>Year</button>
      </div>
      <div className={`mt-4 pt-4 flex-1 overflow-y-auto ${scrollbarHide}`}>
        <h4 className='text-xs mb-3 font-medium text-white'>TUESDAY - 9 SEP</h4>
        <div className='space-y-3'>
          <EventItem time="6:00PM" color={Colors.sidebarPurple}>Meeting with Mr. Rashid</EventItem>
          <EventItem time="8:30PM" color={Colors.sidebarPurple}>Dinner @ Jim's</EventItem>
        </div>
        <div className='mt-4'>
          <button className={`w-full py-2 px-3 rounded-md ${Colors.sidebarPurple} text-white text-sm`}>
            Add New Event...
          </button>
        </div>
      </div>
    </div>
  );
};

const EventItem = ({ children, time, color }) => (
  <div className={`flex justify-between items-center text-sm text-white font-medium ${color} rounded-md`}>
    <span className='py-2 px-3'>{children}</span>
    <span className={`font-bold py-2 px-3 ${Colors.eventTime}`}>{time}</span>
  </div>
);

// Skill Tracker
const SkillTracker = () => (
  <div className={`p-4 rounded-xl ${Colors.bgPanel} flex flex-col h-full`}>
    <div className='flex justify-between items-center mb-4'>
      <h3 className='text-xl font-semibold text-white'>Skill Tracker</h3>
      <span className='text-gray-400 text-lg cursor-pointer'>▷</span>
    </div>
    <div className={`space-y-4 flex-1 overflow-y-auto ${scrollbarHide}`}>
      <SkillItem name="Performance Optimization" percent={72} />
      <SkillItem name="Interaction & Motion Design" percent={63} />
      <SkillItem name="Responsive Architecture" percent={88} />
      <SkillItem name="Design Systems" percent={43} />
      <SkillItem name="Deepening JavaScript (ES6+, async, closures)" percent={43} />
      <SkillItem name="Cloud Infrastructure (AWS/GCP)" percent={30} />
      <SkillItem name="Data Visualization (D3.js)" percent={55} />
      <SkillItem name="State Management (Zustand/Redux)" percent={92} />
    </div>
    <div className={`mt-5 text-sm font-medium text-white border-t ${Colors.border} pt-3`}>
      + Add a skill you want to enhance
    </div>
  </div>
);

const SkillItem = ({ name, percent }) => (
  <div className='flex items-center py-2 border-b border-gray-800'>
    <span className='flex-1 text-sm text-white truncate'>{name}</span>
    <div className='w-1/3 h-1 bg-[#3A3A5A] rounded-full mx-4'>
      <div
        className={`h-full ${Colors.accentPurple} rounded-full`}
        style={{ width: `${percent}%` }}
      />
    </div>
    <span className='w-8 text-right text-sm font-bold text-white'>{percent}%</span>
  </div>
);

export default function DashboardPage() {
  const { user, loading } = useAuth(true);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen w-full antialiased overflow-hidden font-inter">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Padding TOP set to zero to prevent mismatch */}
        <div className="pt-0 px-4 pb-4 grid grid-cols-4 grid-rows-[45%_55%] gap-4 h-full">
          {/* Calendar + Skill Tracker */}
          <div className='col-span-4 row-span-1 grid grid-cols-4 gap-4 h-full'>
            <div className='col-span-4 lg:col-span-1 min-h-[300px] h-full'>
              <CalendarEvents />
            </div>
            <div className='col-span-4 lg:col-span-3 min-h-[300px] h-full'>
              <SkillTracker />
            </div>
          </div>
          {/* Kanban / TodoList */}
          <div className='col-span-4 row-span-1 min-h-[300px] h-full'>
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}
