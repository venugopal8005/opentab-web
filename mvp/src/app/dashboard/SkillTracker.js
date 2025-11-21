'use client';

import React from 'react';

const skills = [
    { name: "Performance Optimization", percent: 72 },
    { name: "Interaction & Motion Design", percent: 100 },
    { name: "Responsive Architecture", percent: 85 },
    { name: "Design Systems", percent: 90 },
    { name: "Deepening JavaScript (ES6+, async, closures)", percent: 43 },
];

export default function SkillTracker() {
  return (
    <div className="w-[393px] border-2 border-[#424141] p-4 rounded-xl bg-black">
      <h3 className="text-white text-[18px] font-medium mb-8">Skill Tracker</h3>

      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="relative">
            {/* Skill name and percentage */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-white text-[15px] font-medium">{skill.name}</span>
              <span className="text-white text-[13px] font-medium">{skill.percent}%</span>
            </div>
            
            {/* Progress Track */}
            <div className="relative">
              {/* Background track */}
              <div className="w-full h-[6px] bg-[#424141] rounded-full">
                {/* Progress fill */}
                <div 
                  className="h-[6px] bg-[#6265FE] rounded-full transition-all duration-300"
                  style={{ width: `${skill.percent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <span className="text-white text-[15px] font-medium cursor-pointer hover:text-gray-300 transition-colors">
          + Add a skill you want to enhance
        </span>
      </div>
    </div>
  );
}
