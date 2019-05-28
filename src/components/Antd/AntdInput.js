import React from 'react'
// ant
import { Input } from 'antd'
import AntdWrapper from './AntdWrapper'
import { extendFunc } from '@/utils/utils'

class AntdInput extends React.PureComponent {
  static defaultProps = {
    disabled: false,
    size: 'default',
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
    const { value, form, field, onChange, onPressEnter } = this.props
    const inputValue = form && field ? field.value : value
    return (
      <AntdWrapper {...this.props}>
        <Input
          value={inputValue}
          onPressEnter={onPressEnter}
          onChange={extendFunc(onChange, this.handleValueChange)}
        />
      </AntdWrapper>
    )
  }
}

export default AntdInput
