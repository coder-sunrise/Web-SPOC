/* eslint-disable react/no-multi-comp */
import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { withStyles, Tooltip } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { CodeSelect, Select, TextField } from '@/components'
import { checkShouldRefresh } from '@/utils/codes'

import {
  updateGlobalVariable,
  updateCellValue,
  difference,
} from '@/utils/utils'

class SelectEditor extends Component {
  state = {
    error: false,
  }

  constructor (props) {
    // console.log('constructor', props)
    super(props)
    this.myRef = React.createRef()
  }

  // componentWillMount () {
  //   console.log({ 't-1': window.$tempGridRow })
  // }

  componentDidMount () {
    const { columnExtensions, row, column: { name: columnName } } = this.props
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { gridId, getRowId } = cfg
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row
    this.setState({
      error: updateCellValue(
        this.props,
        this.myRef.current,
        latestRow[columnName],
      ),
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    // console.log(nextProps, nextState)
    // console.log(this.props, this.state)
    return true
  }

  // componentWillUnmount () {
  //   console.log('unmount')
  // }

  _onChange = (val, option) => {
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
      getRowId,
      ...restProps
    } = cfg

    const error = updateCellValue(this.props, this.myRef.current, val)
    if (error !== this.state.error)
      this.setState({
        error,
      })
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row
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

  render () {
    const {
      columnExtensions,
      column: { name: columnName },
      value,
      onValueChange,
      row,
      codes,
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
      options,
      getRowId,
      ...restProps
    } = cfg
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row
    console.log(columnName)
    // console.log(row, row.id, latestRow, latestRow[columnName], columnName)
    // const _onChange = (val, option) => {
    //   // console.log({ val, option })
    //   const error = updateCellValue(this.props, this.myRef.current, val)
    //   this.setState({
    //     error,
    //   })
    //   if (!error) {
    //     if (onChange)
    //       onChange({
    //         val,
    //         option,
    //         row: latestRow,
    //         onValueChange,
    //         error,
    //       })
    //   }
    // }
    // console.log(window.$tempGridRow, row, latestRow[columnName])
    // console.log(options, this.state, codes, columnName)
    const commonCfg = {
      simple: true,
      showErrorIcon: true,
      error: this.state.error,
      value: latestRow[columnName],
      disabled: isDisabled(latestRow),
      options:
        typeof options === 'function'
          ? options(latestRow)
          : options || codes[`${columnName}Option`] || [],
      ...restProps,
      onChange: this._onChange,
    }
    // console.log(commonCfg)
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
    return <TextField value={value} simple />
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
    (typeof cfg.options === 'function'
      ? cfg.options(row)
      : cfg.options || state[`${columnName}Option`] || []).find(
      (o) => o.value === value || o.id === value,
    ) || {}

  const { labelField = 'name', render } = cfg
  const label = Object.byString(v, labelField)
  const vEl = v ? (
    <Tooltip title={label} enterDelay={1500}>
      <span style={{ color: v.color || 'inherit' }}>{label}</span>
    </Tooltip>
  ) : (
    ''
  )

  if (render) return render(row)

  return vEl
}

@connect(({ codetable }) => ({ codetable }))
class SelectTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    // console.log('SelectTypeProvider constructor')
    super(props)

    const { columnExtensions, codetable, dispatch } = this.props
    const colFor = columnExtensions.filter(
      (o) =>
        [
          'select',
          'codeSelect',
        ].indexOf(o.type) >= 0,
    )
    colFor.forEach((o) => {
      let { columnName, type, valueField, labelField } = o
      if (!valueField) {
        if (type === 'codeSelect') {
          valueField = 'id'
        } else {
          valueField = 'value'
        }
      }
      if (!labelField) {
        labelField = 'name'
      }
      // console.log(labelField)
      o.compare = (a, b) => {
        const codes = this.state[`${columnName}Option`]
        const aa = codes.find((m) => m[valueField] === a)
        const bb = codes.find((m) => m[valueField] === b)
        // console.log(aa, bb)
        // console.log(aa ? aa[labelField] : a, bb ? bb[labelField] : b)
        // eslint-disable-next-line no-nested-ternary
        return (aa ? aa[labelField] : a || '') > (bb ? bb[labelField] : b || '')
          ? 1
          : -1
      }
    })

    const payload = {
      codeLoaded: 0,
    }
    for (let i = 0; i < colFor.length; i++) {
      const f = colFor[i]
      if (f.code) {
        const isExisted = codetable[f.code.toLowerCase()]

        if (isExisted) {
          payload[`${f.columnName}Option`] = codetable[f.code.toLowerCase()]
          payload.codeLoaded += 1
        } else {
          dispatch({
            type: 'codetable/fetchCodes',
            payload: {
              code: f.code.toLowerCase(),
            },
          }).then((response) => {
            if (response) {
              this.setState((prevState) => {
                return {
                  [`${f.columnName}Option`]: response,
                  codeLoaded: ++prevState.codeLoaded,
                }
              })
            }
          })
        }
      }
    }
    this.state = {
      for: colFor,
      ...payload,
    }
    this.SelectEditor = (ces) => (editorProps) => {
      // console.log(ces, editorProps)
      return (
        <SelectEditor
          columnExtensions={ces}
          {...editorProps}
          codes={this.state}
        />
      )
    }
  }

  // componentDidMount () {

  // }

  shouldComponentUpdate = (nextProps, nextState) => {
    // console.log(nextProps, this.props)
    // console.log(nextState, this.state)

    return (
      // optionsUpdate ||
      this.props.editingRowIds !== nextProps.editingRowIds ||
      Object.keys(this.state).length !== Object.keys(nextState).length ||
      this.state.codeLoaded !== nextState.codeLoaded ||
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
