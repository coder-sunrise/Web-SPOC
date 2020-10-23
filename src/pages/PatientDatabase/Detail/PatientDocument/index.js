import React, { PureComponent } from 'react'

import { withStyles } from '@material-ui/core'

import { CommonModal } from '@/components'
import PatientDocument from '@/pages/Widgets/PatientDocument'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

class Document extends PureComponent {
  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render () {
    return (
      <CommonModal
        open
        fullScreen
        onClose={this.props.onClose}
        title='Patient Document'
      >
        <PatientDocument {...this.props} />
      </CommonModal>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Document)
