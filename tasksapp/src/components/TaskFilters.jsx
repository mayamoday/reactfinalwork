import './TaskFilters.css'

/**
 * TaskFilters Component (Placeholder)
 *
 * Displays filter buttons and active task count.
 * This is a placeholder implementation for Task 2.5 integration.
 * Full functionality will be implemented in Phase 4.
 *
 * Props:
 * - filter: Current filter state ('all', 'active', 'completed')
 * - activeTaskCount: Number of active (incomplete) tasks
 * - onChangeFilter: Function to change the current filter
 */
function TaskFilters({ filter, activeTaskCount, onChangeFilter }) {
  const handleFilterChange = (newFilter) => {
    onChangeFilter(newFilter)
  }

  return (
    <div className="task-filters">
      <div className="task-filters__count">
        <span className="task-count">
          {activeTaskCount} {activeTaskCount === 1 ? 'task' : 'tasks'} remaining
        </span>
      </div>

      <div className="task-filters__buttons">
        <button
          className={`filter-button ${filter === 'all' ? 'filter-button--active' : ''}`}
          onClick={() => handleFilterChange('all')}
          type="button"
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'active' ? 'filter-button--active' : ''}`}
          onClick={() => handleFilterChange('active')}
          type="button"
        >
          Active
        </button>
        <button
          className={`filter-button ${filter === 'completed' ? 'filter-button--active' : ''}`}
          onClick={() => handleFilterChange('completed')}
          type="button"
        >
          Completed
        </button>
      </div>
    </div>
  )
}

export default TaskFilters
