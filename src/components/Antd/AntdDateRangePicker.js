import React, { PureComponent } from 'react'
import moment from 'moment'
import AutosizeInput from 'react-input-autosize'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// wrapper
import { DatePicker as DP } from 'antd'
import { extendFunc } from '@/utils/utils'
import { control } from '@/components/Decorator'
import {
  CustomInputWrapper,
  BaseInput,
  CustomInput,
  dateFormat,
  dateFormatWithTime,
} from '@/components'

import DatePicker from './AntdDatePicker'

const { RangePicker } = DP
const _toMoment = (value, isLocal) => {
  if (!value) return null
  const m = moment.utc(value)
  return isLocal ? m.local() : m
}

const STYLES = (theme) => ({
  dropdownMenu: {
    zIndex: 1305,
  },
  datepickerContainer: {
    width: '100% !important',
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
    },
  },
})

@control()
class AntdDateRangePicker extends PureComponent {
  constructor (props) {
    super(props)
    const {
      field = {},
      form,
      inputProps = {},
      formatter,
      parser,
      local,
    } = props
    this.state = {
      shrink: field.value !== undefined && field.value.length > 0,
      value:
        field.value !== undefined && field.value.length > 0
          ? field.value.map((o) => _toMoment(o, local))
          : (props.value || props.defaultValue || [])
              .map((o) => _toMoment(o, local)),
    }
  }

  static defaultProps = {
    local: true,
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
    const { field, local } = nextProps
    // console.log(field.value)

    if (field) {
      this.setState({
        value:
          field.value === undefined
            ? []
            : field.value.map((o) => _toMoment(o, local)),
      })
    }
  }

  handleChange = (dateArray, dateString) => {
    this.setState({
      value: dateArray,
    })

    const { form, field, onChange, showTime } = this.props
    const v = Array.isArray(dateArray)
      ? dateArray.map((o, i) => {
          // console.log(
          //   showTime,
          //   o,
          //   i,
          //   o !== undefined
          //     ? // eslint-disable-next-line no-nested-ternary
          //       i === 0
          //       ? showTime
          //         ? o.utc().format()
          //         : o.utc().set({ hour: 0, minute: 0, second: 0 }).format()
          //       : showTime
          //         ? o.utc().format()
          //         : o.utc().set({ hour: 23, minute: 59, second: 59 }).format()
          //     : o,
          // )
          // eslint-disable-next-line no-nested-ternary
          return o !== undefined
            ? // eslint-disable-next-line no-nested-ternary
              i === 0
              ? showTime
                ? o.utc().format()
                : o.set({ hour: 0, minute: 0, second: 0 }).utc().format()
              : showTime
                ? o.utc().format()
                : o.set({ hour: 23, minute: 59, second: 59 }).utc().format()
            : o
        })
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
    // const { form, field } = restProps
    let { format } = restProps
    // console.log(format, restProps.showTime, restProps)

    if (!format) {
      if (restProps.showTime) {
        format = dateFormatWithTime
      } else {
        format = dateFormat
      }
    }
    // const selectValue = form && field ? field.value : value
    // const cfg = {}
    //     if(nowOnwards){
    // cfg.disabledDate=()=>{
    //   return current && current < moment().endOf('day');
    // }
    //     }
    // console.log(format)
    // date picker component dont pass formik props into wrapper
    // date picker component should handle the value change event itself
    if (text) {
      // console.log(this.state.value)
      return (
        <span>
          <DatePicker text format={format} value={this.state.value[0]} /> ~
          <DatePicker text format={format} value={this.state.value[1]} />
        </span>
      )
    }
    return (
      <div style={{ width: '100%' }} {...props}>
        <RangePicker
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
