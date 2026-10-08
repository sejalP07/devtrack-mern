import axios from 'axios';

// Single Axios instance — base URL defined once here.
// If a VITE_API_URL env var is set it takes precedence,
// otherwise fall back to local dev backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * GET /tasks
 * @param {object} params - optional query params: { search, status, priority }
 */
export const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data; // { success, count, data }
};

/**
 * GET /tasks/stats
 */
export const getTaskStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data; // { success, data: { total, todo, inProgress, done, highPriority } }
};

/**
 * GET /tasks/:id
 */
export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

/**
 * POST /tasks
 * @param {object} taskData - { title, description, status, priority, category }
 */
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

/**
 * PUT /tasks/:id
 * @param {string} id
 * @param {object} taskData - fields to update
 */
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

/**
 * DELETE /tasks/:id
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
