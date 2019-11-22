import React from 'react'
// import ErrorPage from '../pages/404'
import ErrorPage from '@/pages/500'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, count: 0 }

    // console.log('ErrorBoundary')
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, url: window.location.href }
  }

  /*
    @changed by ZheBin
    change setState to getDerivedStateFromError because
    setState in componentDidCatch will be deprecated in future release
    source link: https://reactjs.org/docs/react-component.html#componentdidcatch
  */
  // componentDidCatch (error, errorInfo) {
  //   // Catch errors in any components below and re-render with error message
  //   // You can also log error messages to an error reporting service here
  //   console.error(error)
  //   console.error(errorInfo)

  //   // if (process.env.NODE_ENV === 'development') {
  //   //   this.setState((prevError) => {
  //   //     errorCount += 1
  //   //     return {
  //   //       error,
  //   //       errorInfo,
  //   //       count: prevError.count + 1,
  //   //     }
  //   //   })
  //   //
  //   // }
  // }

  // componentDidMount () {
  //   console.log('ErrorBoundary componentDidMount')
  // }

  render () {
    if (this.state.hasError && window.location.href === this.state.url) {
      // Error path
      if (process.env.NODE_ENV === 'development') {
        return (
          <div>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              <p>Stack trace</p>
              {this.state.error.stack}
            </details>
          </div>
        )
      }
      return <ErrorPage />
    }

    // Normally, just render children
    return this.props.children
  }
}

export default ErrorBoundary
