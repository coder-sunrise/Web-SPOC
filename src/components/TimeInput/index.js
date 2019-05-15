import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// material ui
import { InputAdornment, withStyles, Tooltip } from '@material-ui/core'
import { Error } from '@material-ui/icons'
// cleave js
import Cleave from 'cleave.js/react'
// custom component
import BaseInput from './BaseInput'

const styles = () => ({})

const stylesConfig = { withTheme: true, name: 'TimeInput' }

const ErrorIcon = (errorMessage = '') => (
  <InputAdornment position='end'>
    <Tooltip title={errorMessage}>
      <Error color='error' style={{ cursor: 'pointer' }} />
    </Tooltip>
  </InputAdornment>
)

class TimeInput extends PureComponent {
  static defaultProps = {
    label: 'Timing',
  }

  state = {
    defaultValue: '00:00:00',
    value: '',
  }

  onChange = (event) => {
    const { target } = event
    const { onChange, form, field } = this.props

    const formatValue = target.value === '' ? '' : parseInt(target.value, 10)
    const newEvent = { target: { value: formatValue } }
    if (onChange) {
      onChange(newEvent)
    }

    field &&
      field.onChange &&
      field.onChange(
        {
          target: {
            value: formatValue,
            name: field.name,
          },
        },
        this.props,
      )
  }

  _onBlur = (event) => {
    const { field } = this.props
    field && field.onBlur(event)
  }

  CleaveComponent = (props) => {
    return (
      <Cleave
        options={{
          time: true,
          timePattern: [
            'h',
            'm',
          ],
        }}
      />
    )
  }

  render () {
    const {
      field,
      form,
      value,
      showErrorIcon,
      onChange,
      label,
      labelProps,
      ...restProps
    } = this.props

    const hasError =
      form && field ? form.errors[field.name] !== undefined : false
    const helpText = hasError ? form.errors[field.name] : ''

    let inputProps = {
      value: field ? field.value : value,
      name: field ? field.name : '',
    }

    if (hasError && showErrorIcon) {
      inputProps = {
        ...inputProps,
        endAdornment: (
          <ErrorIcon key={`${field.name}-errorIcon`} errorMessage={helpText} />
        ),
      }
    }

    return (
      <BaseInput
        formControlProps={{
          fullWidth: true,
        }}
        inputProps={{
          ...inputProps,
          inputComponent: this.CleaveComponent,
          onBlur: this._onBlur,
          onChange: this.onChange,
        }}
        error={hasError}
        helpText={helpText}
        labelText={label}
      />
    )
  }
}

export default withStyles(styles, stylesConfig)(TimeInput)
