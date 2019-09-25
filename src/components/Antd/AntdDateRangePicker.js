import React, { PureComponent } from 'react'
import moment from 'moment'
import AutosizeInput from 'react-input-autosize'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// wrapper
import { DatePicker as DP } from 'antd'
import { extendFunc, toUTC, toLocal } from '@/utils/utils'
import { control } from '@/components/Decorator'
import {
  CustomInputWrapper,
  BaseInput,
  CustomInput,
  dateFormat,
  dateFormatWithTime,
  dateFormatLong,
  dateFormatLongWithTime,
} from '@/components'

import DatePicker from './AntdDatePicker'

const { RangePicker } = DP
const _toMoment = (value, isLocal, i, showTime) => {
  if (!value) return null
  let m = moment(value)
  if (!showTime) {
    if (i === 0) {
      m = m.set({ hour: 0, minute: 0, second: 0 })
    } else if (i === 1) {
      m = m.set({ hour: 23, minute: 59, second: 59 })
    }
  }

  return m
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
  static defaultProps = {
    local: true,
  }

  constructor (props) {
    super(props)
    const {
      field = {},
      form,
      inputProps = {},
      formatter,
      parser,
      local,
      showTime,
    } = props
    this.state = {
      shrink: field.value !== undefined && field.value.length > 0,
      value:
        field.value !== undefined && field.value.length > 0
          ? field.value
          : props.value || props.defaultValue || [],
    }
    if (form && field && this.state.value.length > 0) {
      setTimeout(() => {
        form.setFieldValue(
          field.name,
          this.state.value.map((o, i) => {
            // eslint-disable-next-line no-nested-ternary
            return o !== undefined
              ? // eslint-disable-next-line no-nested-ternary
                i === 0
                ? showTime
                  ? moment(o).format()
                  : moment(o).set({ hour: 0, minute: 0, second: 0 }).format()
                : showTime
                  ? moment(o).format()
                  : moment(o).set({ hour: 23, minute: 59, second: 59 }).format()
              : o
          }),
        )
      }, 1)
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { field, local, showTime } = nextProps
    // console.log(field.value)

    if (field) {
      this.setState({
        value: field.value === undefined ? [] : field.value,
      })
    }
  }

  handleChange = (dateArray, dateString) => {
    const { form, field, onChange, showTime } = this.props
    const v = Array.isArray(dateArray)
      ? dateArray.map((o, i) => {
          // eslint-disable-next-line no-nested-ternary
          return o !== undefined
            ? // eslint-disable-next-line no-nested-ternary
              i === 0
              ? showTime
                ? o.format()
                : o.set({ hour: 0, minute: 0, second: 0 }).format()
              : showTime
                ? o.format()
                : o.set({ hour: 23, minute: 59, second: 59 }).format()
            : o
        })
      : []

    this.setState({
      value: v,
    })
    if (form && field) {
      // console.log(date.format())
      // console.log(date.utcOffset())

      // console.log(date.toUTC().format())
      form.setFieldValue(field.name, v)
    }

    if (onChange) {
      onChange(dateString, dateArray, v)
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
      local = true,
      ...restProps
    } = this.props
    // const { form, field } = restProps
    let { format } = restProps
    // console.log(format, restProps.showTime, restProps)

    if (!format) {
      if (restProps.showTime) {
        format = text ? dateFormatLongWithTime : dateFormatLongWithTime
      } else {
        format = text ? dateFormatLong : dateFormatLong
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
          <DatePicker
            text
            format={format}
            value={this.state.value[0]}
          />&nbsp;~&nbsp;
          <DatePicker text format={format} value={this.state.value[1]} />
        </span>
      )
    }
    // console.log(this.state.value.map((o) => o.add(8, 'days')))

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
          value={this.state.value.map(
            (o, i) =>
              moment.isMoment(o)
                ? o
                : _toMoment(o, local, i, restProps.showTime),
          )}
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
