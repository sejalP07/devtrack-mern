import './FilterBar.css';

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

/**
 * FilterBar — fully controlled, no internal state.
 *
 * Props:
 *   statusFilter    - current status value ('' means "All")
 *   priorityFilter  - current priority value ('' means "All")
 *   onStatusChange(value)   - called when status select changes
 *   onPriorityChange(value) - called when priority select changes
 *   onClear()               - resets both filters (search is preserved)
 */
function FilterBar({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
  onClear,
}) {
  const hasActiveFilters = statusFilter !== '' || priorityFilter !== '';

  return (
    <div className="filter-bar">
      {/* Status */}
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          className="filter-bar__select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-priority">
          Priority
        </label>
        <select
          id="filter-priority"
          className="filter-bar__select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Clear filters button — only shown when a filter is active */}
      {hasActiveFilters && (
        <div className="filter-bar__group filter-bar__group--clear">
          {/* invisible label keeps vertical alignment consistent */}
          <span className="filter-bar__label" aria-hidden="true">&nbsp;</span>
          <button
            className="btn btn--ghost filter-bar__clear-btn"
            onClick={onClear}
            type="button"
            aria-label="Clear all filters"
          >
            ✕ Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
