import { useState, useEffect, useCallback, useRef } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService';
import './Dashboard.css';

function Dashboard() {
  // ── Data state ────────────────────────────────────────────────────────────
  const [tasks, setTasks]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);   // initial page load only
  const [error, setError]     = useState(null);

  // ── Search / filter state ─────────────────────────────────────────────────
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Separate loading flag for filter/search changes — avoids blanking the
  // entire page on every keystroke; only shows the SearchBar spinner.
  const [isSearching, setIsSearching] = useState(false);

  // ── Form state ────────────────────────────────────────────────────────────
  const [formMode, setFormMode] = useState(null);  // null | 'create' | 'edit'
  const [editTask, setEditTask] = useState(null);

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState('');

  // ── Toast notification ────────────────────────────────────────────────────
  const [toast, setToast] = useState('');

  // Keep the latest filters in a ref so async callbacks always read
  // the current values without needing them as dependencies.
  const filtersRef = useRef({ search, statusFilter, priorityFilter });
  useEffect(() => {
    filtersRef.current = { search, statusFilter, priorityFilter };
  }, [search, statusFilter, priorityFilter]);

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Build a clean params object — Axios will only append keys that have
   * truthy values, so we never send ?search=&status= to the API.
   */
  const buildParams = (s, st, pr) => {
    const params = {};
    if (s)  params.search   = s;
    if (st) params.status   = st;
    if (pr) params.priority = pr;
    return params;
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Data fetching
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Fetch tasks with the given filter params (non-blocking — keeps existing
   * list visible while loading, shows SearchBar spinner).
   */
  const fetchTasks = useCallback(async (params) => {
    setIsSearching(true);
    try {
      const result = await getTasks(params);
      setTasks(result.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Unable to load tasks. Please make sure the backend server is running.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Fetch global stats — always unfiltered.
   */
  const fetchStats = useCallback(async () => {
    try {
      const result = await getTaskStats();
      setStats(result.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  /**
   * Initial full load — shows the page spinner.
   */
  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskResult, statsResult] = await Promise.all([
        getTasks({}),
        getTaskStats(),
      ]);
      setTasks(taskResult.data);
      setStats(statsResult.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Unable to load tasks. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Re-fetch with the current active filters (used after mutations).
   * Also refreshes global stats independently.
   */
  const refreshData = useCallback(async () => {
    const { search: s, statusFilter: st, priorityFilter: pr } = filtersRef.current;
    await Promise.all([
      fetchTasks(buildParams(s, st, pr)),
      fetchStats(),
    ]);
  }, [fetchTasks, fetchStats]);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // ── Re-fetch whenever any filter/search value changes ────────────────────
  useEffect(() => {
    // Skip on the very first render — loadInitial already handles it
    if (loading) return;
    fetchTasks(buildParams(search, statusFilter, priorityFilter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, priorityFilter]);

  // ─────────────────────────────────────────────────────────────────────────
  // Search / filter handlers
  // ─────────────────────────────────────────────────────────────────────────

  // Called by SearchBar after debounce
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleStatusChange = (value) => setStatusFilter(value);
  const handlePriorityChange = (value) => setPriorityFilter(value);

  // Clear filters only (search stays)
  const handleClearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
  };

  // Clear everything — called from filtered empty state
  const handleClearAll = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters =
    search !== '' || statusFilter !== '' || priorityFilter !== '';

  // ─────────────────────────────────────────────────────────────────────────
  // Form handlers
  // ─────────────────────────────────────────────────────────────────────────

  const openCreateForm = () => { setEditTask(null); setFormMode('create'); };
  const openEditForm   = (task) => { setEditTask(task); setFormMode('edit'); };
  const closeForm      = () => { setFormMode(null); setEditTask(null); };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'edit') {
      await updateTask(editTask._id, formData);
      closeForm();
      showToast('Task updated successfully.');
    } else {
      await createTask(formData);
      showToast('Task created successfully.');
    }
    await refreshData();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Delete handlers
  // ─────────────────────────────────────────────────────────────────────────

  const openDeleteDialog  = (task) => { setDeleteTarget(task); setDeleteError(''); };
  const closeDeleteDialog = () => { setDeleteTarget(null); setDeleteError(''); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteTask(deleteTarget._id);
      closeDeleteDialog();
      showToast('Task deleted successfully.');
      await refreshData();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to delete task. Please try again.';
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="dashboard">

      {/* ── Toast ── */}
      {toast && (
        <div className="dashboard__toast" role="status" aria-live="polite">
          ✓ {toast}
        </div>
      )}

      {/* ── Header ── */}
      <header className="dashboard__header">
        <div className="dashboard__header-inner">
          <div className="dashboard__brand">
            <span className="dashboard__brand-icon" aria-hidden="true">⚡</span>
            <h1 className="dashboard__title">DevTrack</h1>
          </div>
          <p className="dashboard__subtitle">Developer Task Management</p>
          <button
            className="btn btn--primary dashboard__new-btn"
            onClick={openCreateForm}
            disabled={loading}
          >
            + New Task
          </button>
        </div>
      </header>

      {/* ── Statistics bar — always global, never filtered ── */}
      {stats && !loading && !error && (
        <div className="stats-bar" aria-label="Task statistics">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-value--todo">{stats.todo}</span>
            <span className="stat-label">Todo</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-value--progress">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-value--done">{stats.done}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-value--high">{stats.highPriority}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="dashboard__main">

        {/* Initial page load spinner */}
        {loading && (
          <div className="dashboard__loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Loading tasks…</p>
          </div>
        )}

        {/* Hard error on initial load */}
        {!loading && error && (
          <div className="dashboard__error" role="alert">
            <span className="dashboard__error-icon" aria-hidden="true">⚠️</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
            <button className="btn btn--ghost" onClick={loadInitial}>
              Retry
            </button>
          </div>
        )}

        {/* Search + Filter controls + Task list */}
        {!loading && !error && (
          <>
            {/* ── Search & filter toolbar ── */}
            <div className="dashboard__toolbar">
              <SearchBar
                value={search}
                onSearchChange={handleSearchChange}
                isSearching={isSearching}
              />
              <FilterBar
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onClear={handleClearFilters}
              />
            </div>

            {/* ── Task list ── */}
            <TaskList
              tasks={tasks}
              onEdit={openEditForm}
              onDelete={openDeleteDialog}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearAll}
            />
          </>
        )}
      </main>

      {/* ── Task Form (create / edit) ── */}
      <TaskForm
        isOpen={formMode !== null}
        initialValues={formMode === 'edit' ? editTask : null}
        onSubmit={handleFormSubmit}
        onCancel={closeForm}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Task"
        message={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
        isLoading={deleting}
      />

      {deleteError && !deleteTarget && (
        <div className="dashboard__delete-error" role="alert">
          ⚠️ {deleteError}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
