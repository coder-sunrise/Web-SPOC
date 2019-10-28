/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isNumber } from 'util'
import numeral from 'numeral'
import { withStyles } from '@material-ui/core'

import {
  NumberInput,
  NumberTypeProvider as NumberTypeProviderOrg,
} from '@/components'

import config from '@/utils/config'
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

const { currencyFormat, qtyFormat, currencySymbol } = config

const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    textAlign: 'right',
    width: '100%',
  },
  alignRight: {
    textAlign: 'right',
  },
  inputRoot: {
    width: '100%',
  },
})

class NumberEditor extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

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

  render () {
    const { currency, type, ...commonCfg } = getCommonConfig.call(this)
    commonCfg.onChange = this._onChange
    commonCfg.currency = currency || type === 'currency'
    return (
      <div ref={this.myRef}>
        <NumberInput
          inputProps={{
            fullWidth: true,
          }}
          {...commonCfg}
        />
      </div>
    )
  }
}

const NumberFormatter = (columnExtensions) =>
  React.memo(
    (props) => {
      const {
        column: { name: columnName },
        value,
        onValueChange,
        classes,
        text = false,
      } = props
      if (value === undefined) return null
      if (!isNumber(value)) return value
      let { color = 'darkblue' } = props
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      const { type, format, ...restProps } = cfg
      if (color === 'darkblue' && value && `${value}`.indexOf('-') === 0)
        color = 'red'

      if (cfg && (cfg.currency || type === 'currency')) {
        if (text) return numeral(value).format(format || currencyFormat)
        return (
          <b style={{ color }}>
            {value >= 0 ? (
              <React.Fragment>
                {currencySymbol}
                {numeral(value).format(format || currencyFormat)}
              </React.Fragment>
            ) : (
              <React.Fragment>
                ({currencySymbol}
                {numeral(Math.abs(value)).format(format || currencyFormat)})
              </React.Fragment>
            )}
          </b>
        )
      }
      if (text) return numeral(value).format(format || qtyFormat)
      return (
        <b style={{ color }}>{numeral(value).format(format || qtyFormat)}</b>
      )
    },
    (prevProps, nextProps) => {
      // console.log(prevProps === nextProps, prevProps.value === nextProps.value)
      return prevProps === nextProps || prevProps.value === nextProps.value
    },
  )

class NumberTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.NumberEditor = (ces) => (editorProps) => {
      return <NumberEditor columnExtensions={ces} {...editorProps} />
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    this.props.editingRowIds !== nextProps.editingRowIds ||
    this.props.commitCount !== nextProps.commitCount

  render () {
    const { columnExtensions } = this.props
    return (
      <NumberTypeProviderOrg
        for={columnExtensions
          .filter(
            (o) =>
              [
                'number',
                'currency',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        formatterComponent={NumberFormatter(columnExtensions)}
        editorComponent={this.NumberEditor(columnExtensions)}
      />
    )
  }
}

export default NumberTypeProvider
