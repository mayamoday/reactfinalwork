import { useState, memo } from 'react'
import './TaskItem.css'

/**
 * TaskItem Component
 *
 * Displays a single task with interactive elements for completion toggle, editing, and deletion.
 * Implements full edit functionality with inline editing capabilities.
 * Enhanced with visual polish and feedback animations for Task 6.8.
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

  // Animation states for visual feedback
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)

  /**
   * Handles checkbox toggle for task completion status with animation
   * Calls the onToggle prop with the task ID
   */
  const handleToggle = () => {
    // Trigger completion animation
    setIsCompleting(true)
    setIsInteracting(true)

    // Small delay to show animation before state change
    setTimeout(() => {
      onToggle(task.id)
      setIsCompleting(false)
      setIsInteracting(false)
    }, 150)
  }

  /**
   * Handles task deletion with fade-out animation
   * Calls the onDelete prop with the task ID
   */
  const handleDelete = () => {
    // Trigger delete animation
    setIsDeleting(true)

    // Delay actual deletion to show fade-out animation
    setTimeout(() => {
      onDelete(task.id)
    }, 400) // Match animation duration
  }

  /**
   * Handles edit button click - enters edit mode
   * Sets isEditing to true and initializes editText with current task text
   */
  const handleEdit = () => {
    setIsInteracting(true)
    setTimeout(() => {
      setIsEditing(true)
      setEditText(task.text)
      setIsInteracting(false)
    }, 100)
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

    setIsInteracting(true)
    onEdit(task.id, trimmedText)

    setTimeout(() => {
      setIsEditing(false)
      setIsInteracting(false)
    }, 100)
  }

  /**
   * Handles cancel operation - discards changes
   * Sets isEditing to false and resets editText to original
   */
  const handleCancel = () => {
    setIsInteracting(true)
    setTimeout(() => {
      setIsEditing(false)
      setEditText(task.text) // Reset to original text
      setIsInteracting(false)
    }, 100)
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

  /**
   * Handles keyboard events for checkbox (Space key toggle)
   */
  const handleCheckboxKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  // Build dynamic class names for animations
  const itemClasses = [
    'task-item',
    task.completed && 'task-item--completed',
    isEditing && 'task-item--editing',
    isCompleting && 'task-item--completing',
    isDeleting && 'task-item--deleting',
    isInteracting && 'task-item--interacting'
  ].filter(Boolean).join(' ')

  return (
    <li className={itemClasses} role="listitem">
      <div className="task-item__content" role="group" aria-label={`Task: ${task.text}`}>
        {/* Checkbox for completion status */}
        <label className="task-item__checkbox-label">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={handleToggle}
            onKeyDown={handleCheckboxKeyDown}
            disabled={isEditing || isDeleting} // Disable during edit or deletion
            aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
            aria-checked={task.completed}
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
            aria-describedby="edit-instructions"
            role="textbox"
            aria-required="true"
          />
        ) : (
          // View mode: task text display
          <span
            className={`task-item__text ${task.completed ? 'task-item__text--completed' : ''}`}
            title={task.text}
            role="text"
            aria-label={`Task text: ${task.text}${task.completed ? ' (completed)' : ' (active)'}`}
          >
            {task.text}
          </span>
        )}

        {/* Hidden instructions for screen readers */}
        <div id="edit-instructions" className="sr-only">
          Press Enter to save changes, Escape to cancel
        </div>

        {/* Action buttons - conditional rendering */}
        <div className="task-item__actions" role="group" aria-label="Task actions">
          {isEditing ? (
            // Edit mode: Save and Cancel buttons
            <>
              <button
                type="button"
                className="task-item__button task-item__button--save"
                onClick={handleSave}
                disabled={!editText.trim() || isInteracting}
                aria-label="Save changes to task"
                title="Save changes (Enter)"
              >
                <span aria-hidden="true">✓</span>
                <span className="sr-only">Save</span>
              </button>
              <button
                type="button"
                className="task-item__button task-item__button--cancel"
                onClick={handleCancel}
                disabled={isInteracting}
                aria-label="Cancel editing task"
                title="Cancel changes (Escape)"
              >
                <span aria-hidden="true">✕</span>
                <span className="sr-only">Cancel</span>
              </button>
            </>
          ) : (
            // View mode: Edit and Delete buttons
            <>
              <button
                type="button"
                className="task-item__button task-item__button--edit"
                onClick={handleEdit}
                disabled={task.completed || isDeleting || isInteracting} // Disable edit for completed tasks
                aria-label={`Edit task "${task.text}"`}
                title={task.completed ? "Cannot edit completed task" : "Edit task"}
              >
                <span aria-hidden="true">✎</span>
                <span className="sr-only">Edit</span>
              </button>
              <button
                type="button"
                className="task-item__button task-item__button--delete"
                onClick={handleDelete}
                disabled={isDeleting || isInteracting}
                aria-label={`Delete task "${task.text}"`}
                title="Delete task"
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Delete</span>
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export default memo(TaskItem)
