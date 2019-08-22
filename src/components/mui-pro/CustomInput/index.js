import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// nodejs library that concatenates classes
import classNames from 'classnames'
import $ from 'jquery'
import _ from 'lodash'
// @material-ui/core components
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

  constructor (props) {
    super(props)
    // this.myRef = React.createRef()
    const { field = {}, form, inputProps = {}, defaultValue = '' } = props
    // console.log(this.state, props)
    this.state = {
      isDebouncing: false,
      value:
        field.value !== undefined && field.value !== ''
          ? field.value
          : defaultValue,
    }
    this.debouncedOnChange = _.debounce(this._onChange.bind(this), 300)
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

  componentWillReceiveProps (nextProps) {
    const { field } = nextProps
    if (field) {
      this.setState({
        value:
          field.value !== undefined && field.value !== '' ? field.value : '',
      })
    }
  }

  _onChange = (value = '') => {
    // console.log(value)
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
    this.setState({
      isDebouncing: false,
    })
  }

  onChange = (event) => {
    // console.log(event)
    this.setState({
      value: event.target.value,
      isDebouncing: true,
    })
    this.debouncedOnChange(event.target.value)
  }

  shouldFocus = (error) => {
    return error && this.props.form.submitCount !== this.validationCount
  }

  onKeyUp = (e) => {
    // console.log('onKeyUp', e.target.value)
    // console.log('onKeyUp', e.which)
    if (e.which === 13) {
      this._onChange(e.target.value)
    }
  }

  render () {
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
      preventDefaultChangeEvent,
      value,
      uppercase,
      lowercase,
    } = props
    const { field, form, ...resetProps } = props
    // console.log(this.state, this.state.value)
    // if (this.state && this.state.value !== undefined) {
    //   inputProps.value = this.state.value
    // }
    const cfg = {}
    // console.log(this.props)
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
      const touched = Object.byString(form.touched, field.name)
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
    } else if (value) {
      cfg.value = value
    }
    if (!preventDefaultChangeEvent) {
      cfg.onChange = this.onChange
    }
    cfg.negative = state.value < 0
    cfg.onKeyUp = extendFunc(onKeyUp, this.onKeyUp)
    if (uppercase) {
      cfg.value = cfg.value.toUpperCase()
    } else if (lowercase) {
      cfg.value = cfg.value.toLowerCase()
    }
    // console.log(inputProps)
    // console.log('custominput', inputProps)
    // console.log('custominput', props, cfg, state)
    return (
      <BaseInput
        {...resetProps}
        {...cfg}
        isDebouncing={this.state.isDebouncing}
      />
    )
  }
}

TextField.propTypes = {
  label: PropTypes.node,
  labelProps: PropTypes.object,
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

export default TextField
