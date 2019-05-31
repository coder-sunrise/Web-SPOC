import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classNames from 'classnames'
import _extends from 'babel-runtime/helpers/extends'
import _defineProperty from 'babel-runtime/helpers/defineProperty'
// import Icon from '../icon'
import SimpleModal from './index'
// import ActionButton from './ActionButton'
// import { getConfirmLocale } from './locale'

let _this = this
let IS_REACT_16 = !!ReactDOM.createPortal
let ConfirmDialog = function ConfirmDialog (props) {
  let onCancel = props.onCancel

  let onOk = props.onOk

  let close = props.close

  let zIndex = props.zIndex

  let afterClose = props.afterClose

  let visible = props.visible

  let keyboard = props.keyboard

  let centered = props.centered

  let getContainer = props.getContainer

  let maskStyle = props.maskStyle

  let okButtonProps = props.okButtonProps

  let cancelButtonProps = props.cancelButtonProps

  let iconType = props.iconType || 'question-circle'
  let okType = props.okType || 'primary'
  let prefixCls = props.prefixCls || 'ant-modal'
  let contentPrefixCls = `${prefixCls}-confirm`
  // 默认为 true，保持向下兼容
  let okCancel = 'okCancel' in props ? props.okCancel : true
  let width = props.width || 416
  let style = props.style || {}
  // 默认为 false，保持旧版默认行为
  let maskClosable =
    props.maskClosable === undefined ? false : props.maskClosable
  let okText = props.okText || 'OK'
  let cancelText = props.cancelText || 'Cancel'
  let autoFocusButton =
    props.autoFocusButton === null ? false : props.autoFocusButton || 'ok'
  let classString = classNames(
    contentPrefixCls,
    `${contentPrefixCls}-${props.type}`,
    props.className,
  )
  // let cancelButton =
  //   okCancel &&
  //   React.createElement(
  //     ActionButton,
  //     {
  //       actionFn: onCancel,
  //       closeModal: close,
  //       autoFocus: autoFocusButton === 'cancel',
  //       buttonProps: cancelButtonProps,
  //     },
  //     cancelText,
  //   )
  const r = React.createElement(
    SimpleModal,
    {
      prefixCls,
      className: classString,
      wrapClassName: classNames(
        _defineProperty({}, `${contentPrefixCls}-centered`, !!props.centered),
      ),
      title: '',
      transitionName: 'zoom',
      footer: '',
      maskTransitionName: 'fade',
      maskClosable,
      maskStyle,
      style,
      width,
      afterClose,
      keyboard,
      centered,
      getContainer,
      defaultOpen: true,
      onCancel,
      onOk,
    },
    React.createElement(
      'div',
      { className: `${contentPrefixCls}-body-wrapper` },
      React.createElement(
        'div',
        { className: `${contentPrefixCls}-body` },
        // React.createElement(Icon, { type: iconType }),
        React.createElement(
          'span',
          { className: `${contentPrefixCls}-title` },
          props.title,
        ),
        React.createElement(
          'div',
          { className: `${contentPrefixCls}-content` },
          props.content,
        ),
      ),
      // React.createElement(
      //   'div',
      //   { className: `${contentPrefixCls}-btns` },
      //   cancelButton,
      //   React.createElement(
      //     ActionButton,
      //     {
      //       type: okType,
      //       actionFn: onOk,
      //       closeModal: close,
      //       autoFocus: autoFocusButton === 'ok',
      //       buttonProps: okButtonProps,
      //     },
      //     okText,
      //   ),
      // ),
    ),
  )
  // console.log(r)
  return r
}
export default function confirm (config) {
  let div = document.createElement('div')
  document.body.appendChild(div)
  let currentConfig = _extends({}, config, { close })
  // console.log(currentConfig)
  function close () {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    currentConfig = _extends({}, currentConfig, {
      // visible: false,
      afterClose: destroy.bind(
        ...[
          this,
        ].concat(args),
      ),
    })
    if (IS_REACT_16) {
      render(currentConfig)
    } else {
      destroy(...args)
    }
  }
  function update (newConfig) {
    currentConfig = _extends({}, currentConfig, newConfig)
    render(currentConfig)
  }
  function destroy () {
    console.log('destroy')
    let unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }

    for (
      var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2]
    }

    let triggerCancel =
      args &&
      args.length &&
      args.some((param) => {
        return param && param.triggerCancel
      })
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args)
    }
  }
  function render (props) {
    ReactDOM.render(React.createElement(ConfirmDialog, props), div)
    // ReactDOM.render(<div>test</div>, div)
  }
  render(currentConfig)
  return {
    destroy: close,
    update,
  }
}
