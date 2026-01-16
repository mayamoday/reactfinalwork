import { memo } from 'react'
import './TaskFilters.css'

/**
 * TaskFilters Component
 *
 * Displays filter buttons, active task count, and Clear Completed functionality.
 * Implements comprehensive filtering interface for task management.
 *
 * Props:
 * - currentFilter: Current filter state ('all', 'active', 'completed')
 * - activeTaskCount: Number of active (incomplete) tasks
 * - completedTaskCount: Number of completed tasks
 * - onFilterChange: Function to change the current filter
 * - onClearCompleted: Function to clear all completed tasks
 */
function TaskFilters({ currentFilter, activeTaskCount, completedTaskCount, onFilterChange, onClearCompleted }) {
  /**
   * Handles filter button clicks
   * Calls onFilterChange prop with the selected filter type
   */
  const handleFilterClick = (filterType) => {
    onFilterChange(filterType)
  }

  /**
   * Handles Clear Completed button click
   * Calls onClearCompleted prop to remove all completed tasks
   */
  const handleClearCompleted = () => {
    onClearCompleted()
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
    <section className="task-filters" role="region" aria-labelledby="task-filters-heading">
      <h2 id="task-filters-heading" className="sr-only">Task Filters and Status</h2>

      {/* Active task counter */}
      <div className="task-filters__counter" role="status">
        <span className="task-counter" aria-live="polite" aria-atomic="true" aria-label="Task count status">
          {formatTaskCounter()}
        </span>
      </div>

      {/* Filter buttons */}
      <div className="task-filters__buttons" role="tablist" aria-label="Filter tasks by status">
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

      {/* Clear Completed button - only show if there are completed tasks */}
      {completedTaskCount > 0 && (
        <div className="task-filters__clear">
          <button
            type="button"
            className="task-clear-button"
            onClick={handleClearCompleted}
            aria-label={`Clear ${completedTaskCount} completed task${completedTaskCount !== 1 ? 's' : ''}`}
            title={`Remove ${completedTaskCount} completed task${completedTaskCount !== 1 ? 's' : ''}`}
          >
            Clear Completed
          </button>
        </div>
      )}
    </section>
  )
}

export default memo(TaskFilters)
