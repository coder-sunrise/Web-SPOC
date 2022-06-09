import React, { Fragment } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { FormattedMessage } from 'umi'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Close from '@material-ui/icons/Close'
// import Slide from '@material-ui/core/Slide'
import Fade from '@material-ui/core/Fade'
import { withStyles } from '@material-ui/core/styles'
import Button from 'mui-pro-components/CustomButtons'
import notificationsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/notificationsStyle.jsx'
import Loading from '@/components/PageLoading/index'
import { SizeContainer, ProgressButton, Tooltip, TextField } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import { confirmBeforeReload } from '@/utils/utils'

function Transition(props) {
  return <Fade {...props} />
}
function getContainerHeight(props) {
  if (props.fullHeight)
    return (
      window.innerHeight +
      26 +
      (props.showFooter ? 54 : 0) +
      (props.bodyNoPadding ? -16 : 0) +
      (props.maxWidth === 'lg' ? 63 : 0)
    )

  return (
    window.innerHeight -
    58 -
    (props.showFooter ? 54 : 0) -
    (props.bodyNoPadding ? -16 : 0) -
    (props.maxWidth === 'lg' ? 63 : 0)
  )
}

@connect(({ loading, global }) => ({ loading, global }))
class CommonModal extends React.PureComponent {
  state = {
    // open: false,
    openConfirm: false,
    height: 0,
  }

  static defaultProps = {
    open: false,
    maxWidth: 'md',
  }

  static propTypes = {
    // open: PropTypes.bool.isRequired,
    // onClose: PropTypes.func.isRequired,
    // onConfirm: PropTypes.func.isRequired,

    title: PropTypes.string,
    maxWidth: PropTypes.oneOf(['sm', 'lg', 'md']),
  }

  constructor(props) {
    super(props)
    // console.log(this.state, props)
    // const { loading, classes, theme } = props
    this.myRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps) {
    const { open } = nextProps
    return {
      height: getContainerHeight(nextProps),
      open,
    }
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  // componentWillUnmount () {
  //   if (navigator.platform.indexOf('Win') > -1 && ps) {
  //     ps.destroy()
  //     ps = null
  //   }
  // }
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
      isInformType,
      cancelText,
    } = this.props
    // console.log('footer', this.props)
    const { disabled = false } = confirmProps
    return (
      <SizeContainer size='md'>
        <div ref={this.myRef} a='1'>
          <DialogActions
            className={classes.modalFooter}
            style={{ justifyContent: align }}
          >
            {isInformType ? (
              <Button
                onClick={this.onClose}
                color='primary'
                authority='none'
                {...cancelProps}
              >
                OK
              </Button>
            ) : (
              <Fragment>
                {onReset && (
                  <Button
                    key='reset'
                    // hideIfNoEditRights
                    aria-label='Reset'
                    color='danger'
                    onClick={onReset}
                    style={{ left: 0, position: 'absolute' }}
                    tabIndex='-2'
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
                {onConfirm && (
                  <ProgressButton
                    color='primary'
                    // hideIfNoEditRights
                    onClick={onConfirm}
                    icon={null}
                    {...confirmProps}
                    // disabled={disabled || loading.global || global.disableSave}
                  >
                    {confirmText || confirmBtnText}
                  </ProgressButton>
                )}
              </Fragment>
            )}
          </DialogActions>
        </div>
      </SizeContainer>
    )
  }

  onClose = force => {
    if (this.props.global.disableSave) {
      if (force === true) {
        this.props.dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: false,
          },
        })
      }
      if (force !== true && this.props.global.openConfirm !== true) {
        this.setState({
          openConfirm: true,
        })
        return false
      }
    }
    const obs = Array.isArray(this.props.observe)
      ? this.props.observe
      : [this.props.observe]
    for (let i = 0; i < obs.length; i++) {
      const o = obs[i]
      const ob = window.g_app._store.getState().formik[o]
      // console.log(ob,this.props.observe)
      if (ob) {
        if (
          ob.dirty &&
          force !== true &&
          this.props.global.openConfirm !== true
        ) {
          this.setState({
            openConfirm: true,
          })
          return false
        }
        // this.props.dispatch({
        //   type: 'formik/updateState',
        //   payload: {
        //     [o]: undefined,
        //   },
        // })
        // window.beforeReloadHandlerAdded = false
        // window.removeEventListener('beforeunload', confirmBeforeReload)
      }
    }

    if (this.props.onClose) {
      this.props.onClose(force === true)
    }
    // return true
  }

  onMinimize = () => {}

  onConfirm = cb => {
    // console.log('onConfirm')
    // window.beforeReloadHandlerAdded = false
    // window.removeEventListener('beforeunload', confirmBeforeReload)
    // this.props.dispatch({
    //   type: 'formik/updateState',
    //   payload: {
    //     [this.props.observe]: undefined,
    //   },
    // })
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
    if (typeof cb === 'function') cb()
  }

  handleMaxWidthChange = event => {
    this.setState({ maxWidth: event.target.value })
  }

  resize = () => {
    this.setState({
      height: getContainerHeight(this.props),
      width: window.innerWidth,
    })
  }

  onEntered = el => {
    if (this.props.autoFocus) {
      if (el.setActive) el.setActive()
      if (el.focus) el.focus()
    }
  }

  render() {
    const {
      classes,
      open = false,
      title,
      children,
      showFooter = false,
      loading,
      adaptFullWidth = true,
      maxWidth = 'md',
      fullHeight,
      bodyNoPadding = false,
      theme,
      disableBackdropClick = true,
      keepMounted = true,
      overrideLoading = false,
      footProps = {},
      className,
      displayCloseIcon = true,
      closeIconTooltip = 'Close',
      loadingText = 'Loading...',
    } = this.props
    if (!children || !open) return null
    // console.log(bodyNoPadding)
    // if (
    //   navigator.platform.indexOf('Win') > -1 &&
    //   this.refs.modalContent &&
    //   !ps
    // ) {
    //   ps = new PerfectScrollbar(this.refs.modalContent, {
    //     suppressScrollX: true,
    //     suppressScrollY: false,
    //   })
    // }

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        onConfirm: this.onConfirm,
        onClose: this.onClose,
        footer: this.footer,
        height: this.state.height,
      }),
    )
    // console.log(this.props)
    const classControl = {
      [className]: true,
      [classes.modalRoot]: true,
      [classes.modal]: true,
    }
    const cfg = {}
    if (displayCloseIcon) {
      cfg.onEscapeKeyDown = this.onClose
    } else {
      cfg.disableEscapeKeyDown = true
    }
    return (
      <React.Fragment>
        <Dialog
          classes={fullHeight ? { paper: classes.dialogPaper } : ''}
          className={classnames(classControl)}
          disableBackdropClick={disableBackdropClick}
          open={open}
          fullScreen={this.props.fullScreen}
          fullWidth={adaptFullWidth}
          maxWidth={maxWidth}
          TransitionComponent={Transition} // TODO: remove this will casuse datepicker blink bug
          keepMounted={keepMounted}
          onClose={this.onClose}
          aria-labelledby='classic-modal-slide-title'
          aria-describedby='classic-modal-slide-description'
          style={{ overflow: 'hidden' }}
          onEntered={this.onEntered}
          // onEscapeKeyDown={!displayCloseIcon && this.onClose}
          {...cfg}
        >
          {title && (
            <DialogTitle
              // id="classic-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              {displayCloseIcon && (
                <Tooltip title={closeIconTooltip}>
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
                </Tooltip>
              )}
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
          <LoadingWrapper
            loading={!overrideLoading && loading.global}
            text={loadingText}
          >
            <DialogContent
              // id="classic-modal-slide-description"
              className={`${classes.modalBody} ${
                bodyNoPadding
                  ? classes.modalBodyNoPadding
                  : classes.modalBodyPadding
              }`}
              style={{ maxHeight: this.footer ? 'auto' : this.state.height }}
            >
              {/* !overrideLoading && loading.global ? (
                <Loading
                  style={{
                    position: 'absolute',
                    width: '100%',
                    zIndex: 99999,
                    height: `${this.myRef.current
                      ? this.myRef.current.offsetHeight +
                        (bodyNoPadding ? 0 : 16)
                      : this.state.height}px`,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    margin: bodyNoPadding ? 0 : -8,
                  }}
                />
              ) : null */}
              <div ref={this.myRef}>
                {open ? (
                  <SizeContainer size='md'>{childrenWithProps}</SizeContainer>
                ) : null}
              </div>
            </DialogContent>
          </LoadingWrapper>
          {showFooter &&
            this.footer({
              onConfirm: this.onConfirm,
              ...footProps,
            })}
        </Dialog>

        <Dialog
          open={this.state.openConfirm}
          maxWidth='sm'
          onEntered={this.onEntered}
        >
          <DialogContent>
            <h3>
              <FormattedMessage id='app.general.leave-without-save' />
            </h3>
          </DialogContent>
          <DialogActions className={classes.modalFooter}>
            <SizeContainer size='md'>
              <React.Fragment>
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
                    // window.beforeReloadHandlerAdded = false
                    // window.removeEventListener(
                    //   'beforeunload',
                    //   confirmBeforeReload,
                    // )
                    this.onClose(true)
                  }}
                >
                  Confirm
                </Button>
              </React.Fragment>
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
