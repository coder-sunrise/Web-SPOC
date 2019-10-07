/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles, Tooltip } from '@material-ui/core'
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
    const {
      validationSchema,
      isDisabled = () => false,
      onChange,
      gridId,
      editRender,
      ...restConfig
    } = cfg

    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][row.id] || {}
      : row
    if (editRender) {
      return editRender(row)
    }
    console.log(latestRow)
    const submitValue = (e) => {
      const error = updateCellValue(
        this.props,
        this.myRef.current,
        e.target.value,
      )
      this.setState({
        error,
      })
      if (!error) {
        if (onChange) onChange(e.target.value, latestRow)
      }
    }
    const commonCfg = {
      disabled: isDisabled(latestRow),
    }
    return (
      <div ref={this.myRef}>
        <TextField
          showErrorIcon
          simple
          value={latestRow[columnName]}
          onChange={submitValue}
          // onCommit={submitValue}
          // onChange={submitValue}
          error={this.state.error}
          {...commonCfg}
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
      const { type, render, onClick, ...restProps } = cfg
      if (render) {
        return render(row)
      }
      // console.log(props, cfg)
      if (type === 'link') {
        return (
          <Tooltip title={value} enterDelay={1500}>
            <a
              onClick={(e) => {
                e.preventDefault()
                if (onClick) onClick(row)
              }}
              href={cfg.link || '#'}
            >
              {value}
            </a>
          </Tooltip>
        )
      }
      return (
        (
          <Tooltip title={value} enterDelay={1500}>
            <span>{value}</span>
          </Tooltip>
        ) || ''
      )
    },
    (prevProps, nextProps) => {
      const { column: { name: columnName }, value, row } = nextProps
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      return (
        (prevProps === nextProps || prevProps.value === nextProps.value) &&
        typeof cfg.render !== 'function'
      )
    },
  )

export const TextEditor = withStyles(styles)(TextEditorBase)

class TextTypeProvider extends React.Component {
  static propTypes = {
    for: PropTypes.array, // .isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.TextEditor = (columns) => (editorProps) => {
      return <TextEditor columnExtensions={columns} {...editorProps} />
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    this.props.editingRowIds !== nextProps.editingRowIds ||
    this.props.commitCount !== nextProps.commitCount

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
      // .filter(
      //   (o) =>
      //     [
      //       'rowSort',
      //     ].indexOf(o.columnName) < 0,
      // )
      .map((o) => o.columnName)
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
