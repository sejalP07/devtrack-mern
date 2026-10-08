import { useState, useEffect } from 'react';
import './SearchBar.css';

/**
 * SearchBar
 *
 * Maintains its own input state and debounces the outgoing value.
 * The parent receives debounced changes via onSearchChange — it never
 * gets called on every keystroke.
 *
 * Props:
 *   value          - controlled value from parent (used to reset externally)
 *   onSearchChange - called with debounced search string
 *   isSearching    - shows a subtle loading indicator while the API is in flight
 *   debounceMs     - debounce delay in ms (default 400)
 */
function SearchBar({ value, onSearchChange, isSearching, debounceMs = 400 }) {
  // Local state for the input so every keystroke feels instant
  const [inputValue, setInputValue] = useState(value || '');

  // Keep local input in sync when parent resets the value (e.g. clear all)
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Debounce: wait until the user stops typing before notifying the parent
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue.trim());
    }, debounceMs);

    // Cleanup cancels the pending call if the user keeps typing
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, onSearchChange]);

  const handleClear = () => {
    setInputValue('');
    // Notify immediately on explicit clear — no debounce needed
    onSearchChange('');
  };

  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="task-search">
        Search
      </label>
      <div className="search-bar__input-wrap">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>

        <input
          id="task-search"
          type="search"
          className="search-bar__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search tasks…"
          autoComplete="off"
          aria-label="Search tasks by title or description"
        />

        {/* Show spinner OR clear — never both at right edge */}
        {isSearching ? (
          <span className="search-bar__spinner" aria-label="Searching…" />
        ) : (
          inputValue && (
            <button
              className="search-bar__clear"
              onClick={handleClear}
              aria-label="Clear search"
              type="button"
            >
              ✕
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default SearchBar;
