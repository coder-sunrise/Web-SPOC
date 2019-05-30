import React, { Component } from 'react'
// ant
import { Input } from 'antd'
import AntdWrapper from './AntdWrapper'
import { extendFunc } from '@/utils/utils'

class AntdInput extends Component {
  static defaultProps = {
    disabled: false,
    size: 'default',
  }

  shouldComponentUpdate = (nextProps) => {
    const { form, field, value } = this.props
    const { form: nextForm, field: nextField, value: nextValue } = nextProps

    const currentDateValue = form && field ? field.value : value
    const nextDateValue = nextForm && nextField ? nextField.value : nextValue

    if (form && nextForm)
      return (
        nextDateValue !== currentDateValue ||
        form.errors[field.name] !== nextForm.errors[nextField.name] ||
        form.touched[field.name] !== nextForm.touched[nextField.name]
      )
    return nextDateValue !== currentDateValue
  }

  handleValueChange = (event) => {
    const { form, field } = this.props
    let returnValue = event

    if (event) {
      returnValue = event.target ? event.target.value : event
    }

    if (form && field) {
      form.setFieldValue(
        field.name,
        returnValue === undefined ? '' : returnValue,
      )
      form.setFieldTouched(field.name, true)
    }
  }

  render () {
    const { value, form, field, onChange, onPressEnter, suffix } = this.props
    const inputValue = form && field ? field.value : value
    return (
      <AntdWrapper {...this.props}>
        <Input
          suffix={suffix}
          value={inputValue}
          onPressEnter={onPressEnter}
          onChange={extendFunc(onChange, this.handleValueChange)}
        />
      </AntdWrapper>
    )
  }
}

export default AntdInput
