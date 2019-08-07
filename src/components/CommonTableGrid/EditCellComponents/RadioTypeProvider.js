import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles, Radio } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import debounce from 'lodash/debounce'

// import {
//   TextField,
//   TextTypeProvider as TextTypeProviderOrg,
// } from '@/components'

const styles = (theme) => ({})

const radioSelectedMap = {}

const RadioEditorBase = React.memo(
  (props) => {
    const {
      column: { name: columnName },
      value,
      onValueChange = (f) => f,
      columnExtensions,
      classes,
      config = {},
      row,
    } = props
    // const { name, value: v, ...otherInputProps } = inputProps
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    // console.log(cfg)
    const {
      errors = [],
      onRadioChange,
      checkedValue = true,
      uncheckedValue = false,
      gridId,
      isDisabled = () => false,
      ...restConfig
    } = cfg
    // console.log(cfg)
    const error = errors.find((o) => o.index === row.rowIndex) || {}
    const submitValue = (e) => {
      if (value !== e.target.value) onValueChange(e.target.value)
    }

    if (!radioSelectedMap[gridId]) radioSelectedMap[gridId] = {}

    // console.log(
    //   row[columnName],
    //   checkedValue,
    //   radioSelectedMap[gridId][columnName],
    // )
    let checked = row[columnName] === checkedValue
    if (radioSelectedMap[gridId][columnName]) {
      checked = radioSelectedMap[gridId][columnName] === row.id
    }

    const commonCfg = {
      disabled: isDisabled(
        window.$tempGridRow[gridId]
          ? window.$tempGridRow[gridId][row.id] || {}
          : row,
      ),
    }
    return (
      <Radio
        value={value}
        // checked={row[columnName] === checkedValue}
        checked={checked}
        onChange={(e, c) => {
          // console.log(e.target, c, row)
          if (!radioSelectedMap[gridId][columnName])
            radioSelectedMap[gridId][columnName] = {}
          if (c) {
            radioSelectedMap[gridId][columnName] = row.id
          }
          onRadioChange(row, e.target, c)
          onValueChange(c ? checkedValue : uncheckedValue)
        }}
        {...commonCfg}
      />
    )
  },
  (prevProps, nextProps) => {
    prevProps === nextProps || prevProps.value === nextProps.value
  },
)

export const RadioEditor = withStyles(styles)(RadioEditorBase)

class RadioTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array.isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.RadioEditor = (columns) => (editorProps) => {
      return <RadioEditor columnExtensions={columns} {...editorProps} />
    }
  }

  // shouldComponentUpdate () {
  //   return false
  // }

  render () {
    const { columnExtensions } = this.props
    // console.log(this.props)
    const columns = columnExtensions
      .filter(
        (o) =>
          [
            'radio',
          ].indexOf(o.type) >= 0,
      )
      .map((o) => o.columnName)
    // console.log(columns)
    return (
      <DataTypeProvider
        for={columns}
        editorComponent={this.RadioEditor(columnExtensions)}
        formatterComponent={this.RadioEditor(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default RadioTypeProvider
