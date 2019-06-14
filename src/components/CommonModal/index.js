import React from 'react'
import { connect } from 'dva'
import PerfectScrollbar from 'perfect-scrollbar'
import { formatMessage, FormattedMessage } from 'umi/locale'
import classNames from 'classnames'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Close from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import ModalWrapper from '@/components/ModalWrapper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Button from 'mui-pro-components/CustomButtons'
import Loading from '@/components/PageLoading/index'

import notificationsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/notificationsStyle.jsx'

// const styles = theme => ({
//     ...notificationsStyle(theme),
// })
let ps

function Transition (props) {
  return <Slide direction='up' {...props} />
}
@connect(({ loading }) => ({ loading }))
class CommonModal extends React.Component {
  state = {
    // open: false,
    fullWidth: true,
    maxWidth: 'md',
    height: 0,
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { open } = nextProps
    if (open) {
      return {
        height: window.innerHeight - 44,
      }
    }
    return null
  }

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    if (navigator.platform.indexOf('Win') > -1 && ps) {
      ps.destroy()
      ps = null
    }
  }
  // static getDerivedStateFromProps (nextProps, preState){
  //     // console.log(nextProps, preState)
  //     if(nextProps.open && !preState.open){
  //         return {
  //             open:true,
  //         }
  //     }
  //     if(!nextProps.open){
  //         return {
  //             open: false,
  //         }
  //     }
  //     return null
  // }

  onClose = (e) => {
    if (this.props.onClose) {
      this.props.onClose(e)
    }
  }

  onConfim = (e) => {
    if (this.props.onConfim) {
      this.props.onConfim(e)
    }
  }

  handleMaxWidthChange = (event) => {
    this.setState({ maxWidth: event.target.value })
  }

  resize () {
    this.setState({
      height: window.innerHeight - 44,
      width: window.innerWidth,
    })
  }

  render () {
    const {
      classes,
      open = false,
      title,
      children,
      showFooter,
      loading,
      adaptFullWidth = true,
      maxWidth = 'md',
      bodyNoPadding = false,
      theme,
      disableBackdropClick = false,
      keepMounted = true,
    } = this.props
    if (!children) return null
    // console.log(bodyNoPadding)
    if (
      navigator.platform.indexOf('Win') > -1 &&
      this.refs.modalContent &&
      !ps
    ) {
      ps = new PerfectScrollbar(this.refs.modalContent, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
    }
    const footer = ({
      onConfirm,
      confirmProps,
      cancelProps,
      confirmBtnText = 'Confirm',
    }) => {
      const { disabled = false } = confirmProps
      return (
        <DialogActions className={classes.modalFooter}>
          <Button
            onClick={this.onClose}
            color='danger'
            disabled={loading.global}
            {...cancelProps}
          >
            Cancel
          </Button>
          <Button
            color='success'
            onClick={onConfirm}
            {...confirmProps}
            style={{ marginLeft: theme.spacing.unit }}
            disabled={disabled || loading.global}
          >
            {loading.global ? 'Processing...' : `${confirmBtnText}`}
          </Button>
        </DialogActions>
      )
    }
    const childrenWithProps = React.Children.map(children, (child) =>
      React.cloneElement(child, {
        footer,
        onConfirm: this.props.onConfirm,
        onClose: this.props.onClose,
        height: this.state.height,
      }),
    )

    return (
      <Dialog
        classes={{
          root: `${classes.center} ${classes.modalRoot}`,
          paper: classes.modal,
        }}
        disableBackdropClick={disableBackdropClick}
        open={open}
        fullScreen={this.props.fullScreen}
        fullWidth={adaptFullWidth}
        maxWidth={maxWidth}
        TransitionComponent={Transition}
        keepMounted={keepMounted}
        onClose={this.onClose}
        aria-labelledby='classic-modal-slide-title'
        aria-describedby='classic-modal-slide-description'
        style={{ overflow: 'hidden' }}
      >
        <DialogTitle
          // id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key='close'
            aria-label='Close'
            color='transparent'
            onClick={this.onClose}
          >
            <Close className={classes.modalClose} />
          </Button>
          {title && <h4 className={classes.modalTitle}>{title}</h4>}
        </DialogTitle>
        <DialogContent
          // id="classic-modal-slide-description"
          className={`${classes.modalBody} ${bodyNoPadding
            ? classes.modalBodyNoPadding
            : classes.modalBodyPadding}`}
          style={{ maxHeight: this.state.height }}
        >
          {loading.global ? (
            <Loading
              style={{
                position: 'absolute',
                width: '100%',
                zIndex: 99999,
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                margin: bodyNoPadding ? 0 : -12,
              }}
            />
          ) : null}
          {/* <div
            ref='modalContent'
            style={{
              height: this.getHeight(),
              position: 'relative',
            }}
          >
            
          </div> */}
          <div
            ref={(divElement) => {
              this.divElement = divElement
            }}
          >
            {childrenWithProps}
          </div>
        </DialogContent>
        {/* 
          showFooter &&
          footer({
            onConfirm: this.props.onConfirm,
          }) 
        */}
      </Dialog>
    )
  }
}

export default withMobileDialog()(
  withStyles(notificationsStyle, { withTheme: true })(CommonModal),
)
