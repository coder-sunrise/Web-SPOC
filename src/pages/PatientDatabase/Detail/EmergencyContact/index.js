import React, { PureComponent } from 'react'

import { withStyles } from '@material-ui/core'

import emergencyModal from '../models/emergencyContact'
import EmergencyContactGrid from './EmergencyContactGrid'

window.g_app.replaceModel(emergencyModal)

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

class EmergencyContact extends PureComponent {
  state = {
    height: 100,
  }

  // componentDidMount () {
  //   this.resize()
  //   window.addEventListener('resize', this.resize.bind(this))
  // }

  // componentWillUnmount () {
  //   window.removeEventListener('resize', this.resize.bind(this))
  // }

  // onReset () {
  //   console.log('EmergencyContact-onReset', this)
  // }

  // resize () {
  //   if (this.divElement) {
  //     const height = this.divElement.clientHeight
  //     if (height > 0) {
  //       this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
  //     }
  //   }
  // }

  render () {
    const { classes, emergencyContact, dispatch, ...restProps } = this.props

    return <EmergencyContactGrid {...restProps} />
  }
}

export default withStyles(styles, { withTheme: true })(EmergencyContact)
