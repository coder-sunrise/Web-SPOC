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
function getContainerHeight (props) {
  return window.innerHeight - 44 - (props.showFooter ? 63 : 0)
}

@connect(({ loading }) => ({ loading }))
class CommonModal extends React.PureComponent {
  state = {
    // open: false,
    fullWidth: true,
    maxWidth: 'md',
    height: 0,
  }

  constructor (props) {
    super(props)
    // console.log(this.state, props)
    const { loading, classes, theme } = props
    this.footer = ({
      onConfirm,
      confirmProps = {},
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
            color='primary'
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
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { open } = nextProps
    if (open) {
      return {
        height: getContainerHeight(nextProps),
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

  onConfim = (cb) => {
    if (this.props.onConfim) {
      this.props.onConfim()
    }
    if (cb) cb()
  }

  handleMaxWidthChange = (event) => {
    this.setState({ maxWidth: event.target.value })
  }

  resize = () => {
    this.setState({
      height: getContainerHeight(this.props),
      width: window.innerWidth,
    })
  }

  render () {
    const {
      classes,
      open = false,
      title,
      children,
      showFooter = false,
      loading,
      adaptFullWidth = true,
      maxWidth = 'md',
      bodyNoPadding = false,
      theme,
      disableBackdropClick = false,
      keepMounted = true,
      footProps = {},
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

    const childrenWithProps = React.Children.map(children, (child) =>
      React.cloneElement(child, {
        footer: this.footer,
        onConfirm: this.props.onConfirm || this.onConfim,
        height: this.state.height,
      }),
    )

    return (
      <Dialog
        classes={{
          root: `${classes.modalRoot}`,
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
          {open ? childrenWithProps : null}
        </DialogContent>
        {showFooter &&
          this.footer({
            onConfirm: this.props.onConfirm,
            ...footProps,
          })}
      </Dialog>
    )
  }
}

export default withMobileDialog()(
  withStyles(notificationsStyle, { withTheme: true })(CommonModal),
)
