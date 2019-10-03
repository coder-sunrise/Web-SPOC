import _extends from 'babel-runtime/helpers/extends'
import * as React from 'react'
import Notification from 'rc-notification'
import { Close as Icon, AddAlert } from '@material-ui/icons'
import Snackbar from 'mui-pro-components/Snackbar/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'

// @material-ui/icons

// <Snackbar
//             place="lr"
//             color="info"
//           // icon={AddAlert}
//             message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
//             open
//             closeNotification={() => this.setState({ br: false })}
//             close
//           />

let notificationInstance = {}
let defaultDuration = 4.5
let defaultTop = 18
let defaultBottom = 18
let defaultPlacement = 'topRight'
let defaultGetContainer
function setNotificationConfig (options) {
  const { duration, placement, bottom, top, getContainer } = options

  if (duration !== undefined) {
    defaultDuration = duration
  }
  if (placement !== undefined) {
    defaultPlacement = placement
  }
  if (bottom !== undefined) {
    defaultBottom = bottom
  }
  if (top !== undefined) {
    defaultTop = top
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer
  }
}
function getPlacementStyle (placement) {
  let style
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: defaultTop,
        bottom: 'auto',
      }
      break
    case 'topRight':
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto',
      }
      break
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: defaultBottom,
      }
      break
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom: defaultBottom,
      }
      break
  }
  return style
}
function getNotificationInstance (prefixCls, placement, callback) {
  let cacheKey = `${prefixCls}-${placement}`
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey])
    return
  }
  // console.log(defaultTheme.overrides.MuiIconButton)
  Notification.newInstance(
    {
      prefixCls,
      className: `${prefixCls}-${placement}`,
      style: getPlacementStyle(placement),
      getContainer: defaultGetContainer,
      closeIcon: (
        <i className='material-icons close' style={{ display: 'none' }}>
          close
        </i>
      ),
      // closeIcon: (

      // ),
    },
    (notification) => {
      notificationInstance[cacheKey] = notification
      callback(notification)
    },
  )
}
let typeToIcon = {
  success: 'check-circle-o',
  info: 'info-circle-o',
  error: 'close-circle-o',
  warning: 'exclamation-circle-o',
}
function notice (args) {
  let outerPrefixCls = args.prefixCls || 'ant-notification'
  let prefixCls = `${outerPrefixCls}-notice`
  let duration = args.duration === undefined ? defaultDuration : args.duration
  let iconNode = null
  if (args.icon) {
    iconNode = React.createElement(
      'span',
      { className: `${prefixCls}-icon` },
      args.icon,
    )
  } else if (args.type) {
    let iconType = typeToIcon[args.type]
    iconNode = React.createElement(Icon, {
      className: `${prefixCls}-icon ${prefixCls}-icon-${args.type}`,
      type: iconType,
    })
  }
  if (!args.description && args.message) {
    args.description = args.message
    args.message = ''
  }
  // let autoMarginTag = !args.description && iconNode ? React.createElement('span', { className: `${prefixCls  }-message-single-line-auto-margin` }) : null
  getNotificationInstance(
    outerPrefixCls,
    args.placement || defaultPlacement,
    (notification) => {
      // console.log(args)
      notification.notice({
        content: (
          <Snackbar
            //   place="lr"
            color={args.type}
            icon={args.icon === null ? undefined : args.icon || AddAlert}
            message={
              <div>
                {args.message && <h5>{args.message}</h5>}
                <div>{args.description}</div>
              </div>
            }
            open
            closeNotification={args.onClose}
            close={args.closable}
          />
        ) /* React.createElement(
                'div',
                { className: iconNode ? `${prefixCls  }-with-icon` : '' },
                iconNode,
                React.createElement(
                    'div',
                    { className: `${prefixCls  }-message` },
                    autoMarginTag,
                    args.message
                ),
                React.createElement(
                    'div',
                    { className: `${prefixCls  }-description` },
                    args.description
                ),
                args.btn ? React.createElement(
                    'span',
                    { className: `${prefixCls  }-btn` },
                    args.btn
                ) : null
            ) */,
        duration,
        closable: true,
        onClose: args.onClose,
        onClick: args.onClick,
        key: args.key,
        style: args.style || {},
        className: args.className,
      })
    },
  )
}
const api = {
  open: notice,
  close: function close (key) {
    Object.keys(notificationInstance).forEach((cacheKey) => {
      return notificationInstance[cacheKey].removeNotice(key)
    })
  },

  config: setNotificationConfig,
  destroy: function destroy () {
    Object.keys(notificationInstance).forEach((cacheKey) => {
      notificationInstance[cacheKey].destroy()
      delete notificationInstance[cacheKey]
    })
  },
}
;[
  'success',
  'info',
  'warning',
  'error',
].forEach((type) => {
  api[type] = function (args) {
    return api.open(_extends({}, args, { type, closable: true }))
  }
})
api.warn = api.warning
export default api
