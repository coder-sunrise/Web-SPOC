import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import { withStyles } from '@material-ui/core'

import {
  NumberInput,
  NumberTypeProvider as NumberTypeProviderOrg,
} from '@/components'

import config from '@/utils/config'

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

const numberOnChangeFormatter = (onChangeEvent) => (value) =>
  onChangeEvent(numeral(value)._value)

const NumberEditorBase = (columnExtensions) => (props) => {
  const {
    column: { name: columnName },
    value,
    onValueChange,
    classes,
    row,
  } = props
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const { type, isDisabled = () => false, gridId, ...restProps } = cfg

  const commonCfg = {
    disabled: isDisabled(
      window.$tempGridRow[gridId]
        ? window.$tempGridRow[gridId][row.id] || {}
        : row,
    ),
  }
  return (
    <NumberInput
      inputProps={{
        fullWidth: true,
      }}
      classes={{ input: classes.alignRight }}
      defaultValue={value}
      onChange={(event) => {
        // console.log(event)
        numberOnChangeFormatter(onValueChange)(event.target.value)
      }}
      currency
      noWrapper
      {...commonCfg}
      {...restProps}
    />
  )
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
        editorComponent={withStyles(styles)(NumberEditorBase(columnExtensions))}
      />
    )
  }
}

export default NumberTypeProvider
