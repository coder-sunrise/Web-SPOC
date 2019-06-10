import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { extendFunc } from '@/utils/utils'
import Error from '@material-ui/icons/Error'
import {
  InputAdornment,
  TextField,
  Tooltip,
  withStyles,
  OutlinedInput,
} from '@material-ui/core'
import { CustomInputWrapper } from 'mui-pro-components'

const styles = (theme) => ({
  // textField: {
  //   marginLeft: theme.spacing.unit,
  //   marginRight: theme.spacing.unit,
  // },
})

const _config = {
  inputPropsArray: {
    key: 'inputProps',
    value: [
      'name',
      'onChange',
      'onBlur',
      'autoFocus',
      'multiline',
      'rows',
      'rowsMax',
      'type',
      'disabled',
    ],
  },
  // formControlPropsArray:{
  //   key:'formControlProps',
  //   value:['fullWidth'],
  // },
}

class OutlinedTextField extends PureComponent {
  state = {
    value: undefined,
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { value, field, control = 1 } = nextProps
    if (value !== undefined) {
      return {
        value,
        control,
      }
    }
    if (field) {
      return {
        value: field.value,
        control,
      }
    }
    return null
  }

  onChange = (event) => {
    const { props } = this
    const { value } = event.target
    if (props.readOnly) return

    this.setState({
      value,
    })
    if (props.onChange) {
      props.onChange({
        target: {
          value,
        },
      })
    }
    if (props.field && props.field.onChange) {
      props.field.onChange(
        {
          target: {
            value,
            name: props.field.name,
          },
        },
        props,
      )
    }
    if (props.inputProps && props.inputProps.onChange) {
      props.inputProps.onChange({
        target: {
          value,
        },
      })
    }
  }

  getClass = (classes) => {
    const {
      field,
      form,
      success,
      simple,
      white,
      // validBeforeChange = ,
      showErrorIcon,
      inputProps,
      inputRootCustomClasses,
    } = this.props
    let { error, help } = this.props
    if (field && form) {
      const shouldShow =
        Object.byString(form.touched, field.name) || form.submitCount > 0
      // || !validBeforeChange
      // console.log(
      //   Object.byString(form.touched, field.name),
      //   form.submitCount,
      //   !validBeforeChange,
      // )
      // console.log(shouldShow)
      // console.log(shouldShow)
      if (!error) {
        error = shouldShow && !!Object.byString(form.errors, field.name)
      }
      if (error) {
        if (inputProps) inputProps.autoFocus = true
        help =
          !showErrorIcon && shouldShow
            ? Object.byString(form.errors, field.name)
            : help
      }
    }
    const underlineClasses = classNames({
      [classes.underlineError]: error,
      [classes.underlineSuccess]: success && !error,
      [classes.underline]: !simple,
      [classes.simple]: simple,
      [classes.inputRoot]: true,
      [classes.whiteUnderline]: white,
    })
    // console.log(underlineClasses)
    const marginTop = classNames({
      [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
    })
    const inputClasses = classNames({
      [classes.input]: true,
      [classes.whiteInput]: white,
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
    const {
      field,
      form,
      theme,
      simple,
      label,
      placeholder,
      ...props
    } = this.props
    for (const key in _config) {
      if (Object.prototype.hasOwnProperty.call(_config, key)) {
        const element = _config[key]
        element.value.forEach((o) => {
          if (props[o]) {
            if (!props[element.key]) props[element.key] = {}
            props[element.key][o] = props[o]
            delete props[o]
          }
        })
      }
    }
    let {
      classes,
      formControlProps = {},
      prefixProps,
      suffixProps,
      // label,
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
      fullWidth = true,
      number,
      currency,
      creditCard,
      qty,
      control = 1,
      prefix,
      suffix,
      colon = true,
      realtime = true,
    } = props
    // console.log(this.state, this.state.value)
    if (this.state && this.state.value !== undefined) {
      inputProps.value = this.state.value
    }
    inputProps.onChange = this.onChange
    // console.log(this.props)
    if (field && form) {
      inputProps.name = field.name

      // inputProps.onChange = extendFunc(inputProps.onChange, field.onChange) // field.onChange
      inputProps.onFocus = extendFunc(inputProps.onFocus, () =>
        this.setState({ shrink: true }),
      )

      inputProps.onBlur = extendFunc(inputProps.onBlur, field.onBlur, () =>
        this.setState({ shrink: !!this.state.value }),
      )
      // inputProps.onBlur = extendFunc(inputProps.onBlur, (e)=>{
      //   if(!realtime)field.onChange(e)
      //   field.onBlur(e)
      // })

      const shouldShow =
        Object.byString(form.touched, field.name) || form.submitCount > 0
      if (!error) {
        error = shouldShow && !!Object.byString(form.errors, field.name)
      }
      if (error) {
        if (inputProps) inputProps.autoFocus = true
        help =
          !showErrorIcon && shouldShow
            ? Object.byString(form.errors, field.name)
            : help
      }
    }
    if (prefix) {
      inputProps.startAdornment = (
        <InputAdornment position='start' {...prefixProps}>
          {prefix}
        </InputAdornment>
      )
    }
    if (suffix) {
      inputProps.endAdornment = (
        <InputAdornment position='end' {...suffixProps}>
          {suffix}
        </InputAdornment>
      )
    }
    if (error && showErrorIcon) {
      inputProps.endAdornment = (
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
    const element = (
      <CustomInputWrapper
        labelProps={{ shrink: this.state.shrink || !!this.state.value }}
        {...props}
      >
        {(typeof children === 'function'
          ? children({
              getClass: this.getClass,
            })
          : false) || (
          <TextField
            classes={this.getClass(classes)}
            id={id}
            label={label}
            error={error}
            fullWidth={fullWidth}
            variant='outlined'
            placeholder={placeholder}
            {...inputProps}
          />
        )}
      </CustomInputWrapper>
    )
    return element
  }
}

export default withStyles(styles)(OutlinedTextField)
