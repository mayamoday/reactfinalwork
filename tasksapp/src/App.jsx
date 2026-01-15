import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import './App.css'

function App() {
  // State management with lazy initialization to load from localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('taskManagerTasks')
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks)
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error)
        return []
      }
    }
    return []
  }) // Array of task objects
  const [filter, setFilter] = useState('all') // Filter type: 'all', 'active', 'completed'

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskManagerTasks', JSON.stringify(tasks))
  }, [tasks])

  // Handler function: Add new task to tasks array
  const addTask = (text) => {
    // Validate input text
    const trimmedText = text.trim()
    if (!trimmedText) {
      console.warn('Cannot add empty task')
      return
    }

    // Generate unique ID using crypto.randomUUID()
    const uniqueId = crypto.randomUUID()

    // Create task object with required structure
    const newTask = {
      id: uniqueId,
      text: trimmedText,
      completed: false
    }

    // Add to tasks array using spread operator for immutability
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask]
      console.log(`Added task: "${trimmedText}" with ID: ${uniqueId}`)
      console.log(`Total tasks: ${updatedTasks.length}`)
      return updatedTasks
    })
  }

  // Handler function: Toggle task completion status
  const toggleTask = (id) => {
    // Validate input ID
    if (!id) {
      console.warn('Cannot toggle task: No ID provided')
      return
    }

    // Map through tasks array to find and toggle the matching task
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        console.warn(`Cannot toggle task: Task with ID "${id}" not found`)
        return prevTasks // Return unchanged array if task not found
      }

      const taskToToggle = prevTasks[taskIndex]
      const newCompletedState = !taskToToggle.completed

      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: newCompletedState } : task
      )

      console.log(`Toggled task: "${taskToToggle.text}" (ID: ${id})`)
      console.log(`Status changed: ${taskToToggle.completed ? 'completed' : 'active'} → ${newCompletedState ? 'completed' : 'active'}`)

      return updatedTasks
    })
  }

  // Handler function: Update task text
  const editTask = (id, newText) => {
    // Validate inputs
    if (!id) {
      console.warn('Cannot edit task: No ID provided')
      return
    }

    const trimmedText = newText.trim()
    if (!trimmedText) {
      console.warn('Cannot edit task: Empty text provided')
      return
    }

    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        console.warn(`Cannot edit task: Task with ID "${id}" not found`)
        return prevTasks // Return unchanged array if task not found
      }

      const taskToEdit = prevTasks[taskIndex]
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, text: trimmedText } : task
      )

      console.log(`Edited task: "${taskToEdit.text}" → "${trimmedText}" (ID: ${id})`)

      return updatedTasks
    })
  }

  // Handler function: Remove task from array
  const deleteTask = (id) => {
    // Validate input ID
    if (!id) {
      console.warn('Cannot delete task: No ID provided')
      return
    }

    // Filter tasks array to remove task with matching ID
    setTasks(prevTasks => {
      const taskToDelete = prevTasks.find(task => task.id === id)

      if (!taskToDelete) {
        console.warn(`Cannot delete task: Task with ID "${id}" not found`)
        return prevTasks // Return unchanged array if task not found
      }

      const filteredTasks = prevTasks.filter(task => task.id !== id)
      console.log(`Deleted task: "${taskToDelete.text}" (ID: ${id})`)
      console.log(`Remaining tasks: ${filteredTasks.length}`)

      return filteredTasks
    })
  }

  // Handler function: Update filter state
  const changeFilter = (filterType) => {
    // Validate filter type
    const validFilters = ['all', 'active', 'completed']
    if (validFilters.includes(filterType)) {
      setFilter(filterType)
      console.log(`Filter changed to: ${filterType}`)
    } else {
      console.warn(`Invalid filter type: ${filterType}. Using 'all' as fallback.`)
      setFilter('all')
    }
  }

  // Calculate active task count (tasks where completed === false)
  const activeTaskCount = tasks.filter(task => !task.completed).length

  /**
   * getFilteredTasks - Core filtering logic function
   * Returns filtered tasks based on current filter state
   *
   * @param {Array} tasksArray - Array of task objects
   * @param {string} currentFilter - Current filter type ('all', 'active', 'completed')
   * @returns {Array} Filtered array of tasks
   */
  const getFilteredTasks = (tasksArray, currentFilter) => {
    if (!Array.isArray(tasksArray)) {
      console.warn('Invalid tasks array provided to getFilteredTasks')
      return []
    }

    switch (currentFilter) {
      case 'active':
        // Return tasks where completed === false
        return tasksArray.filter(task => task && !task.completed)

      case 'completed':
        // Return tasks where completed === true
        return tasksArray.filter(task => task && task.completed)

      case 'all':
      default:
        // Return all tasks (with safety check)
        return tasksArray.filter(task => task && typeof task.id === 'string')
    }
  }

  // Get filtered tasks using the enhanced function
  const filteredTasks = getFilteredTasks(tasks, filter)

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {/* Task Input Component - Implemented */}
      <TaskInput onAddTask={addTask} />

      {/* Task Filters Component - Fully Implemented */}
      <TaskFilters
        currentFilter={filter}
        activeTaskCount={activeTaskCount}
        onFilterChange={changeFilter}
      />

      {/* Task List Component - Implemented */}
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onEdit={editTask}
        onDelete={deleteTask}
      />

      {/* Temporary display for development */}
      <div className="dev-info">
        <p>Total tasks: {tasks.length}</p>
        <p>Active tasks: {activeTaskCount}</p>
        <p>Current filter: {filter}</p>
        <p>Filtered tasks: {filteredTasks.length}</p>
        {tasks.length > 0 && (
          <div>
            <p>Recent tasks:</p>
            <ul>
              {tasks.slice(-3).map(task => (
                <li key={task.id}>
                  {task.completed ? '✅' : '⏳'} {task.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
