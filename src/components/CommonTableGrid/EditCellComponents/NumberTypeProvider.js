/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
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
      ...restProps
    } = cfg

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
            row: window.$tempGridRow[gridId]
              ? window.$tempGridRow[gridId][row.id] || {}
              : row,
            error,
          })
      }
    }
    // console.log(window.$tempGridRow)
    const commonCfg = {
      noWrapper: true,
      showErrorIcon: true,
      error: this.state.error,
      defaultValue: value,
      disabled: isDisabled(
        window.$tempGridRow[gridId]
          ? window.$tempGridRow[gridId][row.id] || {}
          : row,
      ),
      currency: true,
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
      let { color = 'darkblue' } = props
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      const { type, ...restProps } = cfg

      if (color === 'darkblue' && value && `${value}`.indexOf('-') === 0)
        color = 'red'

      if (cfg && cfg.currency) {
        if (text) return numeral(value).format(currencyFormat)
        return (
          <b style={{ color }}>
            {currencySymbol}
            {numeral(value).format(currencyFormat)}
          </b>
        )
      }
      if (text) return numeral(value).format(qtyFormat)
      return <b style={{ color }}>{numeral(value).format(qtyFormat)}</b>
    },
    (prevProps, nextProps) => {
      // console.log(prevProps === nextProps, prevProps.value === nextProps.value)
      return prevProps === nextProps || prevProps.value === nextProps.value
    },
  )

class NumberTypeProvider extends PureComponent {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.NumberEditor = (ces) => (editorProps) => {
      return <NumberEditor columnExtensions={ces} {...editorProps} />
    }
  }

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
