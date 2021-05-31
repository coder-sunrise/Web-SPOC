import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import InputAdornment from '@material-ui/core/InputAdornment'
import BaseInput from 'mui-pro-components/CustomInput/BaseInput'

import classNames from 'classnames'
import Cleave from 'cleave.js/react'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'

const styles = (theme) => ({})
class Number extends React.PureComponent {
  render() {
    const {
      classes,
      field,
      form,
      type = 'currency',
      format,
      value,
    } = this.props
    let strValue = ''
    let fontColor = 'black'
    let numberFormat = '0.00'
    if (field) {
      value = field.value
    }
    if (value || value === 0) {
      if (type === 'currency') {
        numberFormat = format || '0.00'
        if (value >= 0) {
          strValue = `${currencySymbol}${numeral(value).format(numberFormat)}`
          fontColor = 'darkBlue'
        }
        else {
          strValue = `(${currencySymbol}${numeral(-1 * value).format(numberFormat)})`
          fontColor = 'red'
        }
      } else {
        numberFormat = format || '0.0'
        strValue = numeral(value).format(numberFormat)
        if (value < 0) {
          fontColor = 'red'
        }
      }
    }

    return (
      <span style={{ color: fontColor, fontWeight: 500 }}>{strValue}</span>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Number)
