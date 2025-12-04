'use client';
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import DragHandle from '@tiptap/extension-drag-handle';
import Dropcursor from '@tiptap/extension-dropcursor';
import { TableKit } from '@tiptap/extension-table';
import { Node } from '@tiptap/core';
import { Fragment } from '@tiptap/pm/model';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Rnd } from 'react-rnd';
import styles from './notepad.module.css';

// Mock API functions to avoid import errors; replace with real imports when ready
const mockFetchTodos = async () => ({ todos: [] });
const mockCreateTodo = async () => {};
const mockUpdateTodo = async () => {};
const mockDeleteTodo = async () => {};

const fetchTodos = mockFetchTodos;
const createTodo = mockCreateTodo;
const updateTodo = mockUpdateTodo;
const deleteTodo = mockDeleteTodo;

// --- SkillTracker Component ---
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

function SkillTracker() {
  const [skills, setSkills] = useState(initialSkills);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);

  const calculatePercent = (steps) => {
    if (!steps || steps.length === 0) return 0;
    const completedCount = steps.filter(step => step.completed).length;
    return Math.round((completedCount / steps.length) * 100);
  };

  const toggleStep = (skillIndex, stepId) => {
    const updatedSkills = [...skills];
    const skill = updatedSkills[skillIndex];
    const stepIndex = skill.steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      skill.steps[stepIndex].completed = !skill.steps[stepIndex].completed;
      setSkills(updatedSkills);
    }
  };

  const activeSkill = selectedSkillIndex !== null ? skills[selectedSkillIndex] : null;

  return (
    <div className="relative w-full max-w-[1000px] mx-auto">
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

      {activeSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-black border border-[#424141] rounded-xl p-6 shadow-2xl transform transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-white text-[20px] font-medium">{activeSkill.name}</h2>
                <p className="text-gray-400 text-[13px] mt-1">
                  {calculatePercent(activeSkill.steps)}% Complete
                </p>
              </div>
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
                      : 'border-[#424141] group-hover:border-gray-400'
                    }
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

// --- Focus Mode Box Component ---
function FocusModeBox() {
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

// --- Todo Component ---
const COLORS = {
  todo: '#4748BF',        // Blue/Purple for To Do
  doing: '#8B90D7',       // Light Purple for Doing  
  done: '#CFE7FF',        // Light Blue for Done
  textWhite: 'text-white',
  textBlack: 'text-black',
  kanbanBorder: 'border-[#424141]',  // Dark gray border from design
  deleteBorder: 'border-[#8A0F0F]',  // Red for delete
};

const scrollbarHide = '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';

function TodoComponent() {
  const [cols, setCols] = useState({ todo: [], doing: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    status: 'todo',
    position: 0,
    subtasks: [],
    tags: []
  });

  useEffect(() => {
    loadTasks();
  }, []);

  // Loads and organizes todos into columns
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTodos();
      const items = data.todos || [];
      setCols({
        todo: items.filter(t => t.status === 'todo'),
        doing: items.filter(t => t.status === 'doing'),
        done: items.filter(t => t.status === 'done'),
      });
    } catch (err) {
      // Redirect to login if not authenticated
      if (err.message.includes('No token')) {
        window.location.href = '/login';
      }
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const task = {
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      deadline: form.deadline !== '' ? form.deadline : null,
      status: form.status,
      position: form.position,
      subtasks: form.subtasks,
      tags: form.tags,
    };
    try {
      await createTodo(task);
      await loadTasks();
      setForm({
        title: '', description: '', priority: 'medium', deadline: '',
        status: 'todo', position: 0, subtasks: [], tags: []
      });
      setOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
      alert('Error creating task');
    }
  };

  // Delete todo by _id
  const onDelete = async (taskId) => {
    try {
      await deleteTodo(taskId);
      await loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Error deleting task');
    }
  };

  // Move task to a new status
  const moveTask = async (taskId, newStatus) => {
    try {
      await updateTodo(taskId, { status: newStatus });
      await loadTasks();
    } catch (err) {
      console.error('Failed to move task:', err);
      alert('Error updating task status');
    }
  };

  // Subtask helpers
  const addEmptySubtask = () => setForm(f => ({
    ...f,
    subtasks: [...f.subtasks, { label: '', completed: false }]
  }));

  const updateSubtask = (i, key, val) => {
    const next = [...form.subtasks];
    next[i] = { ...next[i], [key]: val };
    setForm({ ...form, subtasks: next });
  };

  const removeSubtask = (i) =>
    setForm({ ...form, subtasks: form.subtasks.filter((_, idx) => idx !== i) });

  const setTagsFromCSV = (csv) =>
    setForm({ ...form, tags: csv.split(',').map(s => s.trim()).filter(Boolean) });

  if (loading) {
    return (
      <div className="p-4 rounded-xl bg-[#1A1A2E] h-full flex items-center justify-center">
        <div className={COLORS.textWhite}>Loading tasks...</div>
      </div>
    );
  }

  // Today's date string for min attribute on date input
  const todayISO = new Date().toISOString().split('T')[0];

  // Drag & Drop handlers
  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => {
    e.preventDefault(); // necessary for drop to work
  };

  const onDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await moveTask(taskId, newStatus);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-black border-2 border-[#424141] h-full flex flex-col">
      <div className="flex space-x-4 h-full pb-2">
        <KanbanColumn title="To Do" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'todo')}>
          {cols.todo.map(t => (
            <KanbanTask
              key={t._id}
              taskId={t._id}
              color={COLORS.todo}
              textColor={COLORS.textWhite}
              onDragStart={onDragStart}
            >
              {t.title}
              <button className="ml-2 text-xs text-red-400" onClick={() => onDelete(t._id)}>Delete</button>
              <button className="ml-2 text-xs text-blue-300" onClick={() => moveTask(t._id, 'done')}>Mark Done</button>
            </KanbanTask>
          ))}
          <AddTaskButton onClick={() => setOpen(true)} />
        </KanbanColumn>

        <KanbanColumn title="Doing" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'doing')}>
          {cols.doing.map(t => (
            <KanbanTask
              key={t._id}
              taskId={t._id}
              color={COLORS.doing}
              textColor={COLORS.textWhite}
              onDragStart={onDragStart}
            >
              {t.title}
              <button className="ml-2 text-xs text-red-400" onClick={() => onDelete(t._id)}>Delete</button>
              <button className="ml-2 text-xs text-blue-300" onClick={() => moveTask(t._id, 'done')}>Mark Done</button>
            </KanbanTask>
          ))}
        </KanbanColumn>

        <KanbanColumn title="Done" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'done')}>
          {cols.done.map(t => (
            <KanbanTask
              key={t._id}
              taskId={t._id}
              color={COLORS.done}
              textColor={COLORS.textBlack}
              onDragStart={onDragStart}
            >
              {t.title}
              <button className="ml-2 text-xs text-red-400" onClick={() => onDelete(t._id)}>Delete</button>
              <button className="ml-2 text-xs text-blue-300" onClick={() => moveTask(t._id, 'todo')}>Move to ToDo</button>
            </KanbanTask>
          ))}
        </KanbanColumn>
      </div>

      {/* Modal for adding tasks */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#2A2A3E] bg-[#1A1A2E] text-white p-5">
            <div className="text-lg font-semibold mb-3">Add New Task</div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title *</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Task title"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Details"
                />
              </div>

              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value='low'>low</option>
                    <option value='medium'>medium</option>
                    <option value='high'>high</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <label className="block text-sm mb-1">Deadline</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                    value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                    min={todayISO} // restrict past dates
                  />
                  <div
                    className="absolute right-3 top-9 cursor-pointer select-none text-gray-400"
                    onClick={() => {
                      const input = document.querySelector('input[type="date"]');
                      if (input) input.showPicker?.();
                    }}
                    aria-label="Choose date"
                    role="button"
                  >
                    📅
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value='todo'>todo</option>
                    <option value='doing'>doing</option>
                    <option value='done'>done</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">Position</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                    value={form.position}
                    onChange={e => setForm({ ...form, position: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Tags (comma separated)</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                  value={form.tags.join(', ')}
                  onChange={e => setTagsFromCSV(e.target.value)}
                  placeholder="work, urgent, ui"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Subtasks</label>
                <button
                  type="button"
                  className="text-purple-400 text-xs mb-1"
                  onClick={addEmptySubtask}
                >
                  + Add subtask
                </button>
                {form.subtasks.map((st, i) => (
                  <div key={i} className="flex space-x-2 items-center mb-1">
                    <input
                      className="flex-1 px-2 py-1 rounded bg-[#222] text-xs"
                      value={st.label}
                      onChange={e => updateSubtask(i, 'label', e.target.value)}
                      placeholder="Subtask name"
                    />
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={e => updateSubtask(i, 'completed', e.target.checked)}
                    />
                    <button
                      type="button"
                      className="text-xs text-red-500"
                      onClick={() => removeSubtask(i)}
                    >Remove</button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#7B59A6] hover:bg-[#5E477F] text-white text-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Util components
const AddTaskButton = ({ onClick }) => (
  <div
    onClick={onClick}
    className="p-3 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
    style={{ backgroundColor: COLORS.todo }}
  >
    <span className="text-[11px] font-normal leading-tight text-white">
      + Add Task
    </span>
  </div>
);

const KanbanColumn = ({ title, onDragOver, onDrop, children }) => (
  <div
    onDragOver={onDragOver}
    onDrop={onDrop}
    className={`flex-1 flex-shrink-0 p-3 rounded-lg bg-black border ${COLORS.kanbanBorder} h-full flex flex-col`}
  >
    <div className="flex justify-between items-center mb-3">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
    <div className={`space-y-3 flex-1 overflow-y-auto ${scrollbarHide}`}>{children}</div>
  </div>
);

const KanbanTask = ({ children, color, textColor, taskId, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, taskId)}
    style={{ backgroundColor: color }}
    className={`p-3 rounded-md text-sm ${textColor} cursor-grab shadow-md hover:shadow-lg transition-shadow`}
  >
    <span className="text-[11px] font-normal leading-tight">{children}</span>
  </div>
);

// --- Calendar Section Component ---
const Colors = {
    bgCalendar: 'bg-[#000000]', 
    bgModal: 'bg-[#1A1A2E]', 
    selectedDayBg: 'bg-[#7B59A6]', 
    accentPurple: 'bg-[#7B59A6]', 
    textDefault: 'text-white',
    textMuted: 'text-[#8A8A9E]',
    border: 'border-[#2A2A3E]',
    inputBg: 'bg-[#000000]', 
    bgOverlay: 'bg-black/80',
    cancelButtonBg: 'bg-[#2A2A3E]',
    doneButtonBg: 'bg-[#7B59A6]',
    eventBg: 'bg-[#7B59A6]', 
    addEventBg: 'bg-[#7B59A6]',
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getSortableTime = (timeString) => {
    if (!timeString || timeString.length < 4) return 0;
    const [hourStr, minuteStr] = timeString.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    return (hour * 100) + minute;
};

const getInitialDateString = (day, month, year) => {
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
    const monthStr = String(monthIndex).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
};

const getEndTime = (startTime) => {
    const [hourStr, minuteStr] = startTime.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);   
    hour = (hour + 1) % 24;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const EventItem = ({ children, time, date }) => (
    <div className={`flex justify-between items-center text-sm ${Colors.textDefault} font-medium ${Colors.eventBg} rounded-md p-1.5`}>
        <span className="text-xs">{children}</span>
        <span className={`font-semibold text-xs bg-black/30 px-1.5 py-0.5 rounded`}>{date} - {time}</span>
    </div>
);

function EventModal({ isOpen, onClose, onSave, selectedDay, currentMonth }) {
    const todayDateString = getInitialDateString(selectedDay, currentMonth.month, currentMonth.year);
    const defaultStartTime = "19:00";
    const [title, setTitle] = useState("Unnamed event");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState(todayDateString); 
    const [startTime, setStartTime] = useState(defaultStartTime); 
    const [endDate, setEndDate] = useState(todayDateString);
    const [endTime, setEndTime] = useState(getEndTime(defaultStartTime));
    
    useEffect(() => {
        const newDateString = getInitialDateString(selectedDay, currentMonth.month, currentMonth.year);
        setStartDate(newDateString);
        setEndDate(newDateString);
    }, [selectedDay, currentMonth, isOpen]);
    
    useEffect(() => {
        setEndTime(getEndTime(startTime));
    }, [startTime]);

    if (!isOpen) return null;

    const staticEvent = { category: "Personal" };

    const handleDone = () => {
        const dayNumber = new Date(startDate).getDate(); 
        const newEvent = {
            text: title,
            location: location,
            startDate: startDate,
            startTime: startTime, 
            endDate: endDate,
            endTime: endTime,
            time: startTime,
            date: dayNumber,
            month: currentMonth.month,
        };
        onSave(newEvent);
        setTitle("Unnamed event");
        setLocation("");
        setStartTime(defaultStartTime);
        setEndTime(getEndTime(defaultStartTime));
        onClose();
    };

    const ModalHeader = ({ onClose, onDone }) => (
        <div className={`flex items-center justify-between p-3 ${Colors.border} border-b`}>
            <button onClick={onClose} className={`text-sm font-medium ${Colors.textDefault} px-3 py-1 rounded-md ${Colors.cancelButtonBg} hover:opacity-80 transition-colors`}>
                Cancel
            </button>
            <div className={`text-sm font-semibold ${Colors.textDefault}`}>
                <span style={{ background: Colors.accentPurple.replace('bg-', '#') }} className="inline-block h-2 w-2 rounded-full mr-2"></span>
                {staticEvent.category}
            </div>
            <button onClick={onDone} className={`text-sm font-medium ${Colors.textDefault} px-3 py-1 rounded-md ${Colors.doneButtonBg} hover:opacity-90 transition-colors`}>
                Done
            </button>
        </div>
    );

    const InputField = ({ label, value, onChange, placeholder, isLarge, icon }) => (
        <div className="flex items-center">
            <span className={`font-medium ${Colors.textMuted} w-16 ${isLarge ? 'text-lg' : 'text-sm'}`}>{label}</span>
            <div className={`flex items-center flex-1 justify-between px-3 py-2 rounded-md ${Colors.inputBg}`}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`flex-1 ${isLarge ? 'text-lg' : 'text-sm'} bg-transparent outline-none ${Colors.textDefault} placeholder:${Colors.textMuted}`}
                />
                {icon && <span className={`text-base ${Colors.textMuted}`}>{icon}</span>}
            </div>
        </div>
    );

    const TitleLocationSection = () => (
        <div className={`p-4 space-y-4 ${Colors.border} border-b`}>
            <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} isLarge />
            <InputField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Add location" icon="📍" />
        </div>
    );

    const DateTimePicker = ({ label, dateValue, onDateChange, timeValue, onTimeChange }) => (
        <div className={`flex justify-between items-center py-2`}>
            <span className={`text-sm ${Colors.textMuted}`}>{label}</span>
            <div className="flex items-center space-x-4">
                <input type="date" value={dateValue} onChange={onDateChange} className={`text-sm ${Colors.textDefault} bg-transparent outline-none border-b border-gray-700 focus:border-white transition-colors p-1 rounded-md ${Colors.inputBg}`} />
                <input type="time" value={timeValue} onChange={onTimeChange} className={`text-sm ${Colors.textDefault} bg-transparent outline-none border-b border-gray-700 focus:border-white transition-colors p-1 rounded-md ${Colors.inputBg}`} />
            </div>
        </div>
    );

    const ScheduleSection = () => (
        <div className="p-4 space-y-2">
            <h3 className={`text-sm font-semibold ${Colors.textMuted} mb-2`}>Schedule</h3>
            <div className="flex justify-between items-center py-2">
                <span className={`text-sm ${Colors.textMuted}`}>All Day</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={false} className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#404040] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B59A6]"></div>
                </label>
            </div>
            <DateTimePicker label="Starts" dateValue={startDate} onDateChange={(e) => setStartDate(e.target.value)} timeValue={startTime} onTimeChange={(e) => setStartTime(e.target.value)} />
            <DateTimePicker label="Ends" dateValue={endDate} onDateChange={(e) => setEndDate(e.target.value)} timeValue={endTime} onTimeChange={(e) => setEndTime(e.target.value)} />
            <div className={`flex justify-between items-center py-2`}>
                <span className={`text-sm ${Colors.textMuted}`}>Repeat</span>
                <div className={`flex items-center px-3 py-1 rounded-md ${Colors.inputBg}`}>
                    <span className={`text-sm ${Colors.textDefault} mr-2`}>No Repeat</span>
                    <span className={`text-sm ${Colors.textMuted}`}>▼</span>
                </div>
            </div>
        </div>
    );

    const RemindersNotesSection = () => (
        <div className={`p-4 space-y-4 ${Colors.border} border-t`}>
            <h3 className={`text-sm font-semibold ${Colors.textMuted}`}>Reminders</h3>
            <button className={`w-full py-2 rounded-md text-sm ${Colors.accentPurple} ${Colors.textDefault} border ${Colors.border.replace('border-', 'border-')} hover:opacity-90`}>
                Add a Reminder...
            </button>
            <h3 className={`text-sm font-semibold ${Colors.textMuted}`}>Notes</h3>
            <textarea rows="3" placeholder="Add notes..." className={`w-full p-2 rounded-md ${Colors.inputBg} ${Colors.textDefault} placeholder:${Colors.textMuted} text-sm resize-none outline-none`}></textarea>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${Colors.bgOverlay} backdrop-blur-sm transition-opacity`}>
            <div className={`w-[450px] rounded-xl overflow-hidden shadow-2xl ${Colors.bgModal}`}>
                <ModalHeader onClose={onClose} onDone={handleDone} />
                <TitleLocationSection />
                <ScheduleSection />
                <RemindersNotesSection />
            </div>
        </div>
    );
}

function CalendarSection() {
    const [activeView, setActiveView] = useState('Day');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(9);
    const [userEvents, setUserEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState({ month: 'September', year: 2025 });

    const goToPreviousMonth = () => {
        let monthIndex = monthNames.indexOf(currentMonth.month);
        let year = currentMonth.year;
        monthIndex -= 1;
        if (monthIndex < 0) {
            monthIndex = 11;
            year -= 1;
        }
        setCurrentMonth({ month: monthNames[monthIndex], year });
    };

    const goToNextMonth = () => {
        let monthIndex = monthNames.indexOf(currentMonth.month);
        let year = currentMonth.year;
        monthIndex += 1;
        if (monthIndex > 11) {
            monthIndex = 0;
            year += 1;
        }
        setCurrentMonth({ month: monthNames[monthIndex], year });
    };

    const daysInMonth = useMemo(() => {
        const monthIndex = monthNames.indexOf(currentMonth.month);
        return new Date(currentMonth.year, monthIndex + 1, 0).getDate();
    }, [currentMonth]);

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const calendarDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    useEffect(() => {
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [daysInMonth, selectedDay]);

    const handleAddEvent = useCallback((newEvent) => {
        setUserEvents(prevEvents => [
            ...prevEvents, 
            {
                ...newEvent,
                sorted: getSortableTime(newEvent.startTime), 
                viewTags: ['Day', 'Week', 'Month'], 
            }
        ]);
    }, []);

    const eventsToDisplay = useMemo(() => {
        return userEvents
            .filter(event => {
                if (!event.viewTags.includes(activeView)) return false;
                if (activeView === 'Day') return event.date === selectedDay; 
                return true;
            }) 
            .sort((a, b) => {
                // For Day view: sort by time only
                if (activeView === 'Day') {
                    return a.sorted - b.sorted;
                }
                // For Week/Month views: sort by day first, then by time
                return a.date - b.date || a.sorted - b.sorted;
            });
    }, [activeView, userEvents, selectedDay]);

    const handleDayClick = (date) => {
        setSelectedDay(date);
        setActiveView('Day');
    };

    const EventListSection = () => {
        const scrollbarHide = 'scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';
        
        return (
            <>
                <div className={`text-xs ${Colors.textDefault} font-semibold uppercase mb-1`}>
                    {activeView === 'Day' && `${currentMonth.month.toUpperCase().slice(0, 3)} ${selectedDay}`}
                    {activeView === 'Week' && `WEEK OF ${selectedDay} ${currentMonth.month.toUpperCase().slice(0, 3)}`}
                    {activeView === 'Month' && `${currentMonth.month.toUpperCase()} ${currentMonth.year}`}
                </div>
                
                <div className={`space-y-1 overflow-y-auto min-h-[78px] max-h-[78px] pr-2 ${scrollbarHide}`}> 
                    {eventsToDisplay.map((event, index) => (
                        <EventItem key={index} time={event.startTime} date={event.date}>
                            {event.text}
                        </EventItem>
                    ))}
                    {eventsToDisplay.length === 0 && (
                        <div className="h-[78px] flex items-center justify-center">
                            <p className={`${Colors.textMuted} text-sm text-center`}>
                                No events found
                            </p>
                        </div>
                    )}
                </div>
                
                <div className="mt-1">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full py-2 rounded-lg ${Colors.addEventBg} ${Colors.textDefault} text-xs font-medium hover:opacity-90 transition-opacity`}
                    >
                        Add New Event...
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            <div className={`w-[380px] p-4 ${Colors.bgCalendar} rounded-lg shadow-2xl`}>
                <div className='flex items-center justify-between text-white text-base font-semibold mb-2 px-1'>
                    <span className={`cursor-pointer text-xl text-[#6A96ED]`} onClick={goToPreviousMonth}>◀</span>
                    <div className="flex space-x-1">
                        <span className="font-light">{currentMonth.month}</span>
                        <span className="font-light">{currentMonth.year}</span>
                    </div>
                    <span className={`cursor-pointer text-xl text-[#6A96ED]`} onClick={goToNextMonth}>▶</span>
                </div>
                <div className='grid grid-cols-7 text-center text-sm gap-1 mb-2'>
                    {dayLabels.map(day => (<div key={day} className={`font-normal text-white`}>{day}</div>))}
                </div>
                <div className='grid grid-cols-7 text-sm gap-1'>
                    {calendarDays.map(date => {
                        const isSelectedDay = date === selectedDay;
                        const dayClasses = `h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-colors font-medium ${isSelectedDay ? Colors.selectedDayBg : 'text-white hover:bg-[#1A1A2E]'}`;
                        return (
                            <div key={date} className="flex justify-center items-center">
                                <div className={dayClasses} onClick={() => handleDayClick(date)}>
                                    {date}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between items-center space-x-2 my-2">
                    {['Day', 'Week', 'Month'].map(view => (
                        <button key={view} className={`flex-1 px-4 py-1 rounded-md font-semibold text-sm text-center cursor-pointer transition-colors`} onClick={() => setActiveView(view)} style={activeView === view ? { background: Colors.accentPurple.replace('bg-', '#'), color: '#fff' } : { background: '#181828', color: '#fff' }}>
                            {view}
                        </button>
                    ))}
                </div>
                <EventListSection />
            </div>
            <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddEvent} selectedDay={selectedDay} currentMonth={currentMonth} />
        </>
    );
}

// ----- Slash commands -----
const SLASH_COMMANDS = [
  { title: 'Text', command: 'text', shortcut: 't' },
  { title: 'Heading 1', command: 'h1', shortcut: 'h1' },
  { title: 'Heading 2', command: 'h2', shortcut: 'h2' },
  { title: 'Heading 3', command: 'h3', shortcut: 'h3' },
  { title: 'Bullet list', command: 'bullet', shortcut: 'bl' },
  { title: 'Numbered list', command: 'ol', shortcut: 'ol' },
  { title: 'To-do list', command: 'todo', shortcut: 'todo' },
  { title: 'Tasks', command: 'tasks', shortcut: 'tasks' },
  { title: 'Skills Tracker', command: 'skills', shortcut: 'skills' },
  { title: 'Focus Model', command: 'focus', shortcut: 'focus' },
  { title: 'Calendar', command: 'calendar', shortcut: 'cal' },
  { title: 'Quote', command: 'quote', shortcut: 'q' },
  { title: 'Code block', command: 'codeblock', shortcut: 'code' },
  { title: 'Divider', command: 'divider', shortcut: 'hr' },
  { title: 'Table', command: 'table', shortcut: 'tbl' },
];

// ----- Mini Kanban constants -----
const TODO_COLORS = {
  todo: '#4748BF',
  doing: '#8B90D7',
  done: '#CFE7FF',
  textWhite: 'text-white',
  textBlack: 'text-black',
  kanbanBorder: 'border-[#424141]',
};


// Custom extension for table row move commands
const CustomTableCommands = Node.create({
  addCommands() {
    return {
      moveRowUp: () => ({ state, dispatch }) => {
        const { $from } = state.selection;
        const cell = $from.parent;
        if (cell.type.name !== 'tableCell' && cell.type.name !== 'tableHeader') return false;
        const row = cell.parent;
        if (row.type.name !== 'tableRow') return false;
        const table = row.parent;
        if (table.type.name !== 'table') return false;
        const rowIndex = table.content.findIndex((child) => child.eq(row));
        if (rowIndex === 0) return false;
        const tableStart = table.pos;
        const newRows = [];
        for (let i = 0; i < table.content.childCount; i++) {
          newRows[i] = table.content.child(i);
        }
        [newRows[rowIndex - 1], newRows[rowIndex]] = [newRows[rowIndex], newRows[rowIndex - 1]];
        const newContent = Fragment.from(newRows);
        const newTableNode = table.type.create(table.attrs, newContent);
        const tr = state.tr.replaceWith(tableStart, tableStart + table.nodeSize, newTableNode);
        dispatch(tr);
        return true;
      },
      moveRowDown: () => ({ state, dispatch }) => {
        const { $from } = state.selection;
        const cell = $from.parent;
        if (cell.type.name !== 'tableCell' && cell.type.name !== 'tableHeader') return false;
        const row = cell.parent;
        if (row.type.name !== 'tableRow') return false;
        const table = row.parent;
        if (table.type.name !== 'table') return false;
        const rowIndex = table.content.findIndex((child) => child.eq(row));
        if (rowIndex === table.content.childCount - 1) return false;
        const tableStart = table.pos;
        const newRows = [];
        for (let i = 0; i < table.content.childCount; i++) {
          newRows[i] = table.content.child(i);
        }
        [newRows[rowIndex], newRows[rowIndex + 1]] = [newRows[rowIndex + 1], newRows[rowIndex]];
        const newContent = Fragment.from(newRows);
        const newTableNode = table.type.create(table.attrs, newContent);
        const tr = state.tr.replaceWith(tableStart, tableStart + table.nodeSize, newTableNode);
        dispatch(tr);
        return true;
      },
    };
  },
});

// Custom TodoPanel Node - Fixed renderHTML for atom node
const TodoPanel = Node.create({
  name: 'todoPanel',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {};
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="todo-panel"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    // Removed content hole (0) for leaf/atom node
    return ['div', { ...HTMLAttributes, 'data-type': 'todo-panel', class: 'todo-panel-node' }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TodoPanelView);
  },
});

// Custom SkillPanel Node - Fixed renderHTML for atom node
const SkillPanel = Node.create({
  name: 'skillPanel',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {};
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="skill-panel"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    // Removed content hole (0) for leaf/atom node
    return ['div', { ...HTMLAttributes, 'data-type': 'skill-panel', class: 'skill-panel-node' }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(SkillPanelView);
  },
});

// Custom FocusPanel Node
const FocusPanel = Node.create({
  name: 'focusPanel',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {};
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="focus-panel"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'focus-panel', class: 'focus-panel-node' }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FocusPanelView);
  },
});

// Custom CalendarPanel Node
const CalendarPanel = Node.create({
  name: 'calendarPanel',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {};
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="calendar-panel"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'calendar-panel', class: 'calendar-panel-node' }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalendarPanelView);
  },
});

// TodoPanel View
// TodoPanel View (updated)
// TodoPanel View
// TodoPanel View (updated)
function TodoPanelView(props) {
  const handleDelete = useCallback(() => {
    const { editor, getPos } = props;
    const from = getPos();
    const to = from + props.node.nodeSize;
    editor.chain().focus().deleteRange({ from, to }).run();
  }, [props]);
  return (
    <NodeViewWrapper>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: 'auto',
        }}
        bounds="parent"
        minWidth={300}
        minHeight={200}
        dragAxis="both"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        style={{ display: 'inline-block' }}
        // REMOVED: dragHandleClassName="todo-panel-drag-handle"  // Now draggable anywhere
      >
        <div className="my-4 p-3 rounded-xl bg-black border border-[#424141] flex flex-col text-xs overflow-hidden relative group">
          <button
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            title="Delete panel"
          >
            <XIcon size={16} />
          </button>
          <div className="todo-panel-drag-handle">  {/* This class is now optional/irrelevant for dragging */}
            <TodoComponent />
          </div>
        </div>
      </Rnd>
    </NodeViewWrapper>
  );
}

// SkillPanel View (updated)
function SkillPanelView(props) {
  const handleDelete = useCallback(() => {
    const { editor, getPos } = props;
    const from = getPos();
    const to = from + props.node.nodeSize;
    editor.chain().focus().deleteRange({ from, to }).run();
  }, [props]);
  return (
    <NodeViewWrapper>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: 'auto',
        }}
        bounds="parent"
        minWidth={300}
        minHeight={400}
        dragAxis="both"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        style={{ display: 'inline-block' }}
        // REMOVED: dragHandleClassName="skill-panel-drag-handle"  // Now draggable anywhere
      >
        <div className="my-4 p-3 rounded-xl bg-black border border-[#424141] flex flex-col text-xs overflow-hidden relative group">
          <button
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            title="Delete panel"
          >
            <XIcon size={16} />
          </button>
          <div className="skill-panel-drag-handle">  {/* This class is now optional/irrelevant for dragging */}
            <SkillTracker />
          </div>
        </div>
      </Rnd>
    </NodeViewWrapper>
  );
}

// FocusPanel View (updated)
function FocusPanelView(props) {
  const handleDelete = useCallback(() => {
    const { editor, getPos } = props;
    const from = getPos();
    const to = from + props.node.nodeSize;
    editor.chain().focus().deleteRange({ from, to }).run();
  }, [props]);
  return (
    <NodeViewWrapper>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: 'auto',
        }}
        bounds="parent"
        minWidth={300}
        minHeight={300}
        dragAxis="both"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        style={{ display: 'inline-block' }}
        // REMOVED: dragHandleClassName="focus-panel-drag-handle"  // Now draggable anywhere
      >
        <div className="my-4 p-3 rounded-xl bg-black border border-[#424141] flex flex-col text-xs overflow-hidden relative group">
          <button
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            title="Delete panel"
          >
            <XIcon size={16} />
          </button>
          <div className="focus-panel-drag-handle">  {/* This class is now optional/irrelevant for dragging */}
            <FocusModeBox />
          </div>
        </div>
      </Rnd>
    </NodeViewWrapper>
  );
}

// CalendarPanel View (updated)
function CalendarPanelView(props) {
  const handleDelete = useCallback(() => {
    const { editor, getPos } = props;
    const from = getPos();
    const to = from + props.node.nodeSize;
    editor.chain().focus().deleteRange({ from, to }).run();
  }, [props]);
  return (
    <NodeViewWrapper>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: 'auto',
        }}
        bounds="parent"
        minWidth={300}
        minHeight={300}
        dragAxis="both"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        style={{ display: 'inline-block' }}
        // REMOVED: dragHandleClassName="calendar-panel-drag-handle"  // Now draggable anywhere
      >
        <div className="my-4 p-3 rounded-xl bg-black border border-[#424141] flex flex-col text-xs overflow-hidden relative group">
          <button
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            title="Delete panel"
          >
            <XIcon size={16} />
          </button>
          <div className="calendar-panel-drag-handle">  {/* This class is now optional/irrelevant for dragging */}
            <CalendarSection />
          </div>
        </div>
      </Rnd>
    </NodeViewWrapper>
  );
}

// ===================== NOTEPAD PAGE =====================
export default function NotepadPage({
  pageData,
  onUpdate,
  currentPageId,
  totalPages,
  onDeletePage,
}) {
  const [title, setTitle] = useState(pageData?.title || 'Untitled Page');
  const [icon, setIcon] = useState(pageData?.icon || '');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  // table toolbar position (relative to editor content)
  const [tableToolbarPos, setTableToolbarPos] = useState({
    top: 0,
    visible: false,
  });

  // current row for move buttons
  const [currentRow, setCurrentRow] = useState(null);
  const [totalRows, setTotalRows] = useState(0);

  const slashRef = useRef({ startPos: 0, query: '' });
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  useEffect(() => {
    if (pageData?.title !== undefined) setTitle(pageData.title);
    if (pageData?.icon !== undefined) setIcon(pageData.icon || '');
  }, [pageData?.title, pageData?.icon]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onUpdate && pageData?.id && editorRef.current) {
        onUpdate(pageData.id, title, editorRef.current.getJSON(), icon);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title, icon, pageData?.id, onUpdate]);

  const parseHeaderCellsFromContent = (content) => {
    if (!content) return null;
    const headerMatch = content.match(/\|(.*)\|/);
    if (!headerMatch) return null;

    const inner = headerMatch[1];
    const cells = inner
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);

    return cells.length ? cells : null;
  };

  const executeSlashCommand = useCallback(
    (command, content = '') => {
      if (!editorRef.current) return;
      const editor = editorRef.current;

      const currentPos = editor.state.selection.$from.pos;
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.$from.start(),
          to: currentPos,
        })
        .run();

      switch (command) {
        case 'text':
          editor.chain().focus().setParagraph().insertContent(content).run();
          break;
        case 'h1':
          editor.chain().focus().setHeading({ level: 1 }).insertContent(content).run();
          break;
        case 'h2':
          editor.chain().focus().setHeading({ level: 2 }).insertContent(content).run();
          break;
        case 'h3':
          editor.chain().focus().setHeading({ level: 3 }).insertContent(content).run();
          break;
        case 'bullet':
          editor.chain().focus().toggleBulletList().insertContent(content).run();
          break;
        case 'ol':
          editor.chain().focus().toggleOrderedList().insertContent(content).run();
          break;
        case 'todo':
          editor.chain().focus().toggleTaskList().insertContent(content).run();
          break;
        case 'tasks':
          editor.chain().focus().insertContent({ type: 'todoPanel' }).run();
          break;
        case 'skills':
          editor.chain().focus().insertContent({ type: 'skillPanel' }).run();
          break;
        case 'focus':
          editor.chain().focus().insertContent({ type: 'focusPanel' }).run();
          break;
        case 'calendar':
          editor.chain().focus().insertContent({ type: 'calendarPanel' }).run();
          break;
        case 'quote':
          editor.chain().focus().setBlockquote().insertContent(content).run();
          break;
        case 'codeblock':
          editor.chain().focus().toggleCodeBlock().insertContent(content).run();
          break;
        case 'divider':
          editor.chain().focus().setHorizontalRule().run();
          break;
        case 'table': {
          const headerCells = parseHeaderCellsFromContent(content);
          const cols = headerCells ? headerCells.length : 2;

          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols, withHeaderRow: true })
            .run();

          if (headerCells && headerCells.length) {
            headerCells.forEach((cellText, index) => {
              editor
                .chain()
                .focus()
                .setCellSelection({
                  anchorCell: { row: 1, col: index + 1 },
                  headCell: { row: 1, col: index + 1 },
                })
                .insertContent(cellText)
                .run();
            });
          }
          break;
        }
        default:
          break;
      }

      setShowSlashMenu(false);
      setSlashQuery('');
    },
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: 'end',
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: styles.taskItem },
      }),
      Placeholder.configure({ placeholder: "✏️ Type '/' for slash commands..." }),
      DragHandle.configure({
        render: () => {
          const el = document.createElement('div');
          el.classList.add('custom-drag-handle');
          return el;
        },
      }),
      Dropcursor,
      TableKit.configure({
        table: {
          resizable: true,
          handleWidth: 5,
          cellMinWidth: 40,
          lastColumnResizable: true,
        },
      }),
      CustomTableCommands,
      TodoPanel,
      SkillPanel,
      FocusPanel,
      CalendarPanel,
    ],
    content: pageData?.content || '',
    editorProps: {
      attributes: {
        class: `${styles.tiptapContent} tiptap`,
      },
      handleKeyDown: (view, event) => {
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        const pos = $from.pos;
        const startOfPara = $from.start();
        const textBeforeCursor = state.doc.textBetween(startOfPara, pos);

        if (event.key === '/' && !showSlashMenu) {
          slashRef.current = { startPos: pos, query: '/' };
          setSlashQuery('/');
          setShowSlashMenu(true);
          return false;
        }

        if (showSlashMenu) {
          if (event.key === 'Enter') {
            event.preventDefault();

            const trimmed = textBeforeCursor.trim();
            const parts = trimmed.split(' ');
            const commandToken = parts[0] || '';
            const commandInput = commandToken.replace('/', '').toLowerCase();
            const contentToInsert =
              parts.length > 1 ? parts.slice(1).join(' ') : '';

            const foundCommand = SLASH_COMMANDS.find(
              (item) =>
                item.shortcut.toLowerCase() === commandInput ||
                item.title.toLowerCase().replace(/ /g, '') === commandInput,
            );

            if (foundCommand) {
              executeSlashCommand(foundCommand.command, contentToInsert);
            }

            return true;
          }
          if (event.key === 'Escape') {
            setShowSlashMenu(false);
            setSlashQuery('');
            return false;
          }

          const newQuery = textBeforeCursor.startsWith('/')
            ? textBeforeCursor
            : '';
          if (newQuery !== slashQuery) setSlashQuery(newQuery);
          return false;
        }

        if (event.key === ' ' && !showSlashMenu && textBeforeCursor.trim()) {
          const trimmedText = textBeforeCursor.trim();

          if (trimmedText === '#') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .setHeading({ level: 1 })
              .run();
            return true;
          }
          if (trimmedText === '##') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .setHeading({ level: 2 })
              .run();
            return true;
          }
          if (trimmedText === '###') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .setHeading({ level: 3 })
              .run();
            return true;
          }
          if (trimmedText === '-') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .toggleBulletList()
              .run();
            return true;
          }
          if (trimmedText === '>') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .setBlockquote()
              .run();
            return true;
          }
          if (trimmedText === '```') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .toggleCodeBlock()
              .run();
            return true;
          }
          if (trimmedText === '---') {
            event.preventDefault();
            editorRef.current
              ?.chain()
              .focus()
              .deleteRange({ from: startOfPara, to: pos })
              .setHorizontalRule()
              .run();
            return true;
          }
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      editorRef.current = editor;
      if (onUpdate && pageData?.id) {
        onUpdate(pageData.id, title, editor.getJSON(), icon);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      editorRef.current = editor;
      const isInTable = editor.isActive('table');
      if (!isInTable || !editorContainerRef.current) {
        setTableToolbarPos((prev) => ({ ...prev, visible: false }));
        setCurrentRow(null);
        setTotalRows(0);
        return;
      }

      const { state, view } = editor;
      const { from } = state.selection;
      const domAtPos = view.domAtPos(from);
      let node = domAtPos.node;

      while (node && node.nodeName !== 'TABLE') {
        node = node.parentElement;
      }

      if (!node || !node.getBoundingClientRect) {
        setTableToolbarPos((prev) => ({ ...prev, visible: false }));
        return;
      }

      const tableRect = node.getBoundingClientRect();
      const containerRect = editorContainerRef.current.getBoundingClientRect();
      const top = tableRect.top - containerRect.top;

      setTableToolbarPos({ top: top, visible: true });

      let rowIndex = null;
      let totalR = 0;
      const { $from } = state.selection;
      const cell = $from.parent;
      if (cell && cell.type && (cell.type.name === 'tableCell' || cell.type.name === 'tableHeader')) {
        const row = cell.parent;
        if (row && row.type && row.type.name === 'tableRow') {
          const table = row.parent;
          if (table && table.type && table.type.name === 'table') {
            rowIndex = table.content.findIndex((child) => child.eq(row));
            totalR = table.content.childCount;
          }
        }
      }
      setCurrentRow(rowIndex);
      setTotalRows(totalR);
    },
  });

  useEffect(() => {
    if (editor && pageData?.content !== undefined) {
      const currentContent = editor.getJSON();
      if (
        JSON.stringify(currentContent) !==
        JSON.stringify(pageData.content || { type: 'doc', content: [] })
      ) {
        editor.commands.setContent(pageData.content || '', false);
      }
    }
  }, [pageData?.content, editor]);

  const filteredCommands = SLASH_COMMANDS.filter(
    (item) =>
      !slashQuery ||
      item.title
        .toLowerCase()
        .includes(slashQuery.replace('/', '').toLowerCase()) ||
      item.shortcut.includes(slashQuery.replace('/', '').toLowerCase()),
  );

  if (!editor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex justify-center items-start p-4 sm:p-8 lg:p-12 py-20">
      <div className="flex flex-col items-stretch w-full max-w-6xl">
        <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden mb-6 group">
          <img src="/cover.png" alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-3 py-1.5 text-xs bg-black/60 text-white rounded-md border border-white/30">
              Change cover
            </button>
            <button className="px-3 py-1.5 text-xs bg-black/60 text-white rounded-md border border-white/30">
              Reposition
            </button>
          </div>
        </div>

        <div className={`${styles.pageHeading} mb-4 px-8 pt-2 flex items-center justify-between gap-4 relative`}>
          <div className="flex items-center gap-3 flex-1">
            <button
              type="button"
              onClick={() => setShowIconPicker((v) => !v)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#23233a] hover:bg-[#2f2f46] border border-[#3A3A4A] text-2xl"
            >
              {icon || '➕'}
            </button>

            <input
              className="bg-transparent text-5xl lg:text-6xl xl:text-7xl font-black outline-none w-full placeholder:text-[#55556A] text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add page title..."
            />
          </div>
          <div className="flex items-center gap-2">
            {onDeletePage && pageData?.id && (
              <button
                type="button"
                onClick={() => onDeletePage(pageData.id)}
                className="px-3 py-1.5 rounded-md border border-red-500/60 text-red-300 text-xs font-medium hover:bg-red-500/10 hover:border-red-400/80 transition-colors"
              >
                Delete page
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHeaderMenu((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-[#3A3A4A] bg-[#23233a] hover:bg-[#2f2f46] text-lg text-white"
              >
                ⋯
              </button>
              {showHeaderMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-md border border-[#2A2A3E] bg-[#141424] shadow-xl text-xs text-gray-100 z-50">
                </div>
              )}
            </div>
          </div>

          {showIconPicker && (
            <EmojiIconPicker
              onClose={() => setShowIconPicker(false)}
              onSelect={(val) => {
                if (!val) return;
                setIcon(val);
                setShowIconPicker(false);
                if (onUpdate && pageData?.id && editorRef.current) {
                  onUpdate(pageData.id, title, editorRef.current.getJSON(), val);
                }
              }}
            />
          )}
        </div>

        <div className="w-full flex gap-6 items-start">
          <div className="w-full">
            <div className={`${styles.notepadContainer} mx-auto shadow-2xl !border-2 !border-white/10`}>
              <div className="relative px-8 pb-12 pt-4" ref={editorContainerRef}>
                {tableToolbarPos.visible && (
                  <div
                    className="absolute z-40"
                    style={{
                      top: tableToolbarPos.top,
                      left: '100%',
                      marginLeft: '16px',
                    }}
                  >
                    <Rnd
                      default={{ x: 0, y: 0, width: 220, height: 'auto' }}
                      dragAxis="both"
                      bounds="window"
                      enableResizing={{
                        left: true,
                        right: true,
                        top: false,
                        bottom: false,
                        topLeft: false,
                        topRight: false,
                        bottomLeft: false,
                        bottomRight: false,
                      }}
                      minWidth={180}
                      maxWidth={320}
                      style={{ zIndex: 40 }}
                    >
                      <div className="flex flex-col gap-2 text-xs text-gray-200 bg-[#141424] border border-[#2A2A3E] rounded-lg px-2 py-2 shadow-lg">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          Table tools
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-left"
                          onClick={() => editor.chain().focus().addRowAfter().run()}
                        >
                          + Row below
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-left"
                          onClick={() => editor.chain().focus().addColumnAfter().run()}
                        >
                          + Column right
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-red-500/20 text-left"
                          onClick={() => editor.chain().focus().deleteRow().run()}
                        >
                          Delete row
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-red-500/20 text-left"
                          onClick={() => editor.chain().focus().deleteColumn().run()}
                        >
                          Delete column
                        </button>
                        {currentRow !== null && (
                          <div className="flex items-center gap-1 pt-1 border-t border-white/10">
                            <button
                              type="button"
                              className={`px-2 py-1 rounded text-xs border ${
                                currentRow === 0
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600'
                                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30'
                              }`}
                              onClick={() => editor.chain().focus().moveRowUp().run()}
                              disabled={currentRow === 0}
                            >
                              ↑ Move up
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-1 rounded text-xs border ${
                                currentRow === totalRows - 1
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600'
                                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30'
                              }`}
                              onClick={() => editor.chain().focus().moveRowDown().run()}
                              disabled={currentRow === totalRows - 1}
                            >
                              ↓ Move down
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-red-500/60 text-red-300 bg-red-500/10 hover:bg-red-500/30 text-left"
                          onClick={() => editor.chain().focus().deleteTable().run()}
                        >
                          Delete table
                        </button>
                      </div>
                    </Rnd>
                  </div>
                )}

                <EditorContent editor={editor} />
                {showSlashMenu && (
                  <div className="absolute left-0 top-0 z-50 bg-[#23233a] border border-[#2A2A3E] rounded-2xl shadow-2xl w-80 max-h-72 overflow-auto">
                    <div className="px-4 py-2 border-b border-[#2A2A3E] text-sm text-gray-400">
                      {slashQuery}
                    </div>
                    {/* Removed slice(0,8) to show all commands */}
                    {filteredCommands.map((item) => (
                      <button
                        key={item.command}
                        className="w-full text-left px-4 py-3 hover:bg-[#7B59A6]/60 text-sm flex justify-between items-center"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          executeSlashCommand(item.command, '');
                        }}
                      >
                        <span>{item.title}</span>
                        <span className="text-xs text-gray-400">/{item.shortcut}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-[#8A8A9E]">
          Page {currentPageId} of {totalPages}
        </div>
      </div>
    </div>
  );
}

// ===================== Emoji picker =====================
function EmojiIconPicker({ onSelect, onClose }) {
  const handleEmojiClick = (emojiData) => {
    onSelect(emojiData.emoji);
    onClose();
  };

  return (
    <div className="absolute left-16 top-20 z-50 bg-[#141424] border border-[#2A2A3E] rounded-xl shadow-2xl p-3 w-[320px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">Pick an icon</span>
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-300">
          ✕
        </button>
      </div>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme="dark"
        width="100%"
        height={350}
        autoFocusSearch={false}
      />
    </div>
  );
}