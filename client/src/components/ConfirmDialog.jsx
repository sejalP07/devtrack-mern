import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

/**
 * ConfirmDialog
 * Props:
 *   isOpen    - boolean, controls visibility
 *   title     - dialog heading text
 *   message   - body copy
 *   onConfirm - called when user clicks Delete
 *   onCancel  - called when user clicks Cancel or presses Escape
 *   isLoading - disables buttons while the delete request is in flight
 */
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
  const cancelRef = useRef(null);

  // Auto-focus Cancel button when dialog opens (safer default for destructive action)
  useEffect(() => {
    if (isOpen && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    /* Backdrop — click outside to cancel */
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <div className="dialog__icon" aria-hidden="true">🗑️</div>

        <h2 className="dialog__title" id="dialog-title">
          {title}
        </h2>

        <p className="dialog__message" id="dialog-message">
          {message}
        </p>

        <div className="dialog__actions">
          <button
            ref={cancelRef}
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn--delete"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
