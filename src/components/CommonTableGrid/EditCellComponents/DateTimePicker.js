import React, { PureComponent } from 'react'
import moment from 'moment'
import DateTime from 'react-datetime'
import { DateRange, Clear } from '@material-ui/icons'
import { InputAdornment, withStyles } from '@material-ui/core'
import classNames from 'classnames'

import { CustomInput } from '@/components'

const styles = (theme) => ({
  noLabel: {
    '& .rdtPicker': {
      marginTop: '-20px !important',
    },
  },
  sticky: {
    '& .rdt': {
      position: 'unset !important',
    },
    '& rdtPicker': {
      top: '-65px !important',
    },
  },
})

// temporary for datetime picker component
const _dateFormat = 'DD-MM-YYYY'

const getValue = (v) => {
  return moment.isMoment(v) ? v.format(_dateFormat) : v
}

class DateTimePicker extends PureComponent {
  state = {
    shrink: false,
    value: '',
  }

  render () {
    const { classes, label, inputProps, ...restProps } = this.props
    const { value, shrink } = this.state
    return (
      <div style={{}}>
        <DateTime
          dateFormat={_dateFormat}
          defaultValue={value}
          className={classNames({
            [classes.noLabel]: !label,
            [classes.sticky]: true,
          })}
          onChange={(m) => {
            this.setState({
              value: getValue(m),
            })
          }}
          onBlur={(m) => {
            if (value) {
              this.setState({
                shrink: true,
              })
            } else {
              this.setState({
                shrink: moment.isMoment(m),
              })
            }
          }}
          renderInput={(_props, openCalendar, closeCalendar) => {
            const onFocus = () => {
              this.setState(
                {
                  shrink: true,
                },
                openCalendar,
              )
            }
            return (
              <div>
                <CustomInput
                  labelProps={{
                    shrink,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {/*
                        value && (
                        <Clear
                          onClick={() => {
                            this.setState(
                              {
                                value: '',
                                shrink: false,
                              },
                              () => _props.onChange({ target: { value: '' } }),
                            )
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        )
                      */}
                        <DateRange
                          onClick={onFocus}
                          style={{ cursor: 'pointer' }}
                        />
                      </InputAdornment>
                    ),
                    onFocus,
                    onChange: (e) => {
                      _props.onChange({
                        target: { value: getValue(e.currentTarget.value) },
                      })
                    },
                    ...inputProps,
                  }}
                  value={value}
                  {...restProps}
                />
              </div>
            )
          }}
          {...restProps}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DateTimePicker)
