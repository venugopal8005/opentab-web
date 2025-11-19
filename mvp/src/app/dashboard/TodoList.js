'use client';

import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';

// Kanban column display and color scheme
const COLORS = {
  todo: '#4748BF',
  doing: '#8B90D7',
  done: '#CFE7FF',
  textWhite: 'text-white',
  textBlack: 'text-black',
  kanbanBorder: 'border-[#424141]',
};
const scrollbarHide = 'scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';

export default function TodoComponent() {
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

  return (
    <div className="p-4 rounded-xl bg-[#1A1A2E] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">To-Do / Kanban Board</h3>
      </div>
      <div className="flex space-x-4 h-full pb-2">
        <KanbanColumn title="To Do">
          {cols.todo.map(t => (
            <KanbanTask key={t._id} color={COLORS.todo} textColor={COLORS.textWhite}>
              {t.title}
              <button className="ml-2 text-xs text-red-400" onClick={() => onDelete(t._id)}>Delete</button>
              <button className="ml-2 text-xs text-blue-300" onClick={() => moveTask(t._id, 'done')}>Mark Done</button>
            </KanbanTask>
          ))}
          <AddTaskButton onClick={() => setOpen(true)} />
        </KanbanColumn>
        <KanbanColumn title="Doing">
          {cols.doing.map(t => (
            <KanbanTask key={t._id} color={COLORS.doing} textColor={COLORS.textWhite}>
              {t.title}
              <button className="ml-2 text-xs text-red-400" onClick={() => onDelete(t._id)}>Delete</button>
              <button className="ml-2 text-xs text-blue-300" onClick={() => moveTask(t._id, 'done')}>Mark Done</button>
            </KanbanTask>
          ))}
        </KanbanColumn>
        <KanbanColumn title="Done">
          {cols.done.map(t => (
            <KanbanTask key={t._id} color={COLORS.done} textColor={COLORS.textBlack}>
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
                <div className="flex-1">
                  <label className="block text-sm mb-1">Deadline</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#4C4C4C] outline-none"
                    value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                  />
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

const KanbanColumn = ({ title, children }) => (
  <div className={`flex-1 flex-shrink-0 p-3 rounded-lg bg-black border ${COLORS.kanbanBorder} h-full flex flex-col`}>
    <div className="flex justify-between items-center mb-3">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
    <div className={`space-y-3 flex-1 overflow-y-auto ${scrollbarHide}`}>{children}</div>
  </div>
);

const KanbanTask = ({ children, color, textColor }) => (
  <div
    style={{ backgroundColor: color }}
    className={`p-3 rounded-md text-sm ${textColor} cursor-grab shadow-md hover:shadow-lg transition-shadow`}
  >
    <span className="text-[11px] font-normal leading-tight">{children}</span>
  </div>
);
