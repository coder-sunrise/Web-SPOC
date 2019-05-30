import React from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import classNames from 'classnames'
import SweetAlert from 'react-bootstrap-sweetalert'
import ModalWrapper from '@/components/ModalWrapper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import sweetAlertStyle from 'mui-pro-jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx'

const styles = (theme) => ({
  ...sweetAlertStyle,
})
class SimpleModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      done: false,
      hide: true,
    }
    if (props.defaultOpen) {
      this.state.hide = false
    }
  }

  static getDerivedStateFromProps (nextProps, preState) {
    // console.log(nextProps, preState)
    if (
      nextProps.status &&
      nextProps.status.submissionStatus === 'done' &&
      !preState.done
    ) {
      return {
        done: true,
      }
    }
    if (nextProps.open) {
      return {
        hide: false,
        done: false,
      }
    }
    return null
  }

  onConfirm = () => {
    this.setState(
      {
        done: true,
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
        done: true,
      },
      () => {
        if (this.props.onCancel) this.props.onCancel()
      },
    )
  }

  render () {
    const { status, classes } = this.props
    const submitting = status && status.submissionStatus === 'pending'
    const { onCancel, onOk, ...resetProps } = this.props

    if (this.state.hide) return null

    if (this.state.done) {
      return (
        <ModalWrapper>
          <SweetAlert
            success
            // style={{ display: "block", marginTop: "-100px" }}
            title='Done!'
            onConfirm={this.hideAlert}
            onCancel={this.hideAlert}
            confirmBtnCssClass={`${classes.button} ${classes.success}`}
          />
        </ModalWrapper>
      )
    }
    // if (!this.props.open && this.state.hide) return null

    return (
      <ModalWrapper>
        <SweetAlert
          // input
          disabled={submitting}
          showCancel
          confirmBtnText={submitting ? 'Processing...' : 'Confirm'}
          // style={{ display: "block", marginTop: "-100px" }}
          //   title={`Are you sure to void the Payment ${ row.itemCode  } ?`}
          onConfirm={this.onConfirm}
          onCancel={this.hideAlert}
          confirmBtnCssClass={`${classes.button} ${submitting
            ? classes.default
            : classes.info}`}
          cancelBtnCssClass={`${classes.button} ${classes.danger}`}
          {...resetProps}
        >
          {this.props.children}
        </SweetAlert>
      </ModalWrapper>
    )
  }
}
export default withStyles(styles, { withTheme: true })(SimpleModal)
