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
  console.log(value)
  const m = moment.utc(value)

  return m.local()
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
  datepickerContainer: {
    width: '100%',
    boxSizing: 'content-box',
    lineHeight: '1em',
    color: 'currentColor',
    '& > div > input': {
      border: 'none',
      boxShadow: 'none !important',
      borderRadius: 0,
      paddingLeft: 0,
      height: '1.5em !important',
    },
    '& .ant-calendar-picker-input.ant-input': {
      lineHeight: 'inherit !important',
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

  constructor (props) {
    super(props)
    const { field = {}, form, inputProps = {}, formatter, parser } = props
    const v =
      field.value !== undefined && field.value !== ''
        ? field.value
        : props.value || props.defaultValue

    this.state = {
      shrink: v !== undefined && v !== '',
      value: v,
    }
  }

  componentWillReceiveProps (nextProps) {
    const { field, value } = nextProps
    if (field) {
      this.setState({
        value: field.value === undefined ? '' : field.value,
      })
    }
    if (value) {
      this.setState({
        value,
      })
    }
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
    console.log({ date, dateString })
    // if (date) {
    //   date.utcOffset()
    // }
    const { form, field, onChange, dateFormat } = this.props
    const v = date ? date.utc().format() : ''

    if (form && field) {
      // console.log(date.format())
      // console.log(date.utcOffset())

      // console.log(date.utc().format())

      form.setFieldValue(field.name, v)
    }
    this.setState({
      value: v,
    })
  }

  handleDatePickerOpenChange = (status) => {
    this.setState({ shrink: status })
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    if (this.state.value === undefined || this.state.value === '') {
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
    const { format = dateFormat } = restProps
    // console.log(this.state.value)
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
          value={_toMoment(this.state.value, format)}
          {...restProps}
        />
      </div>
    )
  }

  render () {
    const { classes, theme, ...restProps } = this.props
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
