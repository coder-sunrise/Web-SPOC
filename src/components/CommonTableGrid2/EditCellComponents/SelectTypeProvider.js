import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { Select, CodeSelect, TextField } from '@/components'
import { getCodes } from '@/utils/codes'

const SelectEditor = (columnExtensions) =>
  React.memo((props) => {
    const { column: { name: columnName }, value, onValueChange, row } = props
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { type, code, errors = [], ...restProps } = cfg
    const error = errors.find((o) => o.index === row.rowIndex) || {}
    // console.log(cfg, value, props)
    const onChange = (option) => {
      onValueChange(option.target ? option.target.value : '')
    }
    const commonCfg = {
      noWrapper: true,
      showErrorIcon: true,
      error: error.error,
      onChange,
      defaultValue: value,
      ...restProps,
    }
    // console.log(error)
    if (columnName) {
      if (type === 'select') {
        return <Select {...commonCfg} />
      }
      if (type === 'codeSelect') {
        return <CodeSelect {...commonCfg} code={code} />
      }
      return null
    }
    return <TextField value={value} noWrapper />
  }, (prevProps, nextProps) => prevProps === nextProps || prevProps.value === nextProps.value || prevProps.error === nextProps.error)

const SelectDisplay = (columnExtensions, state) => ({
  value,
  column: { name: columnName },
  ...restProps
}) => {
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  // console.log(cfg, restProps, state)

  // console.log(value, columnName, restProps)
  const v = (cfg.options || state[`${columnName}Option`] || [])
    .find((o) => o.value === value || o.id === value)
  return <span>{v ? v.name : ''}</span>
}

class SelectTypeProvider extends PureComponent {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { salutationFk, config = {}, columnExtensions } = this.props
    const colFor = columnExtensions.filter(
      (o) =>
        [
          'select',
          'codeSelect',
        ].indexOf(o.type) >= 0,
    )

    this.state = {
      for: colFor || [],
    }
    // console.log(props)
    colFor.forEach((f) => {
      if (f.code) {
        getCodes(f.code).then((o) => {
          // console.log(o)
          this.setState({
            [`${f.columnName}Option`]: o,
          })
        })
      }
    })
  }

  render () {
    // console.log('texttypeprovider', this.props)
    const { columnExtensions } = this.props
    return (
      <DataTypeProvider
        for={this.state.for.map((o) => o.columnName)}
        editorComponent={SelectEditor(columnExtensions)}
        formatterComponent={SelectDisplay(columnExtensions, this.state)}
      />
    )
  }
}

export default SelectTypeProvider
