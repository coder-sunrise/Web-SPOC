import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
// ant
import { Select, Form } from 'antd'
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import { extendFunc, currencyFormat } from '@/utils/utils'

const STYLES = (theme) => {
  console.log('theme', theme)
  return {
    // ...inputStyle(theme),

    control: {
      position: 'relative',
      paddingTop: '24px',
      transformOrigin: 'top left',
    },
    controlUnderline: {
      '& .antdwrapper:after': {
        transform: 'scaleX(1) !important',
      },
    },
    label: {
      pointerEvents: 'none',
      position: 'absolute',
      color: 'rgba(0, 0, 0, 0.54)',
      top: 3,
      left: 2,
      zIndex: 999,
      paddingBottom: 0,
      transform: 'translate(0, 28px) scale(1)',
    },
    mediumLabel: {
      fontSize: '1rem',
    },
    largeLabel: {
      fontSize: '1.2rem',
    },
    smallLabel: {
      fontSize: '0.875rem',
    },
    labelFocused: {
      color: theme.palette.primary.main,
    },
    inputError: {
      color: `${theme.palette.error.main} !important`,
    },
    underlineError: {
      '& .antdwrapper:after': {
        borderBottomColor: theme.palette.error.main,
      },
    },
    labelShrink: {
      transform: 'translate(0, 5px) scale(0.8)',
      transformOrigin: 'top left',
    },
    labelAnimation: {
      transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
    },
    helpText: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '0.75rem',
      margin: 0,
      marginTop: 4,
      minHeight: '1em',
      lineHeight: '1em',
      textAlign: 'left',
    },
  }
}

class AntDSelect extends React.PureComponent {
  static propTypes = {
    // required props

    // conditionally required
    value: (props, propName, componentName) => {
      const { onChange } = props
      if (onChange && props[propName] === undefined)
        return new Error(
          `prop ${propName} is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    // optional props
    onChange: PropTypes.func,
    label: PropTypes.string,
  }

  static defaultProps = {}

  state = {
    shrink: false,
  }

  handleValueChange = (event) => {
    console.log('handlevaluechange', event)

    const { form, field } = this.props
    let returnValue
    if (event) {
      returnValue = event.target ? event.target.value : event
    } else {
      returnValue = event
    }
    if (form && field) {
      // field.onChange &&
      //   field.onChange(
      //     {
      //       target: {
      //         value: returnValue === undefined ? '' : returnValue,
      //         name: field.name,
      //       },
      //     },
      //     this.props,
      //   )
      form.setFieldValue(
        field.name,
        returnValue === undefined ? '' : returnValue,
      )
      form.setFieldTouched(field.name, true)
    }
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    this.setState({ shrink: false })
  }

  render () {
    const {
      classes,
      label,
      children,
      onChange,
      size,
      value,
      form,
      field,
      helpText,
      ...restProps
    } = this.props

    const { shrink } = this.state

    const inputValue = form && field ? field.value : value
    let shouldShrink = shrink || !!inputValue

    if (restProps.mode === 'multiple') {
      if (inputValue) shouldShrink = shrink || inputValue.length !== 0
      else shouldShrink = shrink
    }

    // error indicator
    let showError = false
    let errorText = ''
    if (form) {
      showError =
        form.errors[field.name] !== undefined && form.touched[field.name]
      errorText = form.errors[field.name]
    }

    const labelClass = {
      [classes.label]: true,
      [classes.labelAnimation]: true,
      [classes.labelShrink]: shouldShrink,
      [classes.labelFocused]: shrink,
      [classes.mediumLabel]: size === 'default',
      [classes.smallLabel]: size === 'small',
      [classes.largeLabel]: size === 'large',
      [classes.inputError]: showError,
    }
    const classForControl = {
      [classes.control]: true,
      [classes.controlUnderline]: shrink,
      [classes.underlineError]: showError,
    }
    const classForHelpText = {
      [classes.helpText]: true,
      [classes.inputError]: showError,
    }

    // return (
    //   <Form layout='vertical' className={classnames(classes.control)}>
    //     <Form.Item label={label} className={classnames(labelClass)}>
    //       {React.cloneElement(children, {
    //         onChange: extendFunc(this.handleValueChange, onChange),
    //         ...restProps,
    //       })}
    //     </Form.Item>
    //   </Form>
    // )

    let extendedOnBlur = this.handleBlur
    if (form && field) {
      extendedOnBlur = extendFunc(this.handleBlur, field.onBlur)
    }

    return (
      <div className={classnames(classForControl)}>
        <span className={classnames(labelClass)}>{label}</span>
        <div className='antdwrapper'>
          {React.cloneElement(children, {
            onChange: extendFunc(onChange, this.handleValueChange),
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            value: inputValue,
            ...restProps,
          })}
        </div>
        <p className={classnames(classForHelpText)}>
          {showError ? errorText : helpText}
        </p>
      </div>
    )
  }
}

export default withStyles(STYLES, { name: 'AntdWrapper' })(AntDSelect)
