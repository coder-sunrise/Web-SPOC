import React, { PureComponent } from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import InputAdornment from '@material-ui/core/InputAdornment'
import DateRange from '@material-ui/icons/DateRange'
import Clear from '@material-ui/icons/Clear'

import CustomInput from 'mui-pro-components/CustomInput'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import classNames from 'classnames'

// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime'
import moment from 'moment'

let _dateFormat = 'DD-MM-YYYY'
const getValue = (v) => {
  if (!v) return v
  return moment.isMoment(v)
    ? v.format(_dateFormat)
    : moment(v).isValid() ? moment(v).format(_dateFormat) : v
}

const styles = (theme) => ({
  noLabel: {
    '& .rdtPicker': {
      marginTop: '-20px !important',
    },
  },
})
class DatePicker extends PureComponent {
  constructor (props) {
    super(props)
    let value = this.props.field
      ? getValue(this.props.field.value)
      : getValue(this.props.defaultValue)
    if (!value) value = ''
    // console.log(this.props.field.value, this.props.defaultValue, value)
    this.state = {
      value,
      displayValue: '',
      shrink: !!value,
    }

    const {
      inputProps,
      onChange,
      closeOnTab = true,
      disabled,
      ...restProps
    } = this.props

    const { isValidDate = (f) => f } = props

    const _onFocus = (_props, openCalendar, closeCalendar) => () => {
      this.setState(
        {
          shrink: true,
          open: true,
        },
        openCalendar,
      )
    }
    const _onBlur = (_props, openCalendar, closeCalendar) => (e) => {
      if (!_props.value) return

      let v = e.currentTarget.value
      if (moment(v, _dateFormat, true).isValid()) {
        if (!isValidDate(moment(e.currentTarget.value, _dateFormat))) {
          this.onChange(_props.value)
        }
      } else {
        this.onChange(_props.value)
      }
    }
    const _onChange = (_props, openCalendar, closeCalendar) => (e) => {
      // console.log(e)
      if (e.currentTarget.value.length > _dateFormat.length) return false
      this.setState({
        displayValue: e.currentTarget.value,
      })
      if (moment(e.currentTarget.value, _dateFormat, true).isValid()) {
        if (isValidDate(moment(e.currentTarget.value, _dateFormat))) {
          _props.onChange({
            target: { value: e.currentTarget.value },
          })
          this.onChange(e.currentTarget.value)
        }
      }

      // return false
    }
    const _onClear = (_props, openCalendar, closeCalendar) => () => {
      this.setState(
        {
          value: '',
          shrink: false,
        },
        () => {
          this.onChange('')
          _props.onChange({ target: { value: '' } })
        },
      )
    }
    this.renderInput = (realTimeProps) => (
      _props,
      openCalendar,
      closeCalendar,
    ) => {
      // console.log(this.state)
      return (
        <div
          onKeyDown={(e) => {
            if (e.which === 9 && closeOnTab) {
              this.handleClickAway()
            }
          }}
        >
          <CustomInput
            labelProps={{
              shrink:
                this.state.shrink ||
                !!this.state.value ||
                !!this.state.displayValue,
            }}
            inputProps={{
              endAdornment: !disabled && (
                <InputAdornment position='end'>
                  {this.state.value && (
                    <Clear
                      onClick={_onClear(_props, openCalendar, closeCalendar)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  <DateRange
                    onClick={_onFocus(_props, openCalendar, closeCalendar)}
                    style={{ cursor: 'pointer' }}
                  />
                </InputAdornment>
              ),
              onFocus: _onFocus(_props, openCalendar, closeCalendar),
              onBlur: _onBlur(_props, openCalendar, closeCalendar),
              onChange: _onChange(_props, openCalendar, closeCalendar),
              inputProps: {
                autoComplete: 'off',
              },
              ...inputProps,
            }}
            {...realTimeProps}
            value={this.state.displayValue}
          />
        </div>
      )
    }
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { value, field } = nextProps
    // console.log(field && field.value, preState.value)
    if (field && field.value !== preState.value) {
      return {
        value: field.value,
        shrink: !!field.value,
        displayValue: !!preState.displayValue
          ? preState.displayValue
          : getValue(field.value),
      }
    } else return null
  }

  handleClickAway = () => {
    this.setState((prevState) => ({ open: false, shrink: !!prevState.value }))
  }

  onChange = (m) => {
    const { form, field, onChange = () => {} } = this.props
    // console.log(m.toUTC().format())
    const value = getValue(m)
    let utcValue = ''
    if (moment.isMoment(m)) {
      utcValue = m.toUTC().format()
    } else if (moment(m, _dateFormat).isValid()) {
      utcValue = moment(m, _dateFormat).toUTC().format()
    }

    this.setState(
      {
        value,
        displayValue: value,
      },
      () => {
        if (form && field) form.setFieldValue(field.name, utcValue)
        onChange(value, field.name)
      },
    )
  }

  render () {
    // console.log(this.state.value)
    // console.log(this)
    const { inputProps, onChange, ...restProps } = this.props

    const {
      dateFormat,
      field,
      form,
      classes,
      defaultValue,
      ...props
    } = restProps
    // const { onChange, onBlur}=field
    // console.log(this)
    if (dateFormat) _dateFormat = dateFormat

    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <Datetime
          closeOnSelect
          dateFormat={_dateFormat}
          defaultValue={this.state.value}
          className={classNames(
            {
              // [classes.noLabel]:!props.label,
            },
          )}
          open={this.state.open}
          onChange={this.onChange}
          onBlur={(m) => {
            if (!moment(m, _dateFormat, true).isValid()) {
              this.onChange(moment())
            } else {
              if (form && field) form.setFieldTouched(field.name, true)
              if (this.state.value !== '') {
                this.setState({
                  shrink: true,
                })
              } else {
                this.setState({
                  shrink: moment.isMoment(m),
                })
              }
            }
          }}
          renderInput={this.renderInput(this.props)}
          {...props}
        />
      </ClickAwayListener>
    )
  }
}

DatePicker.propTypes = {}

export default withStyles(styles, { withTheme: true })(DatePicker)
