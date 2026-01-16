/**
 * Performance Test Utility
 * Generates test data for performance testing with large numbers of tasks
 */

/**
 * Generates a specified number of test tasks for performance testing
 * @param {number} count - Number of tasks to generate (default: 50)
 * @returns {Array} Array of task objects
 */
export const generateTestTasks = (count = 50) => {
  const tasks = []
  const taskTypes = [
    'Complete project documentation',
    'Review pull requests',
    'Update team wiki',
    'Prepare presentation slides',
    'Conduct code review',
    'Write unit tests',
    'Update dependencies',
    'Fix bug reports',
    'Implement new feature',
    'Optimize database queries',
    'Update API documentation',
    'Design system improvements',
    'Security audit',
    'Performance optimization',
    'User experience research'
  ]

  for (let i = 0; i < count; i++) {
    const randomTaskType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
    const taskNumber = i + 1
    const isCompleted = Math.random() > 0.6 // 40% chance of being completed

    tasks.push({
      id: crypto.randomUUID(),
      text: `${randomTaskType} #${taskNumber}`,
      completed: isCompleted
    })
  }

  return tasks
}

/**
 * Loads test data into localStorage for performance testing
 * @param {number} count - Number of tasks to generate
 */
export const loadTestData = (count = 50) => {
  const testTasks = generateTestTasks(count)
  localStorage.setItem('taskManagerTasks', JSON.stringify(testTasks))
  console.log(`🧪 Generated ${count} test tasks for performance testing`)
  console.log(`📊 Breakdown: ${testTasks.filter(t => !t.completed).length} active, ${testTasks.filter(t => t.completed).length} completed`)
}

/**
 * Clears test data from localStorage
 */
export const clearTestData = () => {
  localStorage.removeItem('taskManagerTasks')
  console.log('🧹 Cleared test data from localStorage')
}

/**
 * Measures render performance (for manual testing in browser console)
 */
export const measurePerformance = () => {
  const start = performance.now()

  // Force a re-render by triggering a small state change
  window.dispatchEvent(new Event('resize'))

  requestAnimationFrame(() => {
    const end = performance.now()
    console.log(`⏱️ Render time: ${(end - start).toFixed(2)}ms`)
  })
}

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  window.taskManagerTestUtils = {
    generateTestTasks,
    loadTestData,
    clearTestData,
    measurePerformance
  }

  console.log('🔧 Task Manager Test Utils loaded. Available functions:')
  console.log('- taskManagerTestUtils.loadTestData(count) - Load test tasks')
  console.log('- taskManagerTestUtils.clearTestData() - Clear test data')
  console.log('- taskManagerTestUtils.measurePerformance() - Measure render performance')
}
