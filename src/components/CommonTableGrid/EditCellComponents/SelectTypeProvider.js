/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { withStyles, Tooltip } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import {
  MUISelect,
  MUICodeSelect,
  CodeSelect,
  Select,
  TextField,
} from '@/components'
import { getCodes } from '@/utils/codes'
import {
  updateGlobalVariable,
  updateCellValue,
  difference,
} from '@/utils/utils'

class SelectEditor extends PureComponent {
  state = {
    error: false,
  }

  constructor (props) {
    // console.log('constructor', props)
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    const { columnExtensions, row, column: { name: columnName } } = this.props
    // console.log('componentDidMount', columnName)
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { gridId } = cfg
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][row.id] || {}
      : row
    // console.log(
    //   columnName,
    //   latestRow,
    //   latestRow[columnName],
    //   window.$tempGridRow,
    //   gridId,
    // )
    this.setState({
      error: updateCellValue(
        this.props,
        this.myRef.current,
        latestRow[columnName],
      ),
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
      onChange,
      gridId,
      ...restProps
    } = cfg
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][row.id] || {}
      : row
    // console.log(row, row.id, latestRow, latestRow[columnName], columnName)

    const _onChange = (val, option) => {
      // console.log(val, option)
      const error = updateCellValue(this.props, this.myRef.current, val)
      this.setState({
        error,
      })
      if (!error) {
        if (onChange)
          onChange({
            val,
            option,
            row: latestRow,
            onValueChange,
            error,
          })
      }
    }
    // console.log(window.$tempGridRow, row, latestRow[columnName])
    const commonCfg = {
      noWrapper: true,
      showErrorIcon: true,
      error: this.state.error,
      value: latestRow[columnName],
      disabled: isDisabled(latestRow),
      ...restProps,
      onChange: _onChange,
    }
    // console.log(columnName)
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
  row,
  ...restProps
}) => {
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}

  if (value === undefined) return ''
  const v =
    (cfg.options || state[`${columnName}Option`] || [])
      .find((o) => o.value === value || o.id === value) || {}

  const { labelField = 'name', render } = cfg
  const label = Object.byString(v, labelField)

  const vEl = v ? (
    <Tooltip title={label} enterDelay={1500}>
      <span>{label}</span>
    </Tooltip>
  ) : (
    ''
  )

  if (render) return render(row)

  return vEl
}

@connect(() => ({}))
class SelectTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    // console.log('SelectTypeProvider constructor')
    super(props)
    const { columnExtensions } = this.props
    const colFor = columnExtensions.filter(
      (o) =>
        [
          'select',
          'codeSelect',
        ].indexOf(o.type) >= 0,
    )

    this.state = {
      for: colFor || [],
      codeLoaded: 0,
    }
    // console.log(props)

    colFor.forEach((f) => {
      if (f.code) {
        this.props
          .dispatch({
            type: 'codetable/fetchCodes',
            payload: {
              code: f.code,
            },
          })
          .then((response) => {
            if (response) {
              this.setState((prevState) => ({
                [`${f.columnName}Option`]: response,
                codeLoaded: ++prevState.codeLoaded,
              }))
            }
          })
        // getCodes(f.code).then((o) => {
        //   this.setState((prevState) => ({
        //     [`${f.columnName}Option`]: o,
        //     codeLoaded: ++prevState.codeLoaded,
        //   }))
        // })
      }
    })

    this.SelectEditor = (ces) => (editorProps) => {
      return <SelectEditor columnExtensions={ces} {...editorProps} />
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // console.log(nextProps, this.props)
    // console.log(nextState, this.state)

    // check if new column extensions has new options
    const { columnExtensions: nextColExt } = nextProps
    const { columnExtensions: thisColExt } = this.props
    const nextColFor = nextColExt.filter(
      (o) =>
        [
          'select',
          'codeSelect',
        ].indexOf(o.type) >= 0,
    )
    const thisColFor = thisColExt.filter(
      (o) =>
        [
          'select',
          'codeSelect',
        ].indexOf(o.type) >= 0,
    )

    let optionsUpdate = false
    nextColFor.forEach((column) => {
      const oldColumn = thisColFor.find(
        (col) => col.columnName === column.columnName,
      )
      if (
        oldColumn &&
        Object.keys(column).length !== Object.keys(oldColumn).length
      )
        optionsUpdate = true
    })

    return (
      optionsUpdate ||
      this.props.editingRowIds !== nextProps.editingRowIds ||
      Object.keys(this.state).length !== Object.keys(nextState).length ||
      // this.state.codeLoaded !== nextState.codeLoaded ||
      this.props.commitCount !== nextProps.commitCount
    )
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
