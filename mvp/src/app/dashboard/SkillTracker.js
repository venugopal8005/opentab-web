'use client';

import React, { useState } from 'react';

// --- Icons defined locally so you don't need to install external libraries ---
const XIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const CheckIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
// -------------------------------------------------------------------------

const initialSkills = [
  {
    name: "Performance Optimization",
    steps: [
      { id: 1, title: "Code Splitting", completed: true },
      { id: 2, title: "Image Optimization", completed: true },
      { id: 3, title: "Memoization (useMemo/useCallback)", completed: true },
      { id: 4, title: "Server Side Rendering", completed: false },
      { id: 5, title: "Bundle Analysis", completed: false },
    ]
  },
  {
    name: "Interaction & Motion Design",
    steps: [
      { id: 1, title: "CSS Transitions", completed: true },
      { id: 2, title: "Keyframes", completed: true },
      { id: 3, title: "Framer Motion Basics", completed: true },
      { id: 4, title: "Gesture Handling", completed: true },
    ]
  },
  {
    name: "Responsive Architecture",
    steps: [
      { id: 1, title: "Flexbox Mastery", completed: true },
      { id: 2, title: "Grid Layouts", completed: true },
      { id: 3, title: "Mobile First Approach", completed: true },
      { id: 4, title: "Container Queries", completed: false },
    ]
  },
  {
    name: "Design Systems",
    steps: [
      { id: 1, title: "Atomic Design Principles", completed: true },
      { id: 2, title: "Tokenization", completed: true },
      { id: 3, title: "Component Documentation", completed: true },
      { id: 4, title: "Accessibility Standards", completed: false },
      { id: 5, title: "Theming", completed: true },
    ]
  },
  {
    name: "Deepening JavaScript",
    steps: [
      { id: 1, title: "ES6+ Syntax", completed: true },
      { id: 2, title: "Async/Await Patterns", completed: false },
      { id: 3, title: "Closures & Scope", completed: true },
      { id: 4, title: "Prototypes", completed: false },
      { id: 5, title: "Event Loop", completed: false },
      { id: 6, title: "Functional Programming", completed: false },
      { id: 7, title: "Memory Management", completed: false },
    ]
  },
];

export default function SkillTracker() {
  const [skills, setSkills] = useState(initialSkills);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);

  // Helper to calculate percentage based on completed steps
  const calculatePercent = (steps) => {
    if (!steps || steps.length === 0) return 0;
    const completedCount = steps.filter(step => step.completed).length;
    return Math.round((completedCount / steps.length) * 100);
  };

  // Handle checking/unchecking a specific step
  const toggleStep = (skillIndex, stepId) => {
    const updatedSkills = [...skills];
    const skill = updatedSkills[skillIndex];
    
    const stepIndex = skill.steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      // Toggle the completed status
      skill.steps[stepIndex].completed = !skill.steps[stepIndex].completed;
      setSkills(updatedSkills);
    }
  };

  const activeSkill = selectedSkillIndex !== null ? skills[selectedSkillIndex] : null;

  return (
    <div className="relative w-full max-w-[1000px] mx-auto">
      {/* Main Card */}
      <div className="w-full border border-[#424141] p-5 rounded-xl bg-black">
        <h3 className="text-white text-[18px] font-medium mb-4">Skill Tracker</h3>

        <div className="space-y-4">
          {skills.map((skill, index) => {
            const percent = calculatePercent(skill.steps);
            
            return (
              <div 
                key={index} 
                className="cursor-pointer group"
                onClick={() => setSelectedSkillIndex(index)}
              >
                <div className="flex justify-between items-center group-hover:opacity-80 transition-opacity">
                  <span className="text-white text-[14px] font-medium">{skill.name}</span>
                  <span className="text-white text-[13px]">{percent}%</span>
                </div>

                <div className="w-full h-[5px] bg-[#424141] rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-[5px] bg-[#6265FE] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <span className="text-white text-[14px] font-medium cursor-pointer hover:text-gray-300 flex items-center gap-2">
            + Add a skill you want to enhance
          </span>
        </div>
      </div>

      {/* POPUP MODAL */}
      {activeSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-black border border-[#424141] rounded-xl p-6 shadow-2xl transform transition-all">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-white text-[20px] font-medium">{activeSkill.name}</h2>
                <p className="text-gray-400 text-[13px] mt-1">
                  {calculatePercent(activeSkill.steps)}% Complete
                </p>
              </div>
              
              {/* Done and Close Actions */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedSkillIndex(null)}
                  className="text-[#6265FE] text-[14px] font-medium hover:text-[#4e51cb] transition-colors"
                >
                  Done
                </button>
                <button 
                  onClick={() => setSelectedSkillIndex(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activeSkill.steps.map((step) => (
                <label 
                  key={step.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-colors group border border-transparent hover:border-[#333]"
                >
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                    ${step.completed 
                      ? 'bg-[#6265FE] border-[#6265FE]' 
                      : 'border-[#424141] group-hover:border-gray-400'}
                  `}>
                    {step.completed && <CheckIcon size={12} className="text-white" />}
                  </div>
                  
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={step.completed}
                    onChange={() => toggleStep(selectedSkillIndex, step.id)}
                  />
                  
                  <span className={`text-[14px] transition-all ${step.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {step.title}
                  </span>
                </label>
              ))}
            </div>

            {/* Progress Bar in Modal */}
            <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
               <div className="w-full h-[4px] bg-[#2a2a2a] rounded-full">
                  <div
                    className="h-[4px] bg-[#6265FE] rounded-full transition-all duration-300"
                    style={{ width: `${calculatePercent(activeSkill.steps)}%` }}
                  />
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}