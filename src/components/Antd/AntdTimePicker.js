import React, { PureComponent } from 'react'
import moment from 'moment'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { DatePicker, TimePicker } from 'antd'
// assets
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
// wrapper
import { extendFunc } from '@/utils/utils'
import {
  CustomInput,
  timeFormat24Hour as defaultTimeFormat,
} from '@/components'
import { control } from '@/components/Decorator'

const _dateFormat = 'YYYY-MM-DD'

const _toMoment = (value, format) => {
  if (!value) return null
  try {
    if (moment.isMoment(value)) return value
    if (moment(value, format).isValid()) return moment(value, format)
    return null
  } catch (error) {
    console.log('error', { error })
    return null
  }
}

const STYLES = (theme) => ({
  ...inputStyle(theme),
  dropdownMenu: {
    zIndex: 1410,
  },
  timePickerContainer: {
    width: '100%',
    '& > input': {
      // erase all border, and box-shadow
      border: 'none',
      boxShadow: 'none !important',
      borderRadius: 0,
      background: 'none',
      height: 'auto',
      lineHeight: '1rem',
      padding: 0,
    },
    '& .ant-time-picker-icon': {
      marginTop: -9,
    },
    '& .ant-time-picker-input': {
      fontSize: 'inherit',
    },
  },
})
@control()
class AntdTimePicker extends PureComponent {
  static defaultProps = {
    format: 'HH:mm',
    disabled: false,
    size: 'default',
  }

  constructor (props) {
    super(props)
    const { field = {}, format, value } = props

    this.state = {
      shrink: field.value !== undefined && field.value !== '',
      value:
        field.value !== undefined && field.value !== ''
          ? _toMoment(field.value, format)
          : _toMoment(value, format),
    }
  }

  componentWillReceiveProps (nextProps) {
    const { field, format } = nextProps
    if (field) {
      this.setState({
        value:
          field.value !== undefined && field.value !== ''
            ? _toMoment(field.value, format)
            : '',
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

  handleChange = (time, timeString) => {
    this.setState({
      value: time,
    })

    const { form, field, format, onChange } = this.props
    if (form && field) {
      form.setFieldValue(
        field.name,
        moment.isMoment(time) ? time.format(defaultTimeFormat) : '',
      )
    }

    if (onChange) {
      onChange(time, timeString)
    }
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      onChange,
      onFocus,
      onBlur,
      onOpenChange,
      use12Hours = true,
      minuteStep = 1,
      ...restProps
    } = this.props
    const { format, form, field, value } = restProps
    return (
      <div style={{ width: '100%' }} {...props}>
        <TimePicker
          {...restProps}
          className={classnames(classes.timePickerContainer)}
          // dropdownClassName={classnames(classes.dropdownMenu)}
          popupStyle={{ zIndex: 1400 }}
          allowClear
          placeholder=''
          format={format}
          use12Hours={use12Hours}
          minuteStep={minuteStep}
          defaultOpenValue={moment('00:00', 'HH:mm')}
          onChange={this.handleChange}
          onOpenChange={onOpenChange}
          value={_toMoment(this.state.value)}
        />
      </div>
    )
  }

  render () {
    const { classes, onChange, ...restProps } = this.props
    const { form, field, value } = restProps
    const selectValue = form && field ? field.value : value
    const labelProps = {
      shrink: !!selectValue || this.state.shrink,
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        {...restProps}
        // value={this.state.selectValue}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdDatePicker' })(AntdTimePicker)
