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
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || {}
      : row
    const _onChange = (event) => {
      const v = numeral(event.target.value)._value
      const error = updateCellValue(this.props, this.myRef.current, v)
      this.setState({
        error,
      })
      if (!error) {
        if (onChange)
          onChange({
            value: v,
            row: latestRow,
            error,
          })
      }
    }
    // console.log(columnName, value)
    const commonCfg = {
      simple: true,
      showErrorIcon: true,
      error: this.state.error,
      value,
      disabled: isDisabled(latestRow),
      currency: cfg && (cfg.currency || type === 'currency'),
      ...restProps,
      onChange: _onChange,
    }

    return (
      <NumberInput
        inputProps={{
          fullWidth: true,
        }}
        // classes={{ input: classes.alignRight }}
        {...commonCfg}
        {...restProps}
      />
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
