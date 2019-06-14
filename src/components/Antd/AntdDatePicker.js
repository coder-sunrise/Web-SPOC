import React, { PureComponent } from 'react'
import moment from 'moment'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { DatePicker } from 'antd'
// assets
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
// wrapper
import AntdWrapper from './AntdWrapper'
import { extendFunc } from '@/utils/utils'
import {
  CustomInputWrapper,
  BaseInput,
  CustomInput,
  dateFormat,
} from '@/components'

const _toMoment = (value, format) => {
  if (!value) return ''
  // console.log(value, format)
  // console.log(moment.zone())
  return moment(value)
  if (!value) return value
  try {
    if (moment(value, format).isValid()) return moment(value, format)
    return null
  } catch (error) {
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
    boxSizing: 'content-box',
    lineHeight: '1rem',
    color: 'currentColor',
    '& > div > input': {
      border: 'none',
      boxShadow: 'none !important',
      borderRadius: 0,
      paddingLeft: 0,
    },
  },
})

class AntdDatePicker extends PureComponent {
  // static defaultProps = {
  //   // label: 'Select date',
  //   format: dateFormat,
  //   disabled: false,
  //   size: 'default',
  // }

  state = {
    shrink: false,
  }

  // shouldComponentUpdate = (nextProps) => {
  //   const { form, field, value } = this.props
  //   const { form: nextForm, field: nextField, value: nextValue } = nextProps

  //   const currentDateValue = form && field ? field.value : value
  //   const nextDateValue = nextForm && nextField ? nextField.value : nextValue

  //   if (form && nextForm)
  //     return (
  //       nextDateValue !== currentDateValue ||
  //       form.errors[field.name] !== nextForm.errors[nextField.name] ||
  //       form.touched[field.name] !== nextForm.touched[nextField.name]
  //     )

  //   return nextDateValue !== currentDateValue
  // }

  handleChange = (date, dateString) => {
    // console.log(date, dateString)
    if (date) {
      date.utcOffset()
    }
    const { form, field, onChange } = this.props
    if (form && field) {
      // console.log(date.format())
      // console.log(date.utcOffset())

      // console.log(date.utc().format())

      form.setFieldValue(field.name, date ? date.utc().format() : '')
    }

    if (onChange) {
      const { name } = this.props
      onChange(dateString, name)
    }
  }

  handleDatePickerOpenChange = (status) => {
    this.setState({ shrink: status })
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    if (this.state.value === undefined || this.state.value.length === 0) {
      this.setState({ shrink: false })
    }
  }

  // render () {
  //   const { classes, onChange, ...restProps } = this.props
  //   const { format, form, field, value } = restProps
  //   const selectValue = form && field ? field.value : value

  //   // date picker component dont pass formik props into wrapper
  //   // date picker component should handle the value change event itself
  //   return (
  //     <AntdWrapper {...restProps} isChildDatePicker>
  //       <DatePicker
  //         className={classnames(classes.datepickerContainer)}
  //         dropdownClassName={classnames(classes.dropdownMenu)}
  //         allowClear
  //         placeholder=''
  //         onChange={extendFunc(onChange, this.handleChange)}
  //         value={_toMoment(selectValue, format)}
  //       />
  //     </AntdWrapper>
  //   )
  // }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      onChange,
      onFocus,
      onBlur,
      onOpenChange,
      ...restProps
    } = this.props
    const { format = dateFormat, form, field, value } = restProps
    const selectValue = form && field ? field.value : value

    // date picker component dont pass formik props into wrapper
    // date picker component should handle the value change event itself
    return (
      <div style={{ width: '100%' }} {...props}>
        <DatePicker
          className={classnames(classes.datepickerContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          allowClear
          placeholder=''
          onChange={extendFunc(onChange, this.handleChange)}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          onOpenChange={extendFunc(
            onOpenChange,
            this.handleDatePickerOpenChange,
          )}
          format={format}
          value={_toMoment(selectValue, format)}
        />
      </div>
    )
  }

  render () {
    const { classes, ...restProps } = this.props
    const { form, field, value } = restProps
    const selectValue = form && field ? field.value : value
    // console.log(selectValue)
    const labelProps = {
      shrink: !!selectValue || this.state.shrink,
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        {...restProps}
        value={this.state.selectValue}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDatePicker' })(AntdDatePicker)
