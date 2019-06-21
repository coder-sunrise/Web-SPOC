import React from 'react'

import ErrorPage from '../pages/404'
class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch (error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    console.error(error)
    console.error(errorInfo)

    this.setState({
      error,
      errorInfo,
    })
    // You can also log error messages to an error reporting service here
  }

  render () {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
      // return <ErrorPage />
    }
    // Normally, just render children
    return this.props.children
  }
}

export default ErrorBoundary
