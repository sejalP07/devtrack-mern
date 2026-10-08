import { useState, useEffect } from 'react';
import './TaskForm.css';

const STATUS_OPTIONS  = ['Todo', 'In Progress', 'Done'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const CATEGORY_OPTIONS = ['Frontend', 'Backend', 'Database', 'DevOps', 'Other'];

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  category: 'Other',
};

/**
 * Client-side validation — mirrors the Mongoose schema rules.
 * Returns an errors object: { field: 'message' }
 */
const validate = (values) => {
  const errors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters.';
  }

  if (values.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  return errors;
};

/**
 * TaskForm — shared Create / Edit form
 *
 * Props:
 *   initialValues  - task object for edit mode; null/undefined for create mode
 *   onSubmit(data) - async function called with the form payload
 *   onCancel()     - called when user closes the form without submitting
 *   isOpen         - controls render (unmounts form when closed to reset state)
 */
function TaskForm({ initialValues, onSubmit, onCancel, isOpen }) {
  const isEditMode = Boolean(initialValues);

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync form values when initialValues changes (switching between tasks)
  useEffect(() => {
    if (isOpen) {
      setValues(
        initialValues
          ? {
              title: initialValues.title || '',
              description: initialValues.description || '',
              status: initialValues.status || 'Todo',
              priority: initialValues.priority || 'Medium',
              category: initialValues.category || 'Other',
            }
          : EMPTY_FORM
      );
      setErrors({});
      setApiError('');
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
        priority: values.priority,
        category: values.category,
      });
      // Reset after successful create (edit mode: parent closes the form)
      if (!isEditMode) {
        setValues(EMPTY_FORM);
      }
    } catch (err) {
      // Surface API validation messages if available
      const apiMsg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setApiError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const descCount = values.description.length;
  const descOver  = descCount > 500;
  const titleCount = values.title.length;
  const titleOver  = titleCount > 100;

  return (
    <div className="task-form-overlay" role="presentation">
      <div
        className="task-form-panel"
        role="dialog"
        aria-modal="true"
        aria-label={isEditMode ? 'Edit task' : 'Create task'}
      >
        {/* ── Header ── */}
        <div className="task-form__header">
          <h2 className="task-form__title">
            {isEditMode ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            className="task-form__close"
            onClick={onCancel}
            aria-label="Close form"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        {/* ── API error banner ── */}
        {apiError && (
          <div className="task-form__api-error" role="alert">
            ⚠️ {apiError}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className={`form-group ${errors.title ? 'form-group--error' : ''}`}>
            <label className="form-label" htmlFor="title">
              Title <span className="form-required" aria-hidden="true">*</span>
              <span className={`form-char-count ${titleOver ? 'form-char-count--over' : ''}`}>
                {titleCount}/100
              </span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              value={values.title}
              onChange={handleChange}
              placeholder="e.g. Set up CI pipeline"
              maxLength={105} /* allow a few extra so user sees truncation error */
              aria-required="true"
              aria-describedby={errors.title ? 'title-error' : undefined}
              disabled={submitting}
            />
            {errors.title && (
              <span className="form-error" id="title-error" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className={`form-group ${errors.description ? 'form-group--error' : ''}`}>
            <label className="form-label" htmlFor="description">
              Description
              <span className={`form-char-count ${descOver ? 'form-char-count--over' : ''}`}>
                {descCount}/500
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={values.description}
              onChange={handleChange}
              placeholder="Optional description…"
              rows={3}
              aria-describedby={errors.description ? 'description-error' : undefined}
              disabled={submitting}
            />
            {errors.description && (
              <span className="form-error" id="description-error" role="alert">
                {errors.description}
              </span>
            )}
          </div>

          {/* Status / Priority / Category row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={values.status}
                onChange={handleChange}
                disabled={submitting}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={values.priority}
                onChange={handleChange}
                disabled={submitting}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={values.category}
                onChange={handleChange}
                disabled={submitting}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className="task-form__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting
                ? isEditMode ? 'Updating…' : 'Creating…'
                : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
