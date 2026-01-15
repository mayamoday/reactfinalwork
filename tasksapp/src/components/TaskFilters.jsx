import './TaskFilters.css'

/**
 * TaskFilters Component
 *
 * Displays filter buttons and active task count with full functionality.
 * Implements comprehensive filtering interface for task management.
 *
 * Props:
 * - currentFilter: Current filter state ('all', 'active', 'completed')
 * - activeTaskCount: Number of active (incomplete) tasks
 * - onFilterChange: Function to change the current filter
 */
function TaskFilters({ currentFilter, activeTaskCount, onFilterChange }) {
  /**
   * Handles filter button clicks
   * Calls onFilterChange prop with the selected filter type
   */
  const handleFilterClick = (filterType) => {
    onFilterChange(filterType)
  }

  /**
   * Formats the task counter display with proper grammar
   * Handles singular/plural forms correctly
   */
  const formatTaskCounter = () => {
    if (activeTaskCount === 0) {
      return "No active tasks"
    } else if (activeTaskCount === 1) {
      return "1 task left"
    } else {
      return `${activeTaskCount} tasks left`
    }
  }

  return (
    <div className="task-filters" role="group" aria-label="Task filter options">
      {/* Active task counter */}
      <div className="task-filters__counter">
        <span className="task-counter" aria-live="polite" aria-atomic="true">
          {formatTaskCounter()}
        </span>
      </div>

      {/* Filter buttons */}
      <div className="task-filters__buttons" role="tablist" aria-label="Filter tasks">
        <button
          type="button"
          className={`task-filter-button ${currentFilter === 'all' ? 'task-filter-button--active' : ''}`}
          onClick={() => handleFilterClick('all')}
          role="tab"
          aria-selected={currentFilter === 'all'}
          aria-controls="task-list"
          aria-label="Show all tasks"
        >
          All
        </button>

        <button
          type="button"
          className={`task-filter-button ${currentFilter === 'active' ? 'task-filter-button--active' : ''}`}
          onClick={() => handleFilterClick('active')}
          role="tab"
          aria-selected={currentFilter === 'active'}
          aria-controls="task-list"
          aria-label={`Show active tasks (${activeTaskCount})`}
        >
          Active
        </button>

        <button
          type="button"
          className={`task-filter-button ${currentFilter === 'completed' ? 'task-filter-button--active' : ''}`}
          onClick={() => handleFilterClick('completed')}
          role="tab"
          aria-selected={currentFilter === 'completed'}
          aria-controls="task-list"
          aria-label="Show completed tasks"
        >
          Completed
        </button>
      </div>
    </div>
  )
}

export default TaskFilters
