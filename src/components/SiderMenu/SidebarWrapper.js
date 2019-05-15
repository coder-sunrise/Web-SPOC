import PerfectScrollbar from 'perfect-scrollbar'
import React from 'react'
import PropTypes from 'prop-types'

let ps

// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  componentDidMount () {
    if (navigator.platform.indexOf('Win') > -1 && this.refs.sidebarWrapper) {
      ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
    }
  }

  componentWillUnmount () {
    if (navigator.platform.indexOf('Win') > -1 && ps) {
      ps.destroy()
    }
  }

  render () {
    const { className, children } = this.props
    return (
      <div className={className} ref='sidebarWrapper'>
        {children}
      </div>
    )
  }
}
export default SidebarWrapper
