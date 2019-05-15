import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SweetAlert from 'react-bootstrap-sweetalert'
// material ui
import { withStyles } from '@material-ui/core/styles'
// custom components
import ModalWrapper from '@/components/ModalWrapper'
// assets
import sweetAlertStyle from 'mui-pro-jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx'

const styles = () => ({
  ...sweetAlertStyle,
})

class SimpleAlert extends PureComponent {
  static propTypes = {
    showCancel: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    confirmBtnText: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    classes: PropTypes.any,
  }

  constructor (props) {
    super(props)
    this.state = {
      hide: true,
    }
    if (props.defaultOpen) {
      this.state.hide = false
    }
  }

  static getDerivedStateFromProps (nextProps, preState) {
    if (nextProps.open) {
      return {
        hide: false,
      }
    }

    return { hide: !nextProps.open }
  }

  onConfirm = () => {
    this.setState(
      {
        hide: true,
      },
      () => {
        if (this.props.onOk) this.props.onOk()
      },
    )
  }

  hideAlert = () => {
    this.setState(
      {
        hide: true,
      },
      () => {
        if (this.props.onCancel) this.props.onCancel()
      },
    )
  }

  render () {
    const {
      confirmBtnText = 'Confirm...',
      onCancel,
      onOk,
      classes,
      showCancel = false,
      ...resetProps
    } = this.props

    if (this.state.hide) return null

    return (
      <ModalWrapper>
        <SweetAlert
          showCancel={showCancel}
          confirmBtnText={confirmBtnText}
          onConfirm={this.onConfirm}
          onCancel={this.hideAlert}
          confirmBtnCssClass={`${classes.button} ${classes.info}`}
          cancelBtnCssClass={`${classes.button} ${classes.danger}`}
          {...resetProps}
        >
          {this.props.children}
        </SweetAlert>
      </ModalWrapper>
    )
  }
}
export default withStyles(styles, { withTheme: true })(SimpleAlert)
