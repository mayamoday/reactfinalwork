import { useState } from 'react'
import './TaskInput.css'

/**
 * TaskInput Component
 *
 * A controlled form component for adding new tasks.
 * Validates input and prevents submission of empty tasks.
 *
 * Props:
 * - onAddTask: Function to call when a new task is submitted
 */
function TaskInput({ onAddTask }) {
  // Local state for controlled input
  const [inputValue, setInputValue] = useState('')

  /**
   * Handles form submission
   * - Prevents default form submission behavior
   * - Trims and validates input value
   * - Calls onAddTask prop with the input value
   * - Clears input field after successful submission
   */
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent default form submission

    const trimmedValue = inputValue.trim() // Trim whitespace

    // Validate input is not empty
    if (trimmedValue === '') {
      return // Do not submit empty tasks
    }

    // Call parent's onAddTask function with the input value
    onAddTask(trimmedValue)

    // Clear input field after successful submission
    setInputValue('')
  }

  /**
   * Handles input value changes
   * Updates the controlled input state
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <div className="task-input-container">
        <label htmlFor="task-input" className="task-input-label">
          Add a new task
        </label>
        <input
          id="task-input"
          type="text"
          className="task-input-field"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          aria-label="New task description"
        />
        <button
          type="submit"
          className="task-input-submit"
          disabled={inputValue.trim() === ''}
          aria-label="Add task"
        >
          Add Task
        </button>
      </div>
    </form>
  )
}

export default TaskInput
