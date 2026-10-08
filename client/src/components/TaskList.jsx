import TaskCard from './TaskCard';
import './TaskList.css';

/**
 * TaskList
 * Props:
 *   tasks           - array of task objects
 *   onEdit          - forwarded to TaskCard
 *   onDelete        - forwarded to TaskCard
 *   hasActiveFilters - boolean; changes the empty-state copy when filters are on
 *   onClearFilters  - called from the filtered empty state's "Clear filters" link
 */
function TaskList({ tasks, onEdit, onDelete, hasActiveFilters, onClearFilters }) {
  if (tasks.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="task-list__empty" role="status">
          <div className="task-list__empty-icon" aria-hidden="true">🔍</div>
          <h3>No tasks match your current filters.</h3>
          <p>
            Try adjusting your search or filters.{' '}
            <button
              className="task-list__clear-link"
              onClick={onClearFilters}
              type="button"
            >
              Clear all filters
            </button>
          </p>
        </div>
      );
    }

    return (
      <div className="task-list__empty" role="status">
        <div className="task-list__empty-icon" aria-hidden="true">📋</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <section className="task-list" aria-label="Task list">
      <p className="task-list__count">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </p>
      <div className="task-list__grid">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default TaskList;
