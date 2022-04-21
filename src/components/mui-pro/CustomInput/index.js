import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// nodejs library that concatenates classes
import classNames from 'classnames'
import $ from 'jquery'
import _ from 'lodash'
// @material-ui/core components
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import withStyles from '@material-ui/core/styles/withStyles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { InputAdornment, Grid } from '@material-ui/core'
import numeral from 'numeral'

import Tooltip from '@material-ui/core/Tooltip'

import Input from '@material-ui/core/Input'
import { extendFunc, currencyFormat } from '@/utils/utils'
import CustomInputWrapper from '../CustomInputWrapper'
import FormatInput from './FormatInput'
import BaseInput from './BaseInput'
import { control } from '@/components/Decorator'

@control()
class TextField extends React.PureComponent {
  validationCount = 0

  static defaultProps = {
    autocomplete: 'off',
    debounceDuration: 500,
    useLeading: false,
    useTrailing: true,
  }

  constructor(props) {
    super(props)
    // this.myRef = React.createRef()
    const {
      field = {},
      form,
      inputProps = {},
      defaultValue = '',
      value,
      debounceDuration,
      useLeading,
      useTrailing,
    } = props
    // console.log(this.state, props, defaultValue, value)
    this.state = {
      // isDebouncing: false,
      value:
        field.value !== undefined && field.value !== ''
          ? field.value
          : defaultValue || value || '',
    }
    // console.log(this.state.value)
    // if (field && form) {
    //   this.debouncedOnChange = _.debounce(this._onChange.bind(this), 300)
    // } else {
    //   this.debouncedOnChange = this._onChange
    // }
    this.debouncedOnChange = debounceDuration
      ? _.debounce(this._onChange.bind(this), debounceDuration, {
          leading: useLeading,
          trailing: useTrailing,
        })
      : this._onChange.bind(this)
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { field } = nextProps
  //   if (field && field.value !== preState.value) {
  //     console.log(field.value, preState.value)
  //     return {
  //       value: field.value,
  //     }
  //   }
  //   return null
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.focused) return
    const { field, value, defaultValue } = nextProps
    if (field) {
      this.setState({
        value:
          field.value !== undefined &&
          field.value !== '' &&
          field.value !== null
            ? field.value
            : '',
      })
    } else if (value || value === 0) {
      this.setState({
        value,
      })
    } else if (!defaultValue) {
      this.setState({
        value: '',
      })
    }
  }

  _onChange = (value = '') => {
    // console.log({ value })
    const { props } = this
    const { loadOnChange, readOnly, onChange } = props
    if (readOnly || loadOnChange) return
    // console.log('base c', value, props)

    const v = {
      target: {
        value,
        // name: props.field.name,
      },
    }
    if (props.field && props.field.onChange) {
      v.target.name = props.field.name
      props.field.onChange(v)
    }
    if (onChange) {
      onChange(v)
    }
    // this.setState({
    //   value: v.target.value,
    //   // isDebouncing: false,
    // })
  }

  onChange = event => {
    // console.log(event)
    this.setState({
      value: event.target.value,
    })
    if (event.target.value) {
      // this.setState({
      //   isDebouncing: true,
      // })
      this.debouncedOnChange(event.target.value)
    } else {
      this._onChange(event.target.value)
      if (this.debouncedOnChange.cancel) this.debouncedOnChange.cancel()
    }
  }

  shouldFocus = error => {
    return error && this.props.form.submitCount !== this.validationCount
  }

  onKeyUp = e => {
    if ([13].includes(e.which)) {
      this._onChange(e.target.value)
      if (this.debouncedOnChange.cancel) this.debouncedOnChange.cancel()
    }
  }

  // onKeyDown = (e) => {
  //   if (
  //     [
  //       9,
  //     ].includes(e.which)
  //   ) {
  //     this._onChange(e.target.value)
  //     this.debouncedOnChange.cancel()
  //   }
  // }

  handleFocus = () => {
    this.setState({
      focused: true,
    })
    // window.$_inputFocused = true
  }

  handleBlur = e => {
    // console.log('input blur')
    this.setState({
      focused: false,
    })
    this._onChange(e.target.value)
    if (this.debouncedOnChange.cancel) this.debouncedOnChange.cancel()
  }

  render() {
    const { state, props } = this
    // console.log(props)
    let {
      classes,
      formControlProps = {},
      defaultValue,
      prefixProps,
      suffixProps,
      label,
      id,
      labelProps,
      inputProps = {},
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
      percentage,
      creditCard,
      qty,
      control = 1,
      prefix,
      suffix,
      colon = true,
      realtime = true,
      focus = false,
      shrink = false,
      onKeyUp,
      onKeyDown,
      onFocus,
      noSuffix, // for adjustment control
      onBlur,
      preventDefaultChangeEvent,
      value,
      uppercase,
      lowercase,
      text,
      maxLength,
    } = props
    const { field, form, ...resetProps } = props
    // console.log(this.state, this.state.value)
    // if (this.state && this.state.value !== undefined) {
    //   inputProps.value = this.state.value
    // }
    const cfg = {
      hiddenOverflow: !text,
    }
    if (field && form) {
      cfg.value = state.value
      cfg.name = field.name

      // if(field.value){
      //   cfg.labelProps = {
      //     shrink: !!field.value,
      //   }
      // }

      const rawError = Object.byString(form.errors, field.name)
      const shouldShow =
        Object.byString(form.touched, field.name) || form.submitCount > 0
      if (!error) {
        cfg.error = shouldShow && !!rawError
      }
      // const touched = Object.byString(form.touched, field.name)
      // console.log({ error, rawError, shouldShow, touched, showErrorIcon })
      if (cfg.error) {
        focus = focus || this.shouldFocus(error)
        if (focus && this.refEl && !window.alreadyFocused) {
          this.validationCount = form.submitCount
          this.refEl.focus()
          window.alreadyFocused = true
        }

        cfg.help = !showErrorIcon && shouldShow ? rawError : help
      }
      cfg.rawError = error || rawError
    } else {
      cfg.value = text ? (value ?? defaultValue) : state.value
    }
    if (!preventDefaultChangeEvent) {
      cfg.onChange = this.onChange
      cfg.onBlur = extendFunc(onBlur, this.handleBlur)
      cfg.onFocus = extendFunc(onFocus, this.handleFocus)
    }
    // cfg.onFocus = extendFunc(onFocus, this.handleFocus)
    // console.log(maxLength, 'maxLength')
    if (!maxLength) {
      cfg.maxLength = 200
    }
    cfg.negative = cfg.value < 0
    cfg.onKeyUp = extendFunc(onKeyUp, this.onKeyUp)
    // cfg.onKeyDown = extendFunc(onKeyDown, this.onKeyDown)

    if (cfg.value) {
      if (uppercase) {
        cfg.value = cfg.value.toUpperCase()
      } else if (lowercase) {
        cfg.value = cfg.value.toLowerCase()
      }
    }
    let defaultSuffix = suffix
    if (currency && !text && !noSuffix) {
      defaultSuffix = '$'
    }
    if (percentage && !text && !noSuffix) {
      defaultSuffix = '%'
    }
    return (
      <BaseInput
        inputRootCustomClasses={inputRootCustomClasses}
        {...resetProps}
        {...cfg}
        suffix={defaultSuffix}
        // isDebouncing={this.state.isDebouncing}
      />
    )
  }
}

TextField.propTypes = {
  label: PropTypes.string,
  labelProps: PropTypes.object,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  autocomplete: PropTypes.oneOf(['off', 'on', 'nope']),
  success: PropTypes.bool,
  white: PropTypes.bool,
  help: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  debounceDuration: PropTypes.number,
  useLeading: PropTypes.bool,
  useTrailing: PropTypes.bool,
}

export default TextField
