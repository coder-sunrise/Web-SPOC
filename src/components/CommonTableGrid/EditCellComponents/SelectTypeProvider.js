import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { Select, TextField } from '@/components'

const SelectEditor = (props) => {
  const {
    column: { name: columnName },
    value,
    onValueChange,
    columnExtensions,
    source = {},
  } = props
  // const { name, value: v, ...otherInputProps } = inputProps
  const disabled = columnExtensions.some(
    ({ editingEnabled, columnName: currentColumnName }) =>
      currentColumnName === columnName && editingEnabled === false,
  )
  // console.log(source[columnName])
  if (columnName) {
    return (
      <Select
        noWrapper
        disabled={disabled}
        {...source[columnName]}
        onChange={(option) => {
          if (option.target) onValueChange(option.target.value)
        }}
        // onChange={(e) => {
        //   args.field.onChange({
        //     target: {
        //       value: e.target.value,
        //       name: args.field.name,
        //     },
        //   })
        //   // if (otherInputProps.onChange) otherInputProps.onChange(e)
        // }}
        defaultValue={value}
      />
    )
  }
  return <TextField value={value} noWrapper />
}

class SelectTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array.isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { source, columnExtensions } = this.props
    this.SelectEditor = ({ ...editorProps }) => (
      <SelectEditor
        columnExtensions={columnExtensions}
        source={source}
        {...editorProps}
      />
    )
    this.SelectDisplay = ({ value, column: { name: columnName } }) => {
      const v = source[columnName].options.find((o) => o.value === value)
      return <span>{v ? v.name : ''}</span>
    }
  }

  render () {
    // console.log('texttypeprovider', this.props)
    const { for: dtpFor } = this.props
    return (
      <DataTypeProvider
        for={dtpFor}
        editorComponent={this.SelectEditor}
        formatterComponent={this.SelectDisplay}
      />
    )
  }
}

export default SelectTypeProvider
