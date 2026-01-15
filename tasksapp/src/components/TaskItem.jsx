import { useState } from 'react'
import './TaskItem.css'

/**
 * TaskItem Component
 *
 * Displays a single task with interactive elements for completion toggle, editing, and deletion.
 * Implements full edit functionality with inline editing capabilities.
 *
 * Props:
 * - task: Task object with { id, text, completed }
 * - onToggle: Function to handle task completion toggle
 * - onEdit: Function to handle task editing
 * - onDelete: Function to handle task deletion
 */
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  // Local state for edit functionality
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

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
   * Handles edit button click - enters edit mode
   * Sets isEditing to true and initializes editText with current task text
   */
  const handleEdit = () => {
    setIsEditing(true)
    setEditText(task.text)
  }

  /**
   * Handles save operation - commits the edit
   * Trims editText, validates it's not empty, calls onEdit, and exits edit mode
   */
  const handleSave = () => {
    const trimmedText = editText.trim()

    if (!trimmedText) {
      // Don't save empty text - could show error message or just return
      return
    }

    onEdit(task.id, trimmedText)
    setIsEditing(false)
  }

  /**
   * Handles cancel operation - discards changes
   * Sets isEditing to false and resets editText to original
   */
  const handleCancel = () => {
    setIsEditing(false)
    setEditText(task.text) // Reset to original text
  }

  /**
   * Handles input changes during editing
   */
  const handleInputChange = (e) => {
    setEditText(e.target.value)
  }

  /**
   * Handles keyboard events during editing
   * Enter to save, Escape to cancel
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''} ${isEditing ? 'task-item--editing' : ''}`}>
      <div className="task-item__content">
        {/* Checkbox for completion status */}
        <label className="task-item__checkbox-label">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={handleToggle}
            disabled={isEditing} // Disable checkbox during editing
            aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="task-item__checkbox-custom" aria-hidden="true">
            {task.completed ? '✓' : ''}
          </span>
        </label>

        {/* Conditional rendering: Edit mode vs View mode */}
        {isEditing ? (
          // Edit mode: input field
          <input
            type="text"
            className="task-item__edit-input"
            value={editText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Edit task text"
          />
        ) : (
          // View mode: task text display
          <span
            className={`task-item__text ${task.completed ? 'task-item__text--completed' : ''}`}
            title={task.text}
          >
            {task.text}
          </span>
        )}

        {/* Action buttons - conditional rendering */}
        <div className="task-item__actions">
          {isEditing ? (
            // Edit mode: Save and Cancel buttons
            <>
              <button
                type="button"
                className="task-item__button task-item__button--save"
                onClick={handleSave}
                disabled={!editText.trim()}
                aria-label="Save changes"
                title="Save changes (Enter)"
              >
                ✓
              </button>
              <button
                type="button"
                className="task-item__button task-item__button--cancel"
                onClick={handleCancel}
                aria-label="Cancel editing"
                title="Cancel changes (Escape)"
              >
                ✕
              </button>
            </>
          ) : (
            // View mode: Edit and Delete buttons
            <>
              <button
                type="button"
                className="task-item__button task-item__button--edit"
                onClick={handleEdit}
                disabled={task.completed} // Disable edit for completed tasks
                aria-label={`Edit task "${task.text}"`}
                title="Edit task"
              >
                ✎
              </button>
              <button
                type="button"
                className="task-item__button task-item__button--delete"
                onClick={handleDelete}
                aria-label={`Delete task "${task.text}"`}
                title="Delete task"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export default TaskItem
