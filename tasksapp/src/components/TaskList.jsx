import TaskItem from './TaskItem'
import './TaskList.css'

/**
 * TaskList Component
 *
 * Renders a list of tasks by mapping through the tasks array.
 * Handles empty state and passes callbacks to individual TaskItem components.
 *
 * Props:
 * - tasks: Array of task objects to display
 * - onToggle: Function to handle task completion toggle
 * - onEdit: Function to handle task editing
 * - onDelete: Function to handle task deletion
 */
function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  // Handle empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p className="empty-message">No tasks available.</p>
        <p className="empty-hint">Add a task above to get started!</p>
      </div>
    )
  }

  return (
    <div className="task-list-container" id="task-list">
      <ul className="task-list" role="list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
      <div className="task-list-summary">
        <p>{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
      </div>
    </div>
  )
}

export default TaskList
