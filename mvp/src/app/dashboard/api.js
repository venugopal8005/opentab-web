const API_BASE = 'http://localhost:5000/api'; // adjust if different base URL

const getToken = () => localStorage.getItem('accessToken'); // <-- updated here

const api = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  if (!token) {
    throw new Error('No token found. Please login.');
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`API Error ${res.status}: ${error}`);
  }

  return res.json();
};

// Fetch all todos for user
export const fetchTodos = () => api('/todos');

// Create a new todo item
export const createTodo = (todo) =>
  api('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });

// Update an existing todo by ID
export const updateTodo = (todoId, updatedData) =>
  api(`/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });

// Delete a todo by ID
export const deleteTodo = (todoId) =>
  api(`/todos/${todoId}`, {
    method: 'DELETE',
  });

// Fetch todo statistics (counts by status)
export const fetchStats = () => api('/todos/stats');
