import React, { PureComponent } from 'react'
import moment from 'moment'
import AutosizeInput from 'react-input-autosize'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// wrapper
import { extendFunc } from '@/utils/utils'
import { control } from '@/components/Decorator'

import {
  CustomInputWrapper,
  BaseInput,
  CustomInput,
  dateFormat,
  DatePicker,
} from '@/components'

const _toMoment = (value, format) => {
  if (!value) return ''
  const m = moment.utc(value)

  return m.local()
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
    '& .ant-calendar-picker-icon': {
      marginTop: -7,
      right: 10,
    },
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
      marginTop: 3,
    },
  },
})

@control()
class AntdDateRangePicker extends PureComponent {
  constructor (props) {
    super(props)
    const { field = {}, form, inputProps = {}, formatter, parser } = props
    this.state = {
      shrink: field.value !== undefined && field.value.length > 0,
      value:
        field.value !== undefined && field.value.length > 0
          ? field.value.map((o) => _toMoment(o))
          : (props.value || props.defaultValue || []).map((o) => _toMoment(o)),
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
    // console.log(field.value)

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

    const { form, field, onChange } = this.props
    const v = Array.isArray(dateArray)
      ? dateArray.map((o) => o.utc().format())
      : []
    if (form && field) {
      // console.log(date.format())
      // console.log(date.utcOffset())

      // console.log(date.utc().format())

      form.setFieldValue(field.name, v)
    }

    if (onChange) {
      onChange(v, dateArray, dateString)
    }
  }

  handleDatePickerOpenChange = (status) => {
    this.setState({ shrink: status })
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = (e) => {
    // console.log('blur', e, e.target, e.target.value)
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
      value,
      text,
      ...restProps
    } = this.props
    const { format = dateFormat, form, field } = restProps
    const selectValue = form && field ? field.value : value

    const cfg = {}
    //     if(nowOnwards){
    // cfg.disabledDate=()=>{
    //   return current && current < moment().endOf('day');
    // }
    //     }
    // date picker component dont pass formik props into wrapper
    // date picker component should handle the value change event itself
    if (text) {
      // console.log(this.state.value)
      return (
        <span>
          <DatePicker text format={dateFormat} value={this.state.value[0]} /> ~
          <DatePicker text format={dateFormat} value={this.state.value[1]} />
        </span>
      )
    }
    return (
      <div style={{ width: '100%' }} {...props}>
        <DatePicker.RangePicker
          className={classnames(classes.datepickerContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          allowClear
          placeholder=''
          onChange={this.handleChange}
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
    const { classes, onChange, theme, ...restProps } = this.props
    // const { value } = restProps
    const labelProps = {
      shrink: this.state.value.length > 0 || this.state.shrink,
    }
    // console.log(this.state.value)
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDateRangePicker' })(
  AntdDateRangePicker,
)
