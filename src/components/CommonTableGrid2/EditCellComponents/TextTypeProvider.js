import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import debounce from 'lodash/debounce'
import { TextField } from '@/components'

const styles = (theme) => ({})

const TextEditorBase = React.memo(
  (props) => {
    const {
      column: { name: columnName },
      value,
      onValueChange,
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
    const { errors = [], ...restConfig } = cfg
    const error = errors.find((o) => o.index === row.rowIndex) || {}
    const submitValue = (e) => {
      // console.log(e.target.value, value)
      if (value !== e.target.value) onValueChange(e.target.value)
    }
    return (
      <TextField
        showErrorIcon
        noWrapper
        defaultValue={value}
        onBlur={submitValue}
        onCommit={submitValue}
        // onChange={debounce(submitValue, 2000)}
        error={error.error}
        {...restConfig}
      />
    )
  },
  (prevProps, nextProps) => {
    // prevProps === nextProps || prevProps.value === nextProps.value
    return true
  },
)

const TextFormatter = (columnExtensions) =>
  React.memo(
    (props) => {
      const { column: { name: columnName }, value } = props
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      const { type, ...restProps } = cfg

      // console.log(props, cfg)
      if (type === 'link') {
        return <a href={cfg.link || '#'}>{value}</a>
      }
      return value || ''
    },
    (prevProps, nextProps) => {
      return prevProps === nextProps || prevProps.value === nextProps.value
    },
  )

export const TextEditor = withStyles(styles)(TextEditorBase)

class TextTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array.isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.TextEditor = (columns) => (editorProps) => {
      return <TextEditor columnExtensions={columns} {...editorProps} />
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
            'number',
            'select',
            'date',
          ].indexOf(o.type) < 0,
      )
      .map((o) => o.columnName)
    // console.log(columns)
    return (
      <DataTypeProvider
        for={columns}
        formatterComponent={TextFormatter(columnExtensions)}
        editorComponent={this.TextEditor(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default TextTypeProvider
