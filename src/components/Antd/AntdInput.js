import React from 'react'
// ant
import { Input } from 'antd'
import AntdWrapper from './AntdWrapper'

class AntdInput extends React.PureComponent {
  static defaultProps = {
    disabled: false,
    size: 'default',
  }

  render () {
    const { value, form, field } = this.props
    const inputValue = form && field ? field.value : value
    return (
      <AntdWrapper {...this.props}>
        <Input value={inputValue} />
      </AntdWrapper>
    )
  }
}

export default AntdInput
