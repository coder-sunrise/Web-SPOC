import React, { PureComponent } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withStyles, Radio } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonRender,
} from './utils'

// import {
//   TextField,
//   TextTypeProvider as TextTypeProviderOrg,
// } from '@/components'

const styles = (theme) => ({
  main: {},
})

let _radioSelectedMap = {}

class RadioEditorBase extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    const { gridId, row, columnName } = onComponentDidMount.call(this)

    if (!_radioSelectedMap) _radioSelectedMap = {}
    // if (row[columnName]) {
    //   // _radioSelectedMap[columnName] = row.id
    // }
    this.forceUpdate()

    // console.log('RadioEditorBase', row, _radioSelectedMap)
  }

  _onChange = (e, checked) => {
    const {
      columnExtensions,
      column: { name: columnName },
      row,
      editMode,
    } = this.props
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { checkedValue = true, uncheckedValue = false, gridId } = cfg

    if (checked) {
      _radioSelectedMap[columnName] = row.id
      _radioSelectedMap.gridId = gridId
    }

    onComponentChange.call(this, {
      value: checked ? checkedValue : uncheckedValue,
      checked,
    })

    // if (editMode) {
    //   if (checked) {
    //     _radioSelectedMap[columnName] = row.id
    //   }
    //   this.props.onBlur(e)
    // }
  }

  renderComponent = ({
    type,
    code,
    options,
    row,
    value,
    editMode,
    ...commonCfg
  }) => {
    const {
      columnExtensions,
      column: { name: columnName },
      classes,
    } = this.props

    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { checkedValue = true, uncheckedValue = false, gridId } = cfg
    if (!_radioSelectedMap) return null
    commonCfg.onChange = this._onChange

    commonCfg.checked = row[columnName] === checkedValue
    if (_radioSelectedMap[columnName]) {
      commonCfg.checked =
        _radioSelectedMap.gridId === gridId
          ? _radioSelectedMap[columnName] === row.id
          : value
    }

    return (
      <Radio
        className={classnames({
          [classes.main]: true,
        })}
        {...commonCfg}
      />
    )
  }

  render () {
    return getCommonRender.bind(this)(this.renderComponent)
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

//     if (!_radioSelectedMap) _radioSelectedMap = {}

//     // console.log(
//     //   row[columnName],
//     //   checkedValue,
//     //   _radioSelectedMap[columnName],
//     // )
//     let checked = row[columnName] === checkedValue
//     if (_radioSelectedMap[columnName]) {
//       checked = _radioSelectedMap[columnName] === row.id
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
//           if (!_radioSelectedMap[columnName])
//             _radioSelectedMap[columnName] = {}
//           if (c) {
//             _radioSelectedMap[columnName] = row.id
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

export const RadioEditor = withStyles(styles, {
  name: 'RadioEditor',
  withTheme: true,
})(RadioEditorBase)

class RadioTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.RadioEditor = (columns, text) => (editorProps) => {
      return (
        <RadioEditor
          editMode={!text}
          columnExtensions={columns}
          {...editorProps}
        />
      )
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
        editorComponent={this.RadioEditor(columnExtensions, true)}
        formatterComponent={this.RadioEditor(columnExtensions, true)}
        {...this.props}
      />
    )
  }
}

export default RadioTypeProvider
