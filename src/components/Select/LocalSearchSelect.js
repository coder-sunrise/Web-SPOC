import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@/components'
import Select from '../Antd/AntdSelect'

class LocalSearchSelect extends React.PureComponent {
  constructor(props) {
    super(props)
    let defaultOptions = []
    const { isFromTable, value, valueField = 'id' } = props
    if (isFromTable && value) {
      defaultOptions = props.options.filter(x => x[valueField] === props.value)
    }
    this.state = { filterOptions: defaultOptions }
  }

  onSearch = v => {
    const { setFieldValue, matchSearch = () => true } = this.props
    if (v === undefined || v === null || !v.trim().length) {
      this.setState({ filterOptions: [] })
      return
    }
    const { options = [] } = this.props

    const currentOptions = _.take(
      options.filter(m => matchSearch(m, v)),
      20,
    )
    this.setState({ filterOptions: currentOptions })
  }

  onChange = (v, op) => {
    const { onChange = () => {} } = this.props
    if (v) {
      this.setState({ filterOptions: [{ ...op }] })
    } else {
      this.setState({ filterOptions: [] })
    }
    onChange(v, op)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isFromTable = false, options = [], valueField = 'id' } = nextProps
    if (!isFromTable) {
      if (nextProps.field?.value) {
        this.setState({
          filterOptions: options.filter(
            x => x[valueField] === nextProps.field.value,
          ),
        })
      } else {
        this.setState({ filterOptions: [] })
      }
    }
  }
  render() {
    const { filterOptions } = this.state
    const { valueField = 'id' } = this.props
    return (
      <Select
        {...this.props}
        valueField={valueField}
        onChange={this.onChange}
        options={filterOptions}
        onSearch={this.onSearch}
      />
    )
  }
}

LocalSearchSelect.propTypes = {}

export default LocalSearchSelect
