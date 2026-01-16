import { memo } from 'react'
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
      <section className="task-list-empty" role="region" aria-label="Task list status">
        <h2 className="sr-only">Task List Status</h2>
        <p className="empty-message" role="status">No tasks available.</p>
        <p className="empty-hint">Add a task above to get started!</p>
      </section>
    )
  }

  return (
    <section className="task-list-container" id="task-list" role="region" aria-labelledby="task-list-heading">
      <h2 id="task-list-heading" className="sr-only">Task List</h2>
      <ul className="task-list" role="list" aria-label={`${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}>
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
      <div className="task-list-summary" role="status" aria-live="polite">
        <p aria-label={`${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
        </p>
      </div>
    </section>
  )
}

export default memo(TaskList)
