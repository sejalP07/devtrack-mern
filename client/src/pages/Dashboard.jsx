import { useState, useEffect, useCallback } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { getTasks, getTaskStats, createTask, updateTask, deleteTask } from '../services/taskService';
import './Dashboard.css';

function Dashboard() {
  // ── Data state ────────────────────────────────────────────────────────────
  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // ── Form state ────────────────────────────────────────────────────────────
  // formMode: null | 'create' | 'edit'
  const [formMode, setFormMode]   = useState(null);
  const [editTask, setEditTask]   = useState(null); // task being edited

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, title }
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState('');

  // ── Toast notification ────────────────────────────────────────────────────
  const [toast, setToast] = useState(''); // brief success message

  // ─────────────────────────────────────────────────────────────────────────
  // Data fetching
  // ─────────────────────────────────────────────────────────────────────────

  const refreshData = useCallback(async () => {
    try {
      const [taskResult, statsResult] = await Promise.all([
        getTasks(),
        getTaskStats(),
      ]);
      setTasks(taskResult.data);
      setStats(statsResult.data);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskResult, statsResult] = await Promise.all([
        getTasks(),
        getTaskStats(),
      ]);
      setTasks(taskResult.data);
      setStats(statsResult.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(
        'Unable to load tasks. Please make sure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // ─────────────────────────────────────────────────────────────────────────
  // Toast helper
  // ─────────────────────────────────────────────────────────────────────────

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Form handlers
  // ─────────────────────────────────────────────────────────────────────────

  const openCreateForm = () => {
    setEditTask(null);
    setFormMode('create');
  };

  const openEditForm = (task) => {
    setEditTask(task);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setEditTask(null);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'edit') {
      await updateTask(editTask._id, formData);
      closeForm();
      showToast('Task updated successfully.');
    } else {
      await createTask(formData);
      // Form resets itself on create success (see TaskForm)
      showToast('Task created successfully.');
    }
    await refreshData();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Delete handlers
  // ─────────────────────────────────────────────────────────────────────────

  const openDeleteDialog = (task) => {
    setDeleteTarget(task);
    setDeleteError('');
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
    setDeleteError('');
  };

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
      const msg =
        err?.response?.data?.message || 'Failed to delete task. Please try again.';
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

      {/* ── Statistics bar ── */}
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

        {loading && (
          <div className="dashboard__loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Loading tasks…</p>
          </div>
        )}

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

        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
          />
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

      {/* Delete error shown inside the dialog isn't possible after close,
          so surface it as a brief alert if dialog was dismissed with an error */}
      {deleteError && !deleteTarget && (
        <div className="dashboard__delete-error" role="alert">
          ⚠️ {deleteError}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
