import { useState, memo } from 'react'
import './TaskInput.css'

/**
 * TaskInput Component - Task Creation Interface
 *
 * A fully accessible, controlled form component for adding new tasks.
 * Features comprehensive input validation, visual feedback, and WCAG 2.1 AA+ compliance.
 *
 * Key Features:
 * - Real-time input validation with user feedback
 * - Visual animations for form submission states
 * - Complete keyboard navigation support (Tab, Enter)
 * - Screen reader optimization with ARIA attributes
 * - Automatic input clearing after successful submission
 * - Error prevention for empty or whitespace-only tasks
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onAddTask - Callback function called when task is submitted
 * @returns {JSX.Element} Rendered task input form
 *
 * @example
 * // Basic usage in parent component
 * const handleAddTask = (taskText) => {
 *   console.log('New task:', taskText)
 * }
 *
 * return (
 *   <TaskInput onAddTask={handleAddTask} />
 * )
 *
 * @since 1.0.0
 * @accessibility WCAG 2.1 AA+ compliant with full screen reader support
 */
function TaskInput({ onAddTask }) {
  // Local state for controlled input
  const [inputValue, setInputValue] = useState('')

  // Animation states for visual feedback
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  /**
   * Handles form submission with comprehensive validation and visual feedback
   *
   * Process:
   * 1. Prevents default form submission behavior
   * 2. Trims and validates input value for empty/whitespace content
   * 3. Shows submission animation for user feedback
   * 4. Calls parent's onAddTask callback with validated text
   * 5. Displays success animation and clears input
   * 6. Handles any errors gracefully
   *
   * @param {Event} e - Form submission event
   * @async
   * @example
   * // Form submission triggered by:
   * // - Enter key press in input field
   * // - Click on "Add Task" button
   */
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    const trimmedValue = inputValue.trim() // Trim whitespace

    // Validate input is not empty
    if (trimmedValue === '') {
      return // Do not submit empty tasks
    }

    // Start submission animation
    setIsSubmitting(true)

    try {
      // Small delay to show submitting state
      await new Promise(resolve => setTimeout(resolve, 200))

      // Call parent's onAddTask function with the input value
      onAddTask(trimmedValue)

      // Show success animation
      setShowSuccess(true)

      // Clear input field after successful submission
      setInputValue('')
      setIsTyping(false)

      // Reset success animation after delay
      setTimeout(() => {
        setShowSuccess(false)
      }, 600)

    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles input value changes with typing indicator
   * Updates the controlled input state and manages typing animation
   */
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)

    // Manage typing state for visual feedback
    if (value.length > 0 && !isTyping) {
      setIsTyping(true)
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false)
    }
  }

  // Build dynamic class names for animations
  const containerClasses = [
    'task-input-container',
    isSubmitting && 'task-input-container--submitting',
    showSuccess && 'task-input-container--success'
  ].filter(Boolean).join(' ')

  const fieldClasses = [
    'task-input-field',
    isTyping && 'task-input-field--typing'
  ].filter(Boolean).join(' ')

  const buttonClasses = [
    'task-input-submit',
    isSubmitting && 'task-input-submit--loading'
  ].filter(Boolean).join(' ')

  return (
    <section aria-labelledby="add-task-heading">
      <h2 id="add-task-heading" className="sr-only">Add New Task</h2>
      <form className="task-input-form" onSubmit={handleSubmit} role="form" aria-label="Add new task form">
        <div className={containerClasses}>
          <label htmlFor="task-input" className="task-input-label">
            Add a new task
          </label>
          <input
            id="task-input"
            type="text"
            className={fieldClasses}
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isSubmitting}
            aria-label="New task description"
            aria-required="true"
            aria-describedby={inputValue.trim() === '' ? 'task-input-help' : 'task-input-status'}
          />
          {inputValue.trim() === '' && (
            <div id="task-input-help" className="sr-only" role="status" aria-live="polite">
              Task description is required
            </div>
          )}
          <button
            type="submit"
            className={buttonClasses}
            disabled={inputValue.trim() === '' || isSubmitting}
            aria-label={isSubmitting ? "Adding task..." : "Add task"}
            aria-describedby="task-input-status"
          >
            <span>{isSubmitting ? "Adding..." : "Add Task"}</span>
          </button>
          <div id="task-input-status" className="sr-only" role="status" aria-live="polite">
            {showSuccess ? "Task added successfully" : ""}
          </div>
        </div>
      </form>
    </section>
  )
}

export default memo(TaskInput)
