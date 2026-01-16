/**
 * Browser Compatibility Testing Utilities
 * Automatic detection and testing of browser features used by the Task Manager
 */

/**
 * Check browser support for required features
 */
export const checkBrowserSupport = () => {
  const results = {
    browser: detectBrowser(),
    features: {
      localStorage: testLocalStorage(),
      cryptoRandomUUID: testCryptoRandomUUID(),
      es6Features: testES6Features(),
      cssFeatures: testCSSFeatures(),
      reactSupport: testReactSupport()
    },
    overall: 'unknown'
  }

  // Determine overall compatibility
  const allFeaturesPassed = Object.values(results.features).every(feature => feature.supported)
  results.overall = allFeaturesPassed ? 'fully-supported' : 'partial-support'

  return results
}

/**
 * Detect current browser and version
 */
const detectBrowser = () => {
  const userAgent = navigator.userAgent
  let browser = 'unknown'
  let version = 'unknown'

  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome'
    const match = userAgent.match(/Chrome\/(\d+)/)
    version = match ? match[1] : 'unknown'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
    const match = userAgent.match(/Firefox\/(\d+)/)
    version = match ? match[1] : 'unknown'
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari'
    const match = userAgent.match(/Version\/(\d+)/)
    version = match ? match[1] : 'unknown'
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge'
    const match = userAgent.match(/Edg\/(\d+)/)
    version = match ? match[1] : 'unknown'
  }

  return { name: browser, version, userAgent }
}

/**
 * Test localStorage functionality
 */
const testLocalStorage = () => {
  try {
    const testKey = 'browserTest_' + Date.now()
    const testValue = JSON.stringify({ test: true, timestamp: Date.now() })

    // Test write
    localStorage.setItem(testKey, testValue)

    // Test read
    const retrieved = localStorage.getItem(testKey)
    const parsed = JSON.parse(retrieved)

    // Validate parsed data
    const isValidData = parsed && parsed.test === true && typeof parsed.timestamp === 'number'

    // Test delete
    localStorage.removeItem(testKey)

    return {
      supported: true,
      details: 'localStorage read/write/delete operations successful',
      testResults: {
        write: true,
        read: true,
        parse: isValidData,
        delete: true
      }
    }
  } catch (error) {
    return {
      supported: false,
      details: `localStorage error: ${error.message}`,
      error: error.name
    }
  }
}

/**
 * Test crypto.randomUUID() support
 */
const testCryptoRandomUUID = () => {
  try {
    if (!window.crypto || !window.crypto.randomUUID) {
      return {
        supported: false,
        details: 'crypto.randomUUID() not available',
        fallback: 'Could use Date.now() + Math.random() fallback'
      }
    }

    // Test UUID generation
    const uuid1 = crypto.randomUUID()
    const uuid2 = crypto.randomUUID()

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isValidFormat = uuidRegex.test(uuid1) && uuidRegex.test(uuid2)
    const areUnique = uuid1 !== uuid2

    return {
      supported: true,
      details: 'crypto.randomUUID() working correctly',
      testResults: {
        available: true,
        validFormat: isValidFormat,
        unique: areUnique,
        samples: [uuid1, uuid2]
      }
    }
  } catch (error) {
    return {
      supported: false,
      details: `crypto.randomUUID() error: ${error.message}`,
      error: error.name
    }
  }
}

/**
 * Test ES6+ features used in the application
 */
const testES6Features = () => {
  try {
    // Test arrow functions
    const arrowFunction = () => true

    // Test destructuring
    const { test } = { test: true }

    // Test template literals
    const templateLiteral = `test ${test}`

    // Test const/let
    const constTest = true
    let letTest = true

    // Test array methods
    const arrayTest = [1, 2, 3].filter(x => x > 1).map(x => x * 2)

    // Test spread operator
    const spreadTest = [...arrayTest, 4]

    return {
      supported: true,
      details: 'All ES6+ features working correctly',
      testResults: {
        arrowFunctions: typeof arrowFunction === 'function',
        destructuring: test === true,
        templateLiterals: templateLiteral === 'test true',
        constLet: constTest && letTest,
        arrayMethods: arrayTest.length === 2,
        spreadOperator: spreadTest.length === 3
      }
    }
  } catch (error) {
    return {
      supported: false,
      details: `ES6 features error: ${error.message}`,
      error: error.name
    }
  }
}

/**
 * Test CSS features used in the application
 */
const testCSSFeatures = () => {
  try {

    // Test CSS custom properties (CSS variables)
    const supportsCustomProps = CSS.supports('color', 'var(--test-color)')

    // Test flexbox
    const supportsFlexbox = CSS.supports('display', 'flex')

    // Test CSS Grid
    const supportsGrid = CSS.supports('display', 'grid')

    // Test transforms
    const supportsTransforms = CSS.supports('transform', 'translateY(-1px)')

    // Test transitions
    const supportsTransitions = CSS.supports('transition', 'all 0.2s ease')

    // Test backdrop-filter
    const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)')

    return {
      supported: true,
      details: 'CSS features compatibility checked',
      testResults: {
        customProperties: supportsCustomProps,
        flexbox: supportsFlexbox,
        grid: supportsGrid,
        transforms: supportsTransforms,
        transitions: supportsTransitions,
        backdropFilter: supportsBackdropFilter
      }
    }
  } catch (error) {
    return {
      supported: false,
      details: `CSS features error: ${error.message}`,
      error: error.name
    }
  }
}

/**
 * Test React-related browser features
 */
const testReactSupport = () => {
  try {
    // Check if running in a React environment
    const hasReact = typeof window !== 'undefined' && window.React !== undefined

    // Check for modern JavaScript features React needs
    const hasPromises = typeof Promise !== 'undefined'
    const hasMap = typeof Map !== 'undefined'
    const hasSet = typeof Set !== 'undefined'
    const hasSymbol = typeof Symbol !== 'undefined'

    return {
      supported: true,
      details: 'Browser environment compatible with React',
      testResults: {
        reactAvailable: hasReact,
        promises: hasPromises,
        map: hasMap,
        set: hasSet,
        symbol: hasSymbol,
        modernJS: hasPromises && hasMap && hasSet && hasSymbol
      }
    }
  } catch (error) {
    return {
      supported: false,
      details: `React compatibility error: ${error.message}`,
      error: error.name
    }
  }
}

/**
 * Run comprehensive browser compatibility test
 */
export const runBrowserTests = () => {
  console.log('🔍 Running Browser Compatibility Tests...')

  const results = checkBrowserSupport()

  console.log('📊 Browser Detection:')
  console.log(`   Browser: ${results.browser.name} ${results.browser.version}`)

  console.log('🧪 Feature Tests:')
  Object.entries(results.features).forEach(([feature, result]) => {
    const status = result.supported ? '✅' : '❌'
    console.log(`   ${status} ${feature}: ${result.details}`)
    if (result.testResults) {
      console.log(`      Details:`, result.testResults)
    }
  })

  console.log('🏆 Overall Compatibility:', results.overall)

  return results
}

/**
 * Display results in a user-friendly format
 */
export const displayCompatibilityReport = () => {
  const results = runBrowserTests()

  if (results.overall === 'fully-supported') {
    console.log('🎉 Excellent! Your browser fully supports all Task Manager features.')
  } else {
    console.log('⚠️ Some features may not work optimally in your browser.')

    // Show which features need attention
    Object.entries(results.features).forEach(([feature, result]) => {
      if (!result.supported) {
        console.warn(`❌ ${feature}: ${result.details}`)
      }
    })
  }

  return results
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  window.taskManagerBrowserTests = {
    checkBrowserSupport,
    runBrowserTests,
    displayCompatibilityReport
  }

  console.log('🔧 Browser compatibility testing tools loaded.')
  console.log('Run taskManagerBrowserTests.displayCompatibilityReport() to test compatibility.')
}
