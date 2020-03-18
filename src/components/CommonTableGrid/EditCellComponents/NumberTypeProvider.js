/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isNumber } from 'util'
import numeral from 'numeral'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

import { NumberInput } from '@/components'

import config from '@/utils/config'
import {
  updateGlobalVariable,
  updateCellValue,
  difference,
} from '@/utils/utils'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonRender,
} from './utils'

// const { currencyFormat, qtyFormat, currencySymbol } = config

// const styles = (theme) => ({
//   root: {
//     paddingRight: theme.spacing.unit,
//     paddingLeft: theme.spacing.unit,
//     textAlign: 'right',
//     width: '100%',
//   },
//   alignRight: {
//     textAlign: 'right',
//   },
//   inputRoot: {
//     width: '100%',
//   },
// })

class NumberEditor extends PureComponent {
  state = {}

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  _onChange = (e) => {
    onComponentChange.call(this, {
      value:
        e.target.value === undefined
          ? undefined
          : numeral(e.target.value)._value,
    })
  }

  renderComponent = ({ currency, type, editMode, value, ...commonCfg }) => {
    if (editMode) {
      commonCfg.onChange = this._onChange
      commonCfg.onBlur = this.props.onBlur
      commonCfg.onFocus = this.props.onFocus
      commonCfg.onKeyDown = this.props.onKeyDown
      commonCfg.autoFocus = true
      commonCfg.debounceDuration = 0
      commonCfg.preventDefaultKeyDownEvent = true
      // commonCfg.inputProps={{
      //   fullWidth: true,
      // }}
    }
    if (commonCfg.text) {
      // commonCfg.rightAlign = true
      commonCfg.style = {
        display: 'inline-block',
      }
    }
    commonCfg.defaultValue = value

    commonCfg.currency = currency || type === 'currency'
    return <NumberInput {...commonCfg} />
  }

  render () {
    return getCommonRender.bind(this)(this.renderComponent)
  }
}

class NumberTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.NumberEditor = (ces, text) => (editorProps) => {
      return (
        <NumberEditor
          editMode={!text}
          columnExtensions={ces}
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
    return (
      <DataTypeProvider
        for={columnExtensions
          .filter(
            (o) =>
              [
                'number',
                'currency',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        formatterComponent={this.NumberEditor(columnExtensions, true)}
        editorComponent={this.NumberEditor(columnExtensions)}
      />
    )
  }
}

export default NumberTypeProvider
