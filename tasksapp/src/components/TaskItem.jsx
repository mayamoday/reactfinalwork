import './TaskItem.css'

/**
 * TaskItem Component
 *
 * Displays a single task with interactive elements for completion toggle and deletion.
 * Currently implements read-only display with basic interactions (toggle, delete).
 * Edit functionality will be added in Task 4.1.
 *
 * Props:
 * - task: Task object with { id, text, completed }
 * - onToggle: Function to handle task completion toggle
 * - onEdit: Function to handle task editing (for future implementation)
 * - onDelete: Function to handle task deletion
 */
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  /**
   * Handles checkbox toggle for task completion status
   * Calls the onToggle prop with the task ID
   */
  const handleToggle = () => {
    onToggle(task.id)
  }

  /**
   * Handles task deletion
   * Calls the onDelete prop with the task ID
   */
  const handleDelete = () => {
    onDelete(task.id)
  }

  /**
   * Handles edit button click (placeholder for Task 4.1)
   * Currently just calls onEdit prop for future implementation
   */
  const handleEdit = () => {
    onEdit(task.id, task.text)
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        {/* Checkbox for completion status */}
        <label className="task-item__checkbox-label">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={handleToggle}
            aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="task-item__checkbox-custom" aria-hidden="true">
            {task.completed ? '✓' : ''}
          </span>
        </label>

        {/* Task text display */}
        <span
          className={`task-item__text ${task.completed ? 'task-item__text--completed' : ''}`}
          title={task.text}
        >
          {task.text}
        </span>

        {/* Action buttons */}
        <div className="task-item__actions">
          {/* Edit button (placeholder for Task 4.1) */}
          <button
            type="button"
            className="task-item__button task-item__button--edit"
            onClick={handleEdit}
            aria-label={`Edit task "${task.text}"`}
            title="Edit task"
          >
            ✎
          </button>

          {/* Delete button */}
          <button
            type="button"
            className="task-item__button task-item__button--delete"
            onClick={handleDelete}
            aria-label={`Delete task "${task.text}"`}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>
    </li>
  )
}

export default TaskItem
