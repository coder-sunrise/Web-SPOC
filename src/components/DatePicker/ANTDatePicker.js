import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant design
import { DatePicker, Form } from 'antd'

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  control: {
    '& .ant-form-item': {
      paddingTop: '24px',
      transformOrigin: 'top left',
    },
  },
  label: {
    '& .ant-form-item-label': {
      pointerEvents: 'none',
      position: 'absolute',
      top: 4,
      left: 0,
      zIndex: 999,
      paddingBottom: 0,
      transform: 'translate(0, 27px) scale(1)',
    },
    '& .ant-form-item-label > label': {
      color: 'rgba(0, 0, 0, 0.42)',
      fontSize: '1rem',
    },
  },
  labelFocused: {
    '& .ant-form-item-label > label': {
      color: theme.palette.primary.main,
    },
  },
  labelShrink: {
    '& .ant-form-item-label': {
      transform: 'translate(0, 2px) scale(0.8)',
      transformOrigin: 'top left',
    },
  },
  labelAnimation: {
    '& .ant-form-item-label': {
      transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
    },
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
    },
  },
})

class ANTDatePicker extends PureComponent {
  static propTypes = {
    // conditionally required
    name: (props, propName, componentName) => {
      const { onChange } = props
      if (onChange && props[propName] === undefined)
        return new Error(
          `prop { name } is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    value: (props, propName, componentName) => {
      const { onChange } = props
      if (onChange && props[propName] === undefined)
        return new Error(
          `prop ${propName} is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    // optional props
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.string,
    size: PropTypes.string,
    format: PropTypes.string,
  }

  static defaultProps = {
    label: 'Select date',
    format: 'YYYY-MM-DD',
    disabled: false,
    size: 'default',
  }

  state = {
    shrink: false,
  }

  handleValueChange = (date, dateString) => {
    const { form, field, onChange } = this.props
    if (form && field) {
      form.setFieldValue(field.name, dateString)
    }

    if (onChange) {
      const { name } = this.props
      onChange(name, dateString)
    }
    dateString === '' && this.handleBlur()
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    this.setState({ shrink: false })
  }

  render () {
    const { shrink } = this.state
    const {
      classes,
      disabled,
      format,
      form,
      field,
      value,
      label,
      size,
      ...restDefaultProps
    } = this.props

    const selectValue = form && field ? field.value : value

    const labelClass = {
      [classes.label]: true,
      [classes.labelAnimation]: true,
      [classes.labelShrink]: shrink || !!selectValue,
      [classes.labelFocused]: shrink,
    }

    return (
      <Form layout='vertical' className={classnames(classes.control)}>
        <Form.Item label={label} className={classnames(labelClass)}>
          <DatePicker
            className={classnames(classes.datepickerContainer)}
            allowClear
            disabled={disabled}
            size={size}
            format={format}
            placeholder=''
            onChange={this.handleValueChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            {...restDefaultProps}
          />
        </Form.Item>
      </Form>
    )
  }
}

export default withStyles(styles, { name: 'ANTDatePicker' })(ANTDatePicker)
