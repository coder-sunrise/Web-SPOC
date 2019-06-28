/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import {
  MUISelect,
  MUICodeSelect,
  CodeSelect,
  Select,
  TextField,
} from '@/components'
import { getCodes } from '@/utils/codes'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

class SelectEditor extends PureComponent {
  state = {
    error: false,
  }

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    this.setState({
      error: updateCellValue(this.props, this.myRef.current, this.props.value),
    })
  }

  render () {
    const {
      columnExtensions,
      column: { name: columnName },
      value,
      onValueChange,
      row,
    } = this.props
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const {
      type,
      code,
      validationSchema,
      isDisabled = () => false,
      ...restProps
    } = cfg

    const onChange = (val) => {
      this.setState({
        error: updateCellValue(this.props, this.myRef.current, val),
      })
    }

    const commonCfg = {
      noWrapper: true,
      showErrorIcon: true,
      error: this.state.error,
      onChange,
      defaultValue: value,
      label: 'Mr',
      disabled: isDisabled(row),
      ...restProps,
    }

    if (columnName) {
      if (type === 'select') {
        return (
          <div ref={this.myRef}>
            <Select {...commonCfg} />
          </div>
        )
      }
      if (type === 'codeSelect') {
        return (
          <div ref={this.myRef}>
            <CodeSelect {...commonCfg} code={code} />
          </div>
        )
      }
      return null
    }
    return <TextField value={value} noWrapper />
  }
}

const SelectDisplay = (columnExtensions, state) => ({
  value,
  column: { name: columnName },
  ...restProps
}) => {
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}

  if (!value) return ''

  const v = (cfg.options || state[`${columnName}Option`] || [])
    .find((o) => o.value === value || o.id === value)
  if (v.color) {
    return (
      <div>
        <span
          style={{
            height: '0.8rem',
            width: '1.5rem',
            borderRadius: '20%',
            display: 'inline-block',
            marginRight: 10,
            backgroundColor: v.colorValue,
          }}
        />
        <span>{v ? v.name : ''}</span>
      </div>
    )
  }
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

    this.SelectEditor = (ces) => (editorProps) => {
      return <SelectEditor columnExtensions={ces} {...editorProps} />
    }
  }

  render () {
    // console.log('texttypeprovider', this.props)
    const { columnExtensions } = this.props
    return (
      <DataTypeProvider
        for={this.state.for.map((o) => o.columnName)}
        editorComponent={this.SelectEditor(columnExtensions)}
        formatterComponent={SelectDisplay(columnExtensions, this.state)}
      />
    )
  }
}

export default SelectTypeProvider
