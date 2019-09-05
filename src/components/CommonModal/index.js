import React from 'react'

import PropTypes from 'prop-types'
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
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import Slide from '@material-ui/core/Slide'
import ModalWrapper from '@/components/ModalWrapper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Button from 'mui-pro-components/CustomButtons'
import Loading from '@/components/PageLoading/index'
import { confirmBeforeReload } from '@/utils/utils'
import Authorized from '@/utils/Authorized'

import { SizeContainer, ProgressButton } from '@/components'
import notificationsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/notificationsStyle.jsx'

// const styles = theme => ({
//     ...notificationsStyle(theme),
// })
let ps

// function Transition (props) {
//   return <Slide direction='up' {...props} />
// }
const Transition = React.forwardRef((props, ref) => {
  // console.log('Transition',props)
  return <Slide direction="up" ref={ref} {...props} />
})

function getContainerHeight (props) {
  return (
    window.innerHeight -
    44 -
    (props.showFooter ? 63 : 0) -
    (props.bodyNoPadding ? -16 : 0)
  )
}

@connect(({ loading, global }) => ({ loading, global }))
class CommonModal extends React.PureComponent {
  state = {
    open: false,
    openConfirm: false,
    height: 0,
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,

    title: PropTypes.string,
    maxWidth: PropTypes.oneOf([
      'sm',
      'lg',
      'md',
    ]),
  }

  // constructor (props) {
  //   super(props)
  //   // console.log(this.state, props)
  //   const { loading, classes, theme } = props
  // }

  static getDerivedStateFromProps (nextProps, preState) {
    const { open } = nextProps
    return {
      height: getContainerHeight(nextProps),
      open,
    }
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

  footer = ({
    align = 'flex-end',
    // onClose,
    onConfirm,
    onReset,
    confirmProps = {},
    cancelProps,
    confirmBtnText = 'Confirm',
    extraButtons,
  }) => {
    const {
      loading,
      global,
      classes,
      authority,
      confirmText,
      cancelText,
    } = this.props
    // console.log('footer', this.props)
    const { disabled = false } = confirmProps

    return (
      <DialogActions
        className={classes.modalFooter}
        style={{ justifyContent: align }}
      >
        {onReset && (
          <Button
            key='reset'
            hideIfNoEditRights
            aria-label='Reset'
            color='danger'
            onClick={onReset}
            style={{ left: 0, position: 'absolute' }}
          >
            Reset
          </Button>
        )}

        <Button
          onClick={this.onClose}
          color='danger'
          authority='none'
          // disabled={loading.global}
          {...cancelProps}
        >
          {cancelText || 'Close'}
        </Button>
        {extraButtons}
        {onConfirm && <ProgressButton
          color='primary'
          hideIfNoEditRights
          onClick={onConfirm}
          icon={null}
          {...confirmProps}
          // disabled={disabled || loading.global || global.disableSave}
        >
          {confirmBtnText || confirmText}
                      </ProgressButton>}
      </DialogActions>
    )
  }

  onClose = (force) => {
    const obs =[Array.isArray(this.props.observe)?{...this.props.observe}:this.props.observe]
   
    for (let i = 0; i < obs.length; i++) {
      const o = obs[i]
      const ob = window.g_app._store.getState().formik[o]
      // console.log(ob,this.props.observe)
      if (ob) {
        if (ob.dirty && force !== true) {
          this.setState({
            openConfirm: true,
          })
          return false
        }
        this.props.dispatch({
          type: 'formik/updateState',
          payload: {
            [o]: undefined,
          },
        })
        window.beforeReloadHandlerAdded = false
        window.removeEventListener('beforeunload', confirmBeforeReload)
      }
    }
    
    if (this.props.onClose) {
      this.props.onClose()
    }
    // return true
  }

  onMinimize=()=>{

  }

  onConfirm = (cb) => {
    // console.log('onConfirm')
    window.beforeReloadHandlerAdded = false
    window.removeEventListener('beforeunload', confirmBeforeReload)
    this.props.dispatch({
      type: 'formik/updateState',
      payload: {
        [this.props.observe]: undefined,
      },
    })
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
    if (typeof cb === 'function') cb()
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
      disableBackdropClick = true,
      keepMounted = true,
      overrideLoading = false,
      footProps = {},
    } = this.props
    if (!children || !open) return null
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
        onConfirm: this.onConfirm,
        onClose: this.onClose,
        footer: this.footer,
        height: this.state.height,
      }),
    )
    // console.log(this.props)
    return (
      <React.Fragment>
        <Dialog
          // classes={{
          //   root: `${classes.modalRoot}`,
          //   paper: classes.modal,
          // }}
          disableBackdropClick={disableBackdropClick}
          open={open}
          fullScreen={this.props.fullScreen}
          fullWidth={adaptFullWidth}
          maxWidth={maxWidth}
          TransitionComponent={Transition}
          // transitionDuration={{
          //   enter:1000,
          //   exit:1000
          // }}
          keepMounted={keepMounted}
          onClose={this.onClose}
          aria-labelledby='classic-modal-slide-title'
          aria-describedby='classic-modal-slide-description'
          // style={{ overflow: 'hidden' }}
          onEscapeKeyDown={this.onClose}
        >
          {title && (
            <DialogTitle
              // id="classic-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <Button
                justIcon
                className={classes.modalCloseButton}
                key='close'
                authority='none'
                aria-label='Close'
                color='transparent'
                onClick={this.onClose}
              >
                <Close className={classes.modalClose} />
              </Button>
              {/* <Button
                justIcon
                className={classes.modalMinButton}
                key='close'
                authority='none'
                aria-label='Close'
                color='transparent'
                onClick={this.onMinimize}
              >
                <FullscreenExit className={classes.modalClose} />
              </Button> */}
              <h4 className={classes.modalTitle}>{title}</h4>
            </DialogTitle>
          )}
          <DialogContent
            // id="classic-modal-slide-description"
            className={`${classes.modalBody} ${bodyNoPadding
              ? classes.modalBodyNoPadding
              : classes.modalBodyPadding}`}
            style={{ maxHeight: this.state.height }}
          >
            {!overrideLoading && loading.global ? (
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
            {open ? (
              <SizeContainer size='md'>{childrenWithProps}</SizeContainer>
            ) : (
              <div />
            )}
          </DialogContent>
          {showFooter &&
            this.footer({
              onConfirm: this.onConfirm,
              ...footProps,
            })}
        </Dialog>

        <Dialog open={this.state.openConfirm} maxWidth='sm'>
          <DialogContent>
            <h3>
              <FormattedMessage id='app.general.leave-without-save' />
            </h3>
          </DialogContent>
          <DialogActions className={classes.modalFooter}>
            <SizeContainer size='md'>
              <>
                <Button
                  onClick={() => {
                  this.setState({
                    openConfirm: false,
                  })
                }}
                  color='danger'
                >
                Cancel
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                  this.setState({
                    openConfirm: false,
                  })
                  window.beforeReloadHandlerAdded = false
                  window.removeEventListener(
                    'beforeunload',
                    confirmBeforeReload,
                  )
                  this.onClose(true)
                }}
                >
                Confirm
                </Button>
              </>
            </SizeContainer>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withMobileDialog()(
  withStyles(notificationsStyle, { withTheme: true })(CommonModal),
)
