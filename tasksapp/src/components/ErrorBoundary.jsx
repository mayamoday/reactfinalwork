import React from 'react'
import './ErrorBoundary.css'

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleResetError = () => {
    // Reset error state to retry
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReloadApp = () => {
    // Reload the entire application
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">⚠️</div>
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__message">
              We're sorry, but something unexpected happened.
              You can try refreshing the page or contact support if the problem persists.
            </p>

            <div className="error-boundary__actions">
              <button
                onClick={this.handleResetError}
                className="error-boundary__button error-boundary__button--retry"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReloadApp}
                className="error-boundary__button error-boundary__button--reload"
              >
                Reload App
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-boundary__details">
                <summary>Error Details (Development)</summary>
                <pre className="error-boundary__stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
