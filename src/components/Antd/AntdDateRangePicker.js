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
    '& .ant-input': {
      borderBottomWidth: 0,
    },
    '& .ant-calendar-range-picker-input': {
      height: 'auto',
      textAlign: 'left',
    },
    '& .ant-calendar-range-picker-separator': {
      marginRight: 10,
    },
  },
})

class AntdDateRangePicker extends PureComponent {
  constructor (props) {
    super(props)
    const { field = {}, form, inputProps = {}, formatter, parser } = props
    this.state = {
      shrink: field.value !== undefined && field.value.length > 0,
      value:
        field.value !== undefined && field.value.length > 0
          ? field.value.map((o) => _toMoment(o))
          : [],
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

  componentWillReceiveProps (nextProps) {
    const { field } = nextProps
    if (field) {
      this.setState({
        value:
          field.value === undefined ? [] : field.value.map((o) => _toMoment(o)),
      })
    }
  }

  handleChange = (dateArray, dateString) => {
    // console.log(dateArray, dateString)
    this.setState({
      value: dateArray,
    })
    if (Array.isArray(dateArray)) {
      dateArray.forEach((o) => o.utcOffset())
    }
    const { form, field, onChange } = this.props
    if (form && field) {
      // console.log(date.format())
      // console.log(date.utcOffset())

      // console.log(date.utc().format())

      form.setFieldValue(
        field.name,
        Array.isArray(dateArray) ? dateArray.map((o) => o.format()) : [],
      )
    }

    if (onChange) {
      const { name } = this.props
      onChange(dateArray, dateString)
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
      nowOnwards,
      ...restProps
    } = this.props
    const { format = dateFormat, form, field, value } = restProps
    const selectValue = form && field ? field.value : value

    const cfg = {}
    //     if(nowOnwards){
    // cfg.disabledDate=()=>{
    //   return current && current < moment().endOf('day');
    // }
    //     }
    // date picker component dont pass formik props into wrapper
    // date picker component should handle the value change event itself
    return (
      <div style={{ width: '100%' }} {...props}>
        <DatePicker.RangePicker
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
          value={this.state.value}
          {...restProps}
        />
      </div>
    )
  }

  render () {
    const { classes, onChange, ...restProps } = this.props
    // const { value } = restProps
    const labelProps = {
      shrink: this.state.value.length > 0 || this.state.shrink,
    }
    // console.log(this.state.value)
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDateRangePicker' })(
  AntdDateRangePicker,
)
