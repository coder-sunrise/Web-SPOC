import React, { PureComponent } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import { extendFunc } from '@/utils/utils'
import Error from '@material-ui/icons/Error'
import {
  InputAdornment,
  TextField,
  Tooltip,
  withStyles,
} from '@material-ui/core'
import { CustomInputWrapper } from 'mui-pro-components'

const styles = () => ({})

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
}

class OutlinedTextField extends PureComponent {
  constructor (props) {
    super(props)
    const { field = {}, defaultValue = '' } = props
    this.state = {
      value:
        field.value !== undefined && field.value !== ''
          ? field.value
          : defaultValue,
    }

    this.debounceOnChange = _.debounce(this.debounceOnChange.bind(this), 300)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { field } = nextProps
    if (field) {
      this.setState({
        value:
          field.value !== undefined && field.value !== '' ? field.value : '',
      })
    }
  }

  onChange = (event) => {
    const { value } = event.target
    this.setState({
      value,
    })

    this.debounceOnChange(value)
  }

  debounceOnChange = (value) => {
    const { props } = this
    if (props.readOnly) return

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
      prefixProps,
      suffixProps,
      // label,
      id,
      inputProps = {},
      children,
      error,
      showErrorIcon,
      help,
      fullWidth = true,
      prefix,
      suffix,
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
        help={help}
        error={error}
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
