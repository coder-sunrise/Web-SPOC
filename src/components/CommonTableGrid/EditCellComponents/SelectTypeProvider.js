/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
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
      onChange,
      gridId,
      ...restProps
    } = cfg

    const _onChange = (val, option) => {
      const error = updateCellValue(this.props, this.myRef.current, val)
      this.setState({
        error,
      })

      if (onChange)
        onChange({
          val,
          option,
          row,
          onValueChange,
          error,
        })
    }
    // console.log(window.$tempGridRow)
    const commonCfg = {
      noWrapper: true,
      showErrorIcon: true,
      error: this.state.error,
      defaultValue: value,
      disabled: isDisabled(
        window.$tempGridRow[gridId] ? window.$tempGridRow[gridId][row.id] : row,
      ),
      ...restProps,
      onChange: _onChange,
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

  if (value === undefined) return ''
  const v =
    (cfg.options || state[`${columnName}Option`] || [])
      .find((o) => o.value === value || o.id === value) || {}
  // console.log(cfg)
  const { labelField = 'name' } = cfg
  // console.log(v, labelField)
  const vEl = v ? (
    <Tooltip title={v[labelField]} enterDelay={1500}>
      <span>{v[labelField]}</span>
    </Tooltip>
  ) : (
    ''
  )
  if (v.colorValue) {
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
        {vEl}
      </div>
    )
  }
  if (v.color) {
    return (
      <div
        style={{
          color: v.color,
        }}
      >
        {vEl}
      </div>
    )
  }
  return vEl
}

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
        getCodes(f.code).then((o) => {
          // console.log(o)
          this.setState((prevState) => ({
            [`${f.columnName}Option`]: o,
            codeLoaded: ++prevState.codeLoaded,
          }))
        })
      }
    })

    this.SelectEditor = (ces) => (editorProps) => {
      return <SelectEditor columnExtensions={ces} {...editorProps} />
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // console.log(nextProps, this.props)
    // console.log(nextState, this.state)

    return (
      this.props.editingRowIds !== nextProps.editingRowIds ||
      Object.keys(this.state).length !== Object.keys(nextState).length ||
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
