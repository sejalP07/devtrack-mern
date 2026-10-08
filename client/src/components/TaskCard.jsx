import './TaskCard.css';

// Maps each status/priority value to a CSS modifier class
const STATUS_CLASS = {
  'Todo': 'status--todo',
  'In Progress': 'status--in-progress',
  'Done': 'status--done',
};

const PRIORITY_CLASS = {
  Low: 'priority--low',
  Medium: 'priority--medium',
  High: 'priority--high',
};

/**
 * Formats an ISO date string to a readable short date.
 * e.g. "2026-10-08T11:16:09.045Z" -> "Oct 8, 2026"
 */
const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/**
 * TaskCard
 * Props:
 *   task     - the task object from the API
 *   onEdit   - called with the task object when Edit is clicked
 *   onDelete - called with the task _id when Delete is clicked
 */
function TaskCard({ task, onEdit, onDelete }) {
  const { title, description, status, priority, category, createdAt } = task;

  return (
    <article className="task-card" aria-label={`Task: ${title}`}>
      <div className="task-card__header">
        <div className="task-card__badges">
          <span className={`badge badge--status ${STATUS_CLASS[status] || ''}`}>
            {status}
          </span>
          <span className={`badge badge--priority ${PRIORITY_CLASS[priority] || ''}`}>
            {priority}
          </span>
          <span className="badge badge--category">{category}</span>
        </div>
        <div className="task-card__actions">
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${title}`}
          >
            Edit
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(task)}
            aria-label={`Delete task: ${title}`}
          >
            Delete
          </button>
        </div>
      </div>

      <h3 className="task-card__title">{title}</h3>

      {description && (
        <p className="task-card__description">{description}</p>
      )}

      <footer className="task-card__footer">
        <span className="task-card__date">Created {formatDate(createdAt)}</span>
      </footer>
    </article>
  );
}

export default TaskCard;
