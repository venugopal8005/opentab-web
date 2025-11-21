'use client';
import Sidebar from './Sidebar';
import CalendarSection from './CalendarSection';
import SkillTracker from './SkillTracker';
import TodoList from './TodoList';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-['Inter']">
      <Sidebar />

      {/* Removed max-width & centering so content stays beside sidebar */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="relative">

          <div className="flex flex-col lg:flex-row gap-1 mb-6 items-start">
            <div className="flex-none w-[400px]">
              <CalendarSection />
            </div>

            <div className="flex-none w-[400px]">
              <SkillTracker />
            </div>
          </div>

          <div className="flex-none w-[800px]">
            <TodoList />
          </div>

        </div>
      </div>
    </div>
  );
}
