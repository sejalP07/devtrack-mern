import { useState, useEffect, useCallback } from 'react';
import TaskList from '../components/TaskList';
import { getTasks } from '../services/taskService';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetchTasks is memoized so it can safely be called on demand later
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTasks();
      setTasks(result.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(
        'Unable to load tasks. Please make sure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Placeholder handlers — will be wired up in Milestone 4
  const handleEdit = (task) => {
    console.log('Edit task:', task._id);
  };

  const handleDelete = (id) => {
    console.log('Delete task:', id);
  };

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dashboard__header">
        <div className="dashboard__header-inner">
          <div className="dashboard__brand">
            <span className="dashboard__brand-icon" aria-hidden="true">⚡</span>
            <h1 className="dashboard__title">DevTrack</h1>
          </div>
          <p className="dashboard__subtitle">Developer Task Management</p>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="dashboard__main">

        {/* Loading state */}
        {loading && (
          <div className="dashboard__loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Loading tasks…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="dashboard__error" role="alert">
            <span className="dashboard__error-icon" aria-hidden="true">⚠️</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
            <button className="btn btn--ghost" onClick={fetchTasks}>
              Retry
            </button>
          </div>
        )}

        {/* Task list (only shown when not loading and no error) */}
        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
