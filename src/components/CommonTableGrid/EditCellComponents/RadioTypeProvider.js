import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles, Radio } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import debounce from 'lodash/debounce'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
} from './utils'

// import {
//   TextField,
//   TextTypeProvider as TextTypeProviderOrg,
// } from '@/components'

const styles = (theme) => ({})

const radioSelectedMap = {}

class RadioEditorBase extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    const { gridId, row, columnName } = onComponentDidMount.call(this)
    if (!radioSelectedMap[gridId]) radioSelectedMap[gridId] = {}
    if (row[columnName]) {
      radioSelectedMap[gridId][columnName] = row.id
      this.forceUpdate()
    }
  }

  _onChange = (e, checked) => {
    const { columnExtensions, column: { name: columnName }, row } = this.props

    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { checkedValue = true, uncheckedValue = false, gridId } = cfg

    if (checked) {
      radioSelectedMap[gridId][columnName] = row.id
    }

    onComponentChange.call(this, {
      value: checked ? checkedValue : uncheckedValue,
      checked,
    })
  }

  // componentDidMount () {
  //   const { columnExtensions, row, column: { name: columnName } } = this.props
  //   const cfg =
  //     columnExtensions.find(
  //       ({ columnName: currentColumnName }) => currentColumnName === columnName,
  //     ) || {}
  //   const { gridId, getRowId } = cfg
  //   const latestRow = window.$tempGridRow[gridId]
  //     ? window.$tempGridRow[gridId][getRowId(row)] || row
  //     : row
  //   updateCellValue(this.props, this.myRef.current, latestRow[columnName])
  //   this.setState({
  //     cfg,
  //     row: latestRow,
  //   })
  // }

  // _onChange = (date, moments, org) => {
  //   const {
  //     columnExtensions,
  //     column: { name: columnName },
  //     value,
  //     onValueChange,
  //     row,
  //   } = this.props

  //   const {
  //     type,
  //     code,
  //     validationSchema,
  //     isDisabled = () => false,
  //     onChange,
  //     gridId,
  //     getRowId,
  //     ...restProps
  //   } = this.state.cfg

  //   const errors = updateCellValue(this.props, this.myRef.current, date)

  //   const latestRow = window.$tempGridRow[gridId]
  //     ? window.$tempGridRow[gridId][getRowId(row)] || row
  //     : row
  //   latestRow._errors = errors
  //   const error = errors.find((o) => o.path === this.state.cfg.columnName)
  //   console.log(error, errors)
  //   if (!error) {
  //     if (onChange) {
  //       onChange(date, moments, org, latestRow)
  //     }
  //   }
  // }

  render () {
    const { columnExtensions, column: { name: columnName } } = this.props

    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { checkedValue = true, uncheckedValue = false, gridId } = cfg
    if (!radioSelectedMap[gridId]) return null
    const {
      type,
      code,
      options,
      row,
      value,
      ...commonCfg
    } = getCommonConfig.call(this)
    commonCfg.onChange = this._onChange

    let checked = row[columnName] === checkedValue
    if (checked) {
      commonCfg.checked = radioSelectedMap[gridId][columnName] === row.id
    }
    console.log(commonCfg, row, radioSelectedMap[gridId])
    return <Radio {...commonCfg} />
  }
}

// const RadioEditorBase = React.memo(
//   (props) => {
//     const {
//       column: { name: columnName },
//       value,
//       onValueChange = (f) => f,
//       columnExtensions,
//       classes,
//       config = {},
//       row,
//     } = props
//     // const { name, value: v, ...otherInputProps } = inputProps
//     const cfg =
//       columnExtensions.find(
//         ({ columnName: currentColumnName }) => currentColumnName === columnName,
//       ) || {}
//     // console.log(cfg)
//     const {
//       errors = [],
//       onRadioChange,
//       checkedValue = true,
//       uncheckedValue = false,
//       gridId,
//       isDisabled = () => false,
//       getRowId,
//       ...restConfig
//     } = cfg
//     // console.log(cfg)
//     const submitValue = (e) => {
//       if (value !== e.target.value) onValueChange(e.target.value)
//     }

//     if (!radioSelectedMap[gridId]) radioSelectedMap[gridId] = {}

//     // console.log(
//     //   row[columnName],
//     //   checkedValue,
//     //   radioSelectedMap[gridId][columnName],
//     // )
//     let checked = row[columnName] === checkedValue
//     if (radioSelectedMap[gridId][columnName]) {
//       checked = radioSelectedMap[gridId][columnName] === row.id
//     }

//     const commonCfg = {
//       disabled: isDisabled(
//         window.$tempGridRow[gridId]
//           ? window.$tempGridRow[gridId][getRowId(row)] || row
//           : row,
//       ),
//     }
//     return (
//       <Radio
//         value={value}
//         // checked={row[columnName] === checkedValue}
//         checked={checked}
//         onChange={(e, c) => {
//           // console.log(e.target, c, row)
//           if (!radioSelectedMap[gridId][columnName])
//             radioSelectedMap[gridId][columnName] = {}
//           if (c) {
//             radioSelectedMap[gridId][columnName] = row.id
//           }
//           onRadioChange(row, e.target, c)
//           onValueChange(c ? checkedValue : uncheckedValue)
//         }}
//         {...commonCfg}
//       />
//     )
//   },
//   (prevProps, nextProps) => {
//     prevProps === nextProps || prevProps.value === nextProps.value
//   },
// )

export const RadioEditor = withStyles(styles)(RadioEditorBase)

class RadioTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.RadioEditor = (columns) => (editorProps) => {
      return <RadioEditor columnExtensions={columns} {...editorProps} />
    }
  }

  // shouldComponentUpdate () {
  //   return
  //   this.props.editingRowIds !== nextProps.editingRowIds ||
  //     this.props.commitCount !== nextProps.commitCount
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
