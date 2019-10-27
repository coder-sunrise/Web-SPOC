/* eslint-disable react/no-multi-comp */
import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
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

import {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
} from './utils'

class SelectEditor extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  _onChange = (val, option) => {
    onComponentChange.call(this, { val, option })
  }

  render () {
    const { codes } = this.props
    const {
      type,
      code,
      columnName,
      options,
      row,
      ...commonCfg
    } = getCommonConfig.call(this)
    commonCfg.onChange = this._onChange
    commonCfg.options =
      typeof options === 'function'
        ? options(row)
        : options || codes[`${columnName}Option`] || []

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
    return <TextField value={commonCfg.value} simple />
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
      // this.props.editingRowIds !== nextProps.editingRowIds ||
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
