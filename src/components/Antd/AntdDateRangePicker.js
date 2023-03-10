import React, { PureComponent } from 'react'
import moment from 'moment'
import AutosizeInput from 'react-input-autosize'
import classnames from 'classnames'
import $ from 'jquery'
import _ from 'lodash'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// wrapper
import { DatePicker as DP } from 'antd'
import { extendFunc, toUTC, toLocal } from '@/utils/utils'
import { control } from '@/components/Decorator'
import {
  CustomInputWrapper,
  CustomInput,
  dateFormat,
  dateFormatWithTime,
  dateFormatLong,
  dateFormatLongWithTime,
  additionalShortcutFormats,
  serverDateTimeFormatFull,
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

const STYLES = theme => ({
  dropdownMenu: {
    zIndex: 1305,
  },
  datepickerContainer: {
    width: '100% !important',
    boxSizing: 'content-box',
    lineHeight: '1rem',
    backgroundColor: 'transparent',
    color: 'currentColor',
    padding: 0,
    border: '0px solid #ccc !important',
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
    '&.ant-picker-focused': {
      boxShadow: 'none !important',
    },
    '& .ant-picker-active-bar': {
      marginLeft: 0,
      bottom: -2,
    },
    '& .ant-picker-range-separator': {
      padding: '0 4',
    },
    '& .ant-picker-clear': {
      right: 0,
    },
  },
})
const keydown = e => {
  if (e.shiftKey) return
  // console.log(e.target)
  if (e.which === 9) {
    // Tab
    return false
  }
  $(e.target)
    .find('input')
    .trigger('click')
}
const debounceKeydown = _.debounce(keydown, 1000, {
  leading: true,
  trailing: false,
})
@control()
class AntdDateRangePicker extends PureComponent {
  static defaultProps = {
    local: true,
  }

  constructor(props) {
    super(props)
    const {
      field = {},
      form,
      inputProps = {},
      formatter,
      parser,
      local,
      dateOnly,
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
                  ? moment(o).formatUTC()
                  : moment(o)
                      .set({ hour: 0, minute: 0, second: 0 })
                      .formatUTC(false)
                : showTime
                ? moment(o).formatUTC()
                : moment(o)
                    .set({ hour: 23, minute: 59, second: 59 })
                    .formatUTC(false)
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { field, local, showTime, value } = nextProps
    // console.log(field.value)

    if (field) {
      this.setState({
        value: field.value === undefined ? [] : field.value,
      })
    } else if (value) {
      this.setState({
        value,
      })
    } else {
      this.setState({
        value: [],
        shrink: false,
      })
    }
  }

  handleChange = (dateArray, dateString) => {
    const { form, field, onChange, showTime, dateOnly } = this.props
    const v = Array.isArray(dateArray)
      ? dateArray.map((o, i) => {
          // eslint-disable-next-line no-nested-ternary
          return o !== undefined
            ? // eslint-disable-next-line no-nested-ternary
              i === 0
              ? showTime
                ? moment(o).formatUTC(false)
                : moment(o.set({ hour: 0, minute: 0, second: 0 })).formatUTC(
                    false,
                  )
              : showTime
              ? moment(o).formatUTC(false)
              : moment(o.set({ hour: 23, minute: 59, second: 59 })).formatUTC(
                  false,
                )
            : o
        })
      : []
    this.setState({
      value: v,
      shrink: dateArray?.length > 0,
    })
    if (form && field) {
      // console.log(date.formatUTC())
      // console.log(date.utcOffset())

      // console.log(date.toUTC().formatUTC())
      form.setFieldValue(field.name, v)
    }

    if (onChange) {
      onChange(v, dateArray, dateString)
    }
  }

  handleDatePickerOpenChange = status => {
    this.setState({ shrink: status })
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = e => {
    debounceKeydown.cancel()
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
      if (!this.state.value[0] && !this.state.value[1]) return <span>-</span>
      return (
        <span>
          <DatePicker text format={format} value={this.state.value[0]} />
          &nbsp;~&nbsp;
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
          placeholder={['', '']}
          // startPlaceholder=''
          // endPlaceholder=''
          onChange={this.handleChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          onOpenChange={extendFunc(
            onOpenChange,
            this.handleDatePickerOpenChange,
          )}
          format={[format, ...additionalShortcutFormats]}
          value={this.state.value.map((o, i) =>
            moment.isMoment(o) ? o : _toMoment(o, local, i, restProps.showTime),
          )}
          {...restProps}
        />
      </div>
    )
  }

  render() {
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
        {...restProps}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        onKeyUp={() => false}
        onKeyDown={debounceKeydown}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDateRangePicker' })(
  AntdDateRangePicker,
)
