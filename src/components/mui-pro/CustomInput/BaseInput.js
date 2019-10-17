import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// nodejs library that concatenates classes
import classNames from 'classnames'
import AutosizeInput from 'react-input-autosize'
import $ from 'jquery'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { InputAdornment, CircularProgress } from '@material-ui/core'
import numeral from 'numeral'
import Error from '@material-ui/icons/Error'
import Tooltip from '@material-ui/core/Tooltip'

import Input from '@material-ui/core/Input'
import customInputStyle from 'mui-pro-jss/material-dashboard-pro-react/components/customInputStyle.jsx'
import { extendFunc, currencyFormat } from '@/utils/utils'
import CustomInputWrapper from '../CustomInputWrapper'
import FormatInput from './FormatInput'

const _config = {
  inputPropsArray: {
    key: 'inputProps',
    value: [
      'value',
      'name',
      'defaultValue',
      'onChange',
      'onBlur',
      'onFocus',
      'autoFocus',
      'multiline',
      'rows',
      'rowsMax',
      'type',
      'disabled',
      'inputComponent',
      'maxLength',
    ],
  },
}
const inputIdPrefix = 'medsysinput'
let inputIdCounter = 0
class BaseInput extends React.PureComponent {
  constructor (props) {
    super(props)
    this.uid = inputIdPrefix + inputIdCounter
    inputIdCounter += 1
  }

  _onKeyUp = (e) => {
    // console.log(e.target.tagName==='TEXTAREA')
    if (this.props.preventDefaultKeyDownEvent) return
    if (e.target.tagName === 'TEXTAREA') return
    // console.log(e, this)
    if (e.which === 13) {
      // onEnterPressed
      const { onEnterPressed } = this.props
      if (onEnterPressed) onEnterPressed(e)

      let loop = 0
      let target = $(e.target)
      while (loop < 100) {
        const newTarget = $(target.parents('div,tr')[0])

        if (newTarget.length === 0) break
        const btn = newTarget.find("button[data-button-type='progress']")
        if (btn.length > 0) {
          if (this.props.onCommit) {
            this.props.onCommit({
              target: {
                value: e.target.value,
              },
            })
            setTimeout(() => {
              btn.trigger('click')
            }, 200)
          } else {
            setTimeout(() => {
              btn.trigger('click')
            }, 200)
          }
          break
        }
        target = newTarget
        loop += 1
      }
    }
  }

  getRef = (ref) => {
    this.refEl = ref
  }

  getClass = (classes) => {
    const {
      success,
      simple,
      noUnderline,
      normalText,
      white,
      rightAlign,
      currency,
      inputRootCustomClasses,
      negative,
      text,
    } = this.props
    let { error, help } = this.props
    // if (field && form) {
    //   const shouldShow =
    //     Object.byString(form.touched, field.name) || form.submitCount > 0
    //   if (!error) {
    //     error = shouldShow && !!Object.byString(form.errors, field.name)
    //   }
    //   if (error) {
    //     if (inputProps) inputProps.autoFocus = true
    //     help =
    //       !showErrorIcon && shouldShow
    //         ? Object.byString(form.errors, field.name)
    //         : help
    //   }
    // }
    // console.log(this)
    const underlineClasses = classNames({
      [classes.underlineError]: error,
      [classes.underlineSuccess]: success && !error,
      [classes.underline]: true,
      [classes.noUnderline]: noUnderline || text,
      [classes.rightAlign]: rightAlign,
      [classes.simple]: simple,
      [classes.inputRoot]: true,
      [classes.textInput]: !!text,
      [classes.whiteUnderline]: white,
      [classes.currency]: text && currency,
      [classes.negativeCurrency]: text && negative,
    })
    // console.log(underlineClasses)
    const marginTop = classNames({
      [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
    })
    const inputClasses = classNames({
      [classes.input]: true,
      [classes.whiteInput]: white,
      [classes.text]: !!text,
    })
    return {
      input: inputClasses,
      root: marginTop,
      disabled: classes.disabled,
      underline: underlineClasses,
      multiline: classes.multiline,
    }
  }

  render () {
    // console.log(this)
    const { field, form, theme, classes, ...props } = this.props
    for (const key in _config) {
      if (Object.prototype.hasOwnProperty.call(_config, key)) {
        const element = _config[key]
        element.value.forEach((o) => {
          if (props[o] !== undefined) {
            if (!props[element.key]) props[element.key] = {}
            props[element.key][o] = props[o]
            delete props[o]
          }
        })
      }
    }
    let {
      formControlProps = {},
      prefixProps,
      suffixProps,
      label,

      inputProps = {},
      labelProps = {},
      children,
      error,
      validBeforeChange = false,
      showErrorIcon,
      white,
      inputRootCustomClasses,
      success,
      help,
      fullWidth,
      number,
      currency,
      creditCard,
      qty,
      control = 1,
      prefix,
      suffix,
      colon = true,
      realtime = true,
      focus = false,
      isDebouncing = false,
      preventDefaultKeyDownEvent,
      size,
      style,
      onKeyUp,
      text,
    } = props

    // console.log(this.state, this.state.value)
    // if (this.state && this.state.value !== undefined) {
    //   inputProps.value = this.state.value
    // }

    // console.log(this.props)

    const cfg = {}
    if (prefix) {
      cfg.startAdornment = (
        <InputAdornment position='start' {...prefixProps}>
          {prefix}
        </InputAdornment>
      )
      if (!labelProps) labelProps = {}
      labelProps.shrink = true
    }
    if (suffix || isDebouncing) {
      cfg.endAdornment = isDebouncing ? (
        <InputAdornment position='end' {...suffixProps}>
          <CircularProgress />
        </InputAdornment>
      ) : (
        <InputAdornment position='end' {...suffixProps}>
          {suffix}
        </InputAdornment>
      )
    }
    if (!preventDefaultKeyDownEvent) {
      cfg.onKeyUp = extendFunc(onKeyUp, this._onKeyUp)
    }
    // console.log({ error, showErrorIcon })
    if (error && showErrorIcon) {
      cfg.endAdornment = (
        <InputAdornment position='end'>
          <Tooltip
            title={
              typeof error === 'string' ? (
                error
              ) : (
                Object.byString(form.errors, field.name)
              )
            }
          >
            <Error color='error' style={{ cursor: 'pointer' }} />
          </Tooltip>
        </InputAdornment>
      )
    }
    if (text) {
      cfg.inputComponent = ({ className }) => {
        return (
          <AutosizeInput readOnly inputClassName={className} {...inputProps} />
        )
      }
    }
    if (
      !(
        inputProps.value === undefined ||
        inputProps.value === null ||
        inputProps.value === '' ||
        inputProps.value.length === 0
      )
    ) {
      labelProps.shrink = true
    }
    // console.log(labelProps, props, inputProps, cfg)
    const element = (
      <CustomInputWrapper
        id={inputIdPrefix + inputIdCounter}
        labelProps={labelProps}
        {...props}
        style={style}
        error={error}
        help={help}
      >
        {(typeof children === 'function'
          ? children({
              getClass: this.getClass,
              error,
              showErrorIcon,
              form,
              field,
              focus,
              ...cfg,
              ...props,
            })
          : false) || (
          <Input
            id={inputIdPrefix + inputIdCounter}
            classes={this.getClass(classes)}
            fullWidth
            inputRef={this.getRef}
            {...cfg}
            inputProps={inputProps}
            {...inputProps}
          />
        )}
      </CustomInputWrapper>
    )
    return element
  }
}

BaseInput.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  success: PropTypes.bool,
  white: PropTypes.bool,
  help: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
}

export default withStyles(customInputStyle, { withTheme: true })(BaseInput)
