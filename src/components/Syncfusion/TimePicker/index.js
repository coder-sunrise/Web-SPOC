import './index.css'
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars'

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
  additionalShortcutFormats,
  timeFormat24HourWithSecond,
  serverDateTimeFormatFull,
  Tooltip,
  timeFormat24Hour,
} from '@/components'

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
class TimePicker extends PureComponent {
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { field, value } = nextProps
    if (field) {
      this.setState({
        value: field.value === undefined ? '' : field.value,
        shrink: !!field.value,
      })
    } else if (value) {
      this.setState({
        value,
        shrink: !!value,
      })
    } else {
      this.setState({
        value: undefined,
        shrink: false,
      })
    }
  }

  handleChange = date => {
    const { form, field, onChange, showTime, endDay } = this.props
    // eslint-disable-next-line no-nested-ternary
    let v = date.value ? moment(date.value).format(timeFormat24Hour) : undefined
    if (form && field) {
      form.setFieldValue(field.name, v)
    }
    if (onChange) {
      onChange(v)
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
    this.setState({ focus: true })
  }

  handleBlur = e => {
    debounceKeydown.cancel()
    if (this.state.value === undefined || this.state.value === '') {
      this.setState({ shrink: false })
    }
    this.setState({ focus: false })
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
      max,
      min,
      step,
      disabled = false,
      ...restProps
    } = this.props
    let { format } = restProps

    if (!format) {
      format = dateFormatLong
    }
    if (text) {
      const v = this.state.value
        ? moment(this.state.value, timeFormat24Hour).format('hh:mm A')
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
        <div className='control-pane default'>
          <div className='control-section'>
            <div className='timepicker-control-section'>
              <TimePickerComponent
                enabled={!disabled}
                value={
                  this.state.value
                    ? moment(
                        new Date(
                          `${moment().format('YYYY MM DD')} ${
                            this.state.value
                          }`,
                        ),
                      ).toDate()
                    : undefined
                }
                change={this.handleChange}
                max={
                  max
                    ? moment(
                        new Date(`${moment().format('YYYY MM DD')} ${max}`),
                      ).toDate()
                    : undefined
                }
                min={
                  min
                    ? moment(
                        new Date(`${moment().format('YYYY MM DD')} ${min}`),
                      ).toDate()
                    : undefined
                }
                format='HH:mm'
                step={step}
                focus={extendFunc(onFocus, this.handleFocus)}
                blur={extendFunc(onBlur, this.handleBlur)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { classes, theme, onChange, ...restProps } = this.props

    const labelProps = {
      shrink: !!this.state.value || this.state.shrink || this.state.focus,
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
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

export default withStyles(STYLES, { name: 'TimePicker' })(TimePicker)
