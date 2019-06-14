import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { DatePicker } from 'antd'
// assets
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'

const _dateFormat = 'YYYY-MM-DD'

const _toMoment = (value) => {
  if (!value) return value
  try {
    if (moment(value, _dateFormat).isValid()) return moment(value, _dateFormat)

    return null
  } catch (error) {
    console.error(`Parse date to moment error ${error}`)
    return null
  }
}

const STYLES = (theme) => ({
  ...inputStyle(theme),
  dropdownMenu: {
    zIndex: 1305,
  },
  datepickerContainer: {
    width: '100%',
    '& > div > input': {
      // erase all border, and boxShadow
      border: 'none',
      boxShadow: 'none !important',
      borderRadius: 0,
      borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
      paddingLeft: 0,
      fontSize: '1rem',
      height: 31,
    },
  },
})

class AntdDateRangePicker extends React.PureComponent {
  state = {
    shrink: false,
  }

  static defaultProps = {
    label: 'Select date',
    format: 'YYYY-MM-DD',
    disabled: false,
    size: 'default',
    separator: '-',
  }

  handleChange = (date, dateString) => {
    const { form, field, onChange } = this.props
    if (form && field) {
      form.setFieldValue(field.name, dateString)
    }

    if (onChange) {
      const { name } = this.props
      onChange(name, dateString)
    }
  }

  handleCalendarOpenChange = (status) => {
    this.setState({ shrink: status })
  }

  render () {
    const {
      classes,
      disabled,
      label,
      helpText,
      separator,
      format,
      form,
      field,
      value,
      size,
    } = this.props

    const { shrink } = this.state

    let inputValue = form && field ? field.value : value
    if (inputValue === undefined) inputValue = []

    let shouldShrink = shrink
    if (inputValue && inputValue.length === 2) {
      shouldShrink = shrink || (inputValue[0] !== '' && inputValue[1] !== '')
    }

    // error indicator
    let showError = false
    let errorText = ''
    if (form) {
      showError =
        form.errors[field.name] !== undefined && form.touched[field.name]
      errorText = form.errors[field.name]
    }

    // dont show separator when label is not shrunk
    const _separator = !shouldShrink ? ' ' : separator

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
    const classForHelpText = {
      [classes.helpText]: true,
      [classes.inputError]: showError,
    }

    return (
      <div className={classnames(classForControl)}>
        <span className={classnames(classForLabel)}>{label}</span>
        <DatePicker.RangePicker
          className={classnames(classes.datepickerContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          allowClear
          placeholder=''
          disabled={disabled}
          size={size}
          format={format}
          separator={_separator}
          onChange={this.handleChange}
          value={inputValue.map((date) => _toMoment(date))}
          onOpenChange={this.handleCalendarOpenChange}
        />
        <p className={classnames(classForHelpText)}>
          {showError ? errorText : helpText}
        </p>
      </div>
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDateRangePicker' })(
  AntdDateRangePicker,
)
