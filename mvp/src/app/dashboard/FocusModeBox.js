'use client';

import React from 'react';

export default function FocusModeBox() {
  const FOCUS_WIDTH = '200px'; // Smaller width

  return (
    <section
      className="w-[450px] max-w-[450px] min-w-[320px] flex-shrink-0 bg-[#1A1A2E] border-l border-[#424141] overflow-hidden scrollbar-hide p-3 h-full rounded-2xl"
    >
      <div className="flex flex-col h-full items-center text-center text-white min-h-0">
        <h3 className="text-lg font-medium mb-4">Focus Mode</h3>

        <div className="text-5xl font-black mb-4">
          25:00
        </div>

        <div className="text-gray-400 text-sm mb-4">
          Goal
          <div className="flex items-center justify-center text-white mt-1">
            <input type="checkbox" checked readOnly className="mr-2" />
            Design New Login Page
          </div>
        </div>

        <button className="px-8 py-2 bg-[#6C63FF] rounded-lg text-base hover:bg-[#5A54D4] transition-colors mb-4 w-full max-w-[160px] font-medium">
          Lock In
        </button>

        {/* Pomodoro/Break Buttons - Smaller spacing */}
        <div className="flex space-x-2 mb-6">
          <button className="text-xs px-2 py-1 bg-[#292949] rounded-full hover:bg-[#3d3d63]">
            Pomodoro
          </button>
          <button className="text-xs px-2 py-1 bg-[#292949] rounded-full hover:bg-[#3d3d63]">
            Short Break
          </button>
          <button className="text-xs px-2 py-1 bg-[#292949] rounded-full hover:bg-[#3d3d63]">
            Long Break
          </button>
        </div>

        {/* Ambience Section - Smaller margins */}
        <div className="text-sm text-gray-400 mb-2">
          Ambience
        </div>
        <div className="text-base text-white">
          Forest Rain
        </div>
      </div>
    </section>
  );
}
