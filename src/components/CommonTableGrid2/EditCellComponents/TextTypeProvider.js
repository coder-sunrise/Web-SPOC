/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import debounce from 'lodash/debounce'
import { TextField } from '@/components'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

const styles = (theme) => ({})

class TextEditorBase extends PureComponent {
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
      column: { name: columnName },
      value,
      onValueChange,
      columnExtensions,
      classes,
      config = {},
      row,
    } = this.props
    // const { name, value: v, ...otherInputProps } = inputProps
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    // console.log(cfg)
    const { validationSchema, isDisabled = () => false, ...restConfig } = cfg
    const submitValue = (e) => {
      this.setState({
        error: updateCellValue(this.props, this.myRef.current, e.target.value),
      })
    }
    return (
      <div ref={this.myRef}>
        <TextField
          showErrorIcon
          noWrapper
          defaultValue={value}
          onBlur={submitValue}
          disabled={isDisabled(row)}
          // onCommit={submitValue}
          // onChange={submitValue}
          error={this.state.error}
          {...restConfig}
        />
      </div>
    )
  }
}

const TextFormatter = (columnExtensions) =>
  React.memo(
    (props) => {
      const { column: { name: columnName }, value, row } = props
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      const { type, render, ...restProps } = cfg

      if (render) {
        return render(row)
      }
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
