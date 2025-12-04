'use client';

import React from 'react';
import CalendarSection from './CalendarSection';
import SkillTracker from './SkillTracker';
import TodoList from './TodoList';
import FocusModeBox from './FocusModeBox';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-['Inter']">
      
      <div className="flex flex-1 overflow-y-auto overflow-x-hidden p-0 min-w-0">
        <main className="flex flex-col flex-grow min-w-0 space-y-32">

          {/* TOP ROW */}
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

          {/* BOTTOM ROW */}
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

        </main>
      </div>
    </div>
  );
}
