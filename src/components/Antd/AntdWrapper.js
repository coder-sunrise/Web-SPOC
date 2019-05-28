import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'

const STYLES = (theme) => ({
  ...inputStyle(theme),
})

class AntdWrapper extends React.PureComponent {
  static propTypes = {
    // optional props
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    helpText: PropTypes.string,
  }

  static defaultProps = {}

  state = {
    shrink: false,
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    this.setState({ shrink: false })
  }

  handleDatePickerOpenChange = (status) => {
    this.setState({ shrink: status })
  }

  render () {
    const {
      classes,
      children,
      label,
      form,
      field,
      helpText,
      isChildDatePicker,
      onChange,
      size,
      value,
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

    const classForLabel = {
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

    let hideHelpText = helpText === undefined
    if (showError) hideHelpText = false
    const classForHelpText = {
      [classes.helpText]: true,
      [classes.inputError]: showError,
      [classes.hiddenHelpText]: hideHelpText,
    }
    return (
      <div className={classnames(classForControl)}>
        <span className={classnames(classForLabel)}>{label}</span>
        <div className='antdwrapper'>
          {isChildDatePicker ? (
            React.cloneElement(children, {
              onOpenChange: this.handleDatePickerOpenChange,
              ...restProps,
            })
          ) : (
            React.cloneElement(children, {
              onFocus: this.handleFocus,
              onBlur: this.handleBlur,
              ...restProps,
            })
          )}
        </div>
        <p className={classnames(classForHelpText)}>
          {showError ? errorText : helpText}
        </p>
      </div>
    )
  }
}

export default withStyles(STYLES, { name: 'AntdWrapper' })(AntdWrapper)
