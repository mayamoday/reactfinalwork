import { useState, useEffect, useCallback, useMemo } from 'react'
import TaskInput from './components/TaskInput'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import './App.css'
import './utils/testUtils.js' // Performance testing utilities
import './utils/browserCompatibility.js' // Browser compatibility testing

/**
 * App Component - Main Task Manager Application
 *
 * This is the root container component that manages all application state
 * and orchestrates data flow between child components. It implements:
 *
 * - Global state management for tasks and filters
 * - Data persistence via localStorage with error handling
 * - Performance optimizations with useCallback and useMemo
 * - Cross-browser compatible UUID generation
 * - Complete CRUD operations for task management
 *
 * @component
 * @example
 * return (
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 * )
 *
 * @since 1.0.0
 * @author Task Manager Team
 */
function App() {
  // State management with lazy initialization as backup
  const [tasks, setTasks] = useState([]) // Array of task objects
  const [filter, setFilter] = useState('all') // Filter type: 'all', 'active', 'completed'
  const [isLoaded, setIsLoaded] = useState(false) // Track if initial load is complete

  /**
   * Generates browser-compatible unique identifiers with fallback support
   *
   * Uses crypto.randomUUID() for modern browsers and falls back to a
   * manual UUID v4 implementation for older browsers.
   *
   * @returns {string} A valid UUID v4 string
   * @example
   * const taskId = generateUniqueId()
   * // Returns: "550e8400-e29b-41d4-a716-446655440000"
   */
  const generateUniqueId = useCallback(() => {
    // Try crypto.randomUUID() first (modern browsers)
    if (window.crypto && window.crypto.randomUUID) {
      return crypto.randomUUID()
    }

    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }, [])

  // Task 5.2: Load tasks from localStorage on app initialization
  useEffect(() => {
    const loadTasksFromStorage = () => {
      try {
        const savedTasks = localStorage.getItem('taskManagerTasks')
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks)
          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks)
          } else {
            console.warn('Invalid tasks data in localStorage - not an array')
            setTasks([])
          }
        } else {
          setTasks([])
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error)
        setTasks([])
      } finally {
        setIsLoaded(true)
      }
    }

    loadTasksFromStorage()
  }, []) // Empty dependency array - run once on mount

  // Task 5.1: Save tasks to localStorage whenever tasks change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('taskManagerTasks', JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  // Handler function: Add new task to tasks array (optimized with useCallback)
  const addTask = useCallback((text) => {
    // Validate input text
    const trimmedText = text.trim()
    if (!trimmedText) {
      return
    }

    // Generate unique ID using browser-compatible method
    const uniqueId = generateUniqueId()

    // Create task object with required structure
    const newTask = {
      id: uniqueId,
      text: trimmedText,
      completed: false
    }

    // Add to tasks array using spread operator for immutability
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask]
      return updatedTasks
    })
  }, []) // No dependencies - function is stable

  // Handler function: Toggle task completion status (optimized with useCallback)
  const toggleTask = useCallback((id) => {
    // Validate input ID
    if (!id) {
      return
    }

    // Map through tasks array to find and toggle the matching task
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        return prevTasks // Return unchanged array if task not found
      }

      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )

      return updatedTasks
    })
  }, []) // No dependencies - function is stable

  // Handler function: Update task text (optimized with useCallback)
  const editTask = useCallback((id, newText) => {
    // Validate inputs
    if (!id) {
      return
    }

    const trimmedText = newText.trim()
    if (!trimmedText) {
      return
    }

    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        return prevTasks // Return unchanged array if task not found
      }

      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, text: trimmedText } : task
      )

      return updatedTasks
    })
  }, []) // No dependencies - function is stable

  // Handler function: Remove task from array (optimized with useCallback)
  const deleteTask = useCallback((id) => {
    // Validate input ID
    if (!id) {
      return
    }

    // Filter tasks array to remove task with matching ID
    setTasks(prevTasks => {
      const taskToDelete = prevTasks.find(task => task.id === id)

      if (!taskToDelete) {
        return prevTasks // Return unchanged array if task not found
      }

      const filteredTasks = prevTasks.filter(task => task.id !== id)

      return filteredTasks
    })
  }, []) // No dependencies - function is stable

  // Handler function: Update filter state (optimized with useCallback)
  const changeFilter = useCallback((filterType) => {
    // Validate filter type
    const validFilters = ['all', 'active', 'completed']
    if (validFilters.includes(filterType)) {
      setFilter(filterType)
    } else {
      console.warn(`Invalid filter type: ${filterType}. Using 'all' as fallback.`)
      setFilter('all')
    }
  }, []) // No dependencies - function is stable

  // Handler function: Clear all completed tasks (new bonus feature)
  const clearCompleted = useCallback(() => {
    setTasks(prevTasks => {
      // Filter out all completed tasks, keeping only active ones
      const activeTasks = prevTasks.filter(task => !task.completed)
      return activeTasks
    })
  }, []) // No dependencies - function is stable

  // Calculate active task count (optimized with useMemo)
  const activeTaskCount = useMemo(() => {
    return tasks.filter(task => !task.completed).length
  }, [tasks])

  // Calculate completed task count (optimized with useMemo)
  const completedTaskCount = useMemo(() => {
    return tasks.filter(task => task.completed).length
  }, [tasks])

  /**
   * getFilteredTasks - Core filtering logic function (optimized with useMemo)
   * Returns filtered tasks based on current filter state
   */
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return []
    }

    switch (filter) {
      case 'active':
        // Return tasks where completed === false
        return tasks.filter(task => task && !task.completed)

      case 'completed':
        // Return tasks where completed === true
        return tasks.filter(task => task && task.completed)

      case 'all':
      default:
        // Return all valid tasks
        return tasks.filter(task => task && typeof task.id === 'string')
    }
  }, [tasks, filter]) // Recalculate only when tasks or filter changes

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="app-container">
        <header>
          <h1>M(a)y task manager</h1>
        </header>

        {/* Wrapper for side-by-side layout */}
        <div className="content-wrapper">
          <main id="main-content" className="app-main" role="main" aria-label="Task management interface">
            {/* Task Input Component - Implemented */}
            <TaskInput onAddTask={addTask} />

            {/* Task Filters Component - Fully Implemented */}
            <TaskFilters
              currentFilter={filter}
              activeTaskCount={activeTaskCount}
              completedTaskCount={completedTaskCount}
              onFilterChange={changeFilter}
              onClearCompleted={clearCompleted}
            />

            {/* Task List Component - Implemented */}
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onEdit={editTask}
              onDelete={deleteTask}
            />
          </main>

          {/* Summary sidebar for development */}
          <aside className="dev-info" role="complementary" aria-label="Task statistics">
            <h2 className="sr-only">Task Statistics</h2>
            <p>Total tasks: <span aria-live="polite">{tasks.length}</span></p>
            <p>Active tasks: <span aria-live="polite">{activeTaskCount}</span></p>
            <p>Current filter: <span aria-live="polite">{filter}</span></p>
            <p>Filtered tasks: <span aria-live="polite">{filteredTasks.length}</span></p>
            {tasks.length > 0 && (
              <div>
                <h3 className="sr-only">Recent Tasks</h3>
                <p>Recent tasks:</p>
                <ul aria-label="Most recent tasks">
                  {tasks.slice(-3).map(task => (
                    <li key={task.id}>
                      {task.completed ? '✅' : '⏳'} {task.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
