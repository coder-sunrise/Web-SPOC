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
// import NumberFormat from 'react-number-format'
import CustomInputWrapper from '../CustomInputWrapper'
import FormatInput from './FormatInput'
import BaseInput from './BaseInput'

class FormikTextField extends React.PureComponent {
  validationCount = 0

  constructor (props) {
    super(props)
    // this.myRef = React.createRef()
    const { field = {}, form, inputProps = {} } = props
    // console.log(this.state, props)
    this.state = {
      value: field.value,
    }
    this.debouncedOnChange = _.debounce(this.debouncedOnChange.bind(this), 1000)
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value,
    })
    this.debouncedOnChange(event.target.value)
  }

  debouncedOnChange = (value) => {
    const { props } = this
    const { loadOnChange, readOnly, onChange } = props
    if (readOnly || loadOnChange) return
    const v = {
      target: {
        value,
        name: props.field.name,
      },
    }
    if (props.field && props.field.onChange) {
      props.field.onChange(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  _onKeyDown = (e) => {
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
                value: this.state.value,
              },
            })
            setTimeout(() => {
              btn.trigger('click')
            }, 200)
          } else {
            btn.trigger('click')
          }
          break
        }
        target = newTarget
        loop += 1
      }
    }
  }

  shouldFocus = (error) => {
    return error && this.props.form.submitCount !== this.validationCount
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
        value: field.value,
      })
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
      field,
      form,
      onChange,
      value,
    } = props
    // console.log(this.state, this.state.value)
    // if (this.state && this.state.value !== undefined) {
    //   inputProps.value = this.state.value
    // }
    const cfg = {}
    // console.log(this.props)
    if (field && form) {
      cfg.value = state.value
      cfg.name = field.name
      cfg.onChange = this.onChange
      // if(field.value){
      //   cfg.labelProps = {
      //     shrink: !!field.value,
      //   }
      // }

      const shouldShow =
        Object.byString(form.touched, field.name) || form.submitCount > 0
      if (!error) {
        cfg.error = shouldShow && !!Object.byString(form.errors, field.name)
      }
      if (cfg.error) {
        focus = focus || this.shouldFocus(error)
        if (focus && this.refEl && !window.alreadyFocused) {
          this.validationCount = form.submitCount
          this.refEl.focus()
          window.alreadyFocused = true
        }
        cfg.help =
          !showErrorIcon && shouldShow
            ? Object.byString(form.errors, field.name)
            : help
      }
    } else if (value) {
      cfg.value = value
    }

    // console.log(inputProps)
    // console.log('custominput', inputProps)
    // console.log(props, cfg, state)
    return <BaseInput {...props} {...cfg} />
  }
}

FormikTextField.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default FormikTextField
