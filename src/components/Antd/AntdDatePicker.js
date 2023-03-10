import React, { PureComponent } from 'react'
import AutosizeInput from 'react-input-autosize'
import moment from 'moment'
import _ from 'lodash'
import $ from 'jquery'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { DatePicker, LocaleProvider } from 'antd'
// import en_US from 'antd/es/locale-provider/en_US'

// assets
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
// wrapper
import { extendFunc, toLocal, toUTC } from '@/utils/utils'
import { control } from '@/components/Decorator'
import {
  CustomInputWrapper,
  CustomInput,
  dateFormatLong,
  dateFormatWithTime,
  richFormat,
  additionalShortcutFormats,
  timeFormat24HourWithSecond,
  serverDateTimeFormatFull,
  Tooltip,
} from '@/components'

const _toMoment = (value, isLocal, showTime) => {
  if (!value) return null
  const m = showTime
    ? moment(value)
    : moment(value).set({ hour: 0, minute: 0, second: 0 })
  return m

  // if (!value) return value
  // try {
  //   if (moment(value, format).isValid()) return moment(value, format)
  //   return null
  // } catch (error) {
  //   return null
  // }
}

const STYLES = theme => ({
  ...inputStyle(theme),
  datepickerContainer: {
    width: '100% !important',
    boxSizing: 'content-box',
    lineHeight: '1em',
    color: 'currentColor',
    borderWidth: 0,
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
    padding: 0,

    '& > div > input': {
      border: 'none',
      boxShadow: 'none !important',
      borderRadius: 0,
      paddingLeft: 0,
      height: '1.5em !important',
      '&[disabled]': {
        color: 'gray !important',
      },
    },
    '& .ant-calendar-picker-input.ant-input': {
      lineHeight: 'inherit !important',
    },
  },
})

const keydown = e => {
  if (e.shiftKey) return

  if (e.which === 9) {
    // Tab
    return false
  }
  $(e.target).trigger('click')
}
const debounceKeydown = _.debounce(keydown, 1000, {
  leading: true,
  trailing: false,
})

@control()
class AntdDatePicker extends PureComponent {
  // static defaultProps = {
  //   // label: 'Select date',
  //   format: dateFormat,
  //   disabled: false,
  //   size: 'default',
  // }

  static defaultProps = {
    local: true,
    dateOnly: true,
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
      showTime,
      endDay,
      dateOnly,
    } = props
    const v =
      field.value !== undefined && field.value !== ''
        ? field.value
        : props.value || props.defaultValue
    this.state = {
      shrink: v !== undefined && v !== '',
      value: v,
    }
    if (form && field && this.state.value && dateOnly) {
      setTimeout(() => {
        form.setFieldValue(
          field.name,
          showTime
            ? moment(this.state.value).formatUTC(false)
            : moment(this.state.value)
                .set(
                  endDay
                    ? { hour: 23, minute: 59, second: 59 }
                    : { hour: 0, minute: 0, second: 0 },
                )
                .formatUTC(false),
        )
      }, 1)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { field, value } = nextProps
    // console.log(value)
    // if (value) console.log(value.target)
    if (field) {
      this.setState({
        value: field.value === undefined ? '' : field.value,
        shrink: !!field.value,
      })
    } else if (value) {
      if (typeof value === 'string' || moment.isMoment(value)) {
        this.setState({
          value,
          shrink: !!value,
        })
      }
    } else {
      this.setState({
        value: undefined,
        shrink: false,
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
    // console.log({ date, dateString })
    // if (date) {
    //   date.utcOffset()
    // }
    const { form, field, onChange, showTime, endDay } = this.props
    // eslint-disable-next-line no-nested-ternary
    let v = date
      ? showTime
        ? moment(date).formatUTC(false)
        : moment(date.set({ hour: 0, minute: 0, second: 0 })).formatUTC()
      : ''
    if (endDay) {
      v = date
        ? moment(date.set({ hour: 23, minute: 59, second: 59 })).formatUTC(
            false,
          )
        : ''
    }
    if (form && field) {
      form.setFieldValue(field.name, v)
    }
    if (onChange) {
      onChange(v, date, dateString)
    }
    this.setState({
      value: v,
    })
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

  // disabledDate = (current) => {
  //   console.log(current)
  //   // Can not select days before today and today
  //   return current && current < moment().endOf('day')
  // }

  // render () {
  //   const { classes, onChange, ...restProps } = this.props
  //   const { format, form, field, value } = restProps
  //   const value = form && field ? field.value : value

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
  //         value={_toMoment(value, format)}
  //       />
  //     </AntdWrapper>
  //   )
  // }

  buildInRestrict = current => {
    const { dobRestrict, recurrenceRestrict, restrictFromTo } = this.props
    if (dobRestrict) {
      return (
        current &&
        (current > moment().endOf('day') ||
          current < moment('1800-01-01').startOf('day'))
      )
    }

    if (recurrenceRestrict) {
      return (
        current &&
        (current < moment(recurrenceRestrict).endOf('day') ||
          current >
            moment()
              .add(3, 'months')
              .startOf('day'))
      )
    }

    if (restrictFromTo) {
      let restrictFromDate = moment(restrictFromTo[0]).startOf('day')
      if (!restrictFromDate.isValid())
        restrictFromDate = moment().startOf('day')

      let restrictToDate = moment(restrictFromTo[1]).endOf('day')
      if (!restrictToDate.isValid()) restrictToDate = null

      if (!restrictToDate && restrictFromDate) {
        return restrictFromDate.isAfter(current)
      }

      return !(
        restrictFromDate.isSameOrBefore(current) &&
        restrictToDate.isAfter(current)
      )
    }

    return false
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      onChange,
      onFocus,
      onBlur,
      onOpenChange,
      value,
      text,
      local = true,
      ...restProps
    } = this.props
    let { format } = restProps

    if (!format) {
      if (restProps.showTime) {
        format = `${dateFormatLong} ${timeFormat24HourWithSecond}`
      } else {
        format = dateFormatLong
      }
    }
    // console.log(format, restProps.showTime)

    // date picker component dont pass formik props into wrapper
    // date picker component should handle the value change event itself
    if (text) {
      const v =
        this.state.value !== undefined &&
        _toMoment(this.state.value, local, restProps.showTime)
          ? _toMoment(this.state.value, local, restProps.showTime).format(
              format,
            )
          : '-'
      if (v === '-') return <span>{v}</span>
      return (
        <Tooltip title={v} enterDelay={750}>
          <AutosizeInput
            readOnly
            title=''
            tabIndex='-1'
            inputClassName={props.className}
            value={v}
          />
        </Tooltip>
      )
    }

    return (
      <div style={{ width: '100%' }} {...props}>
        <DatePicker
          className={classnames(classes.datepickerContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          allowClear
          placeholder=''
          onChange={this.handleChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          disabledDate={this.buildInRestrict}
          onOpenChange={extendFunc(
            onOpenChange,
            this.handleDatePickerOpenChange,
          )}
          format={[
            format,
            ...(restProps.showTime
              ? additionalShortcutFormats.map(
                  o => `${o} ${timeFormat24HourWithSecond}`,
                )
              : additionalShortcutFormats),
          ]}
          value={_toMoment(this.state.value, local, restProps.showTime)}
          {...restProps}
        />
      </div>
    )
  }

  render() {
    const { classes, theme, onChange, ...restProps } = this.props

    const labelProps = {
      shrink: !!this.state.value || this.state.shrink,
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        // onKeyUp={(e) => {
        //   console.log(e)
        // }}
        {...restProps}
        value={this.state.value}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        onKeyUp={() => false}
        onKeyDown={debounceKeydown}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDatePicker' })(AntdDatePicker)
