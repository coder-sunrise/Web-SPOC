import React, { PureComponent } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonRender,
} from './utils'

import { Checkbox } from '@/components'

const styles = (theme) => ({
  main: {},
})

class CheckboxEditorBase extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    // const { gridId, row, columnName } = onComponentDidMount.call(this)
    // if (!_checkboxSelectedMap) _checkboxSelectedMap = {}
    // if (row[columnName]) {
    //   // _checkboxSelectedMap[columnName] = row.id
    // }
    // this.forceUpdate()
    // console.log('CheckboxEditorBase', row, _checkboxSelectedMap)
  }

  componentWillUnmount () {
    // _checkboxSelectedMap = {}
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

    // if (checked) {
    //   _checkboxSelectedMap[columnName] = row.id
    // }
    // console.log(e, checked)
    onComponentChange.call(this, {
      value: e.target.value,
    })
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
    // if (!_checkboxSelectedMap) return null
    commonCfg.onChange = this._onChange

    // commonCfg.checked = row[columnName] === checkedValue
    // if (_checkboxSelectedMap[columnName]) {
    //   commonCfg.checked = _checkboxSelectedMap[columnName] === row.id
    // }

    return (
      <Checkbox
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

export const CheckboxEditor = withStyles(styles, {
  name: 'CheckboxEditor',
  withTheme: true,
})(CheckboxEditorBase)

class CheckboxTypeProvider extends React.Component {
  static propTypes = {
    for: PropTypes.array,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.CheckboxEditor = (columns, text) => (editorProps) => {
      return (
        <CheckboxEditor
          editMode={!text}
          columnExtensions={columns}
          {...editorProps}
        />
      )
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
            'checkbox',
          ].indexOf(o.type) >= 0,
      )
      .map((o) => o.columnName)
    // console.log(columns)
    return (
      <DataTypeProvider
        for={columns}
        editorComponent={this.CheckboxEditor(columnExtensions, true)}
        formatterComponent={this.CheckboxEditor(columnExtensions, true)}
        {...this.props}
      />
    )
  }
}

export default CheckboxTypeProvider
