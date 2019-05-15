import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import { withStyles } from '@material-ui/core'

import {
  NumberInput,
  NumberTypeProvider as NumberTypeProviderOrg,
} from '@/components'

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

const CurrencyEditorBase = (props) => {
  const {
    column: { name: columnName },
    value,
    onValueChange,
    columnExtensions,
    classes,
  } = props
  const disabled = columnExtensions.some(
    ({ editingEnabled, columnName: currentColumnName }) =>
      currentColumnName === columnName && editingEnabled === false,
  )

  return (
    <NumberInput
      inputProps={{
        fullWidth: true,
      }}
      classes={{ input: classes.alignRight }}
      disabled={disabled}
      value={value}
      onChange={(event) => {
        numberOnChangeFormatter(onValueChange)(event.target.value)
      }}
      currency
      noWrapper
    />
  )
}

export const NumberEditor = withStyles(styles)(CurrencyEditorBase)

class NumberTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array.isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { columnExtensions } = this.props
    this.NumberEditor = (editorProps) => (
      <NumberEditor columnExtensions={columnExtensions} {...editorProps} />
    )
  }

  render () {
    const { for: dtpFor, config } = this.props
    // console.log(this.props)
    return (
      <NumberTypeProviderOrg
        for={dtpFor}
        config={config}
        editorComponent={this.NumberEditor}
      />
    )
  }
}

export default NumberTypeProvider
