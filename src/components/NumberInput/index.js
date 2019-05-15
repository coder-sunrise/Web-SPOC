import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import InputAdornment from '@material-ui/core/InputAdornment'
import { DateRange, Clear } from '@material-ui/icons'
import CustomInput from 'mui-pro-components/CustomInput'

import classNames from 'classnames'
import Cleave from 'cleave.js/react'
import numeral from 'numeral'

const getValue = (props) => {
  let {
    classes,
    field,
    form,
    number = true,
    creditCard,
    currency,
    qty,
    value,
    defaultValue,
    percent,
  } = props
  if (field) {
    value = field.value
  } else if (value === undefined && defaultValue) {
    value = defaultValue
  }
  if ((currency || qty || percent) && `${value}`) {
    if (currency) {
      value = numeral(value).format('0.00')
    } else if (qty || percent) {
      value = numeral(value).format('0.0')
    }
  }

  return value
}
const styles = (theme) => ({
  noLabel: {
    '& .rdtPicker': {
      marginTop: '-20px !important',
    },
  },
  input: {},
})
class NumberInput extends React.PureComponent {
  state = {
    shrink: this.props.field ? !!this.props.field.value : false,
    value: getValue(this.props),
    // value: null,
    focus: undefined,
  }

  // static getDerivedStateFromProps (nextProps, preState){
  //   let {value, field}=nextProps
  //   if(field)value = field.value
  //   console.log(nextProps, preState)
  //   if(preState.focus || preState.value===value)return null

  //   if(value){
  //       return {
  //         value:numeral(value).value(),
  //       }
  //   }
  //   return null
  // }

  onChange = (event) => {
    const { props } = this
    const { readOnly, time } = props

    const value = !time
      ? numeral(event.target.value).value()
      : event.target.value
    this.setState({
      value,
    })

    if (props.onChange) {
      props.onChange({
        target: {
          value,
        },
      })
    } else if (props.field && props.field.onChange)
      props.field.onChange(
        {
          target: {
            value,
            name: props.field.name,
          },
        },
        props,
      )
  }

  onFocus = (event) => {
    const el = event.target
    this.setState({
      focus: true,
    })
    let endPos = el.value.length
    let startPos = 0
    if (this.props.currency) {
      endPos = el.value.length - 3
      startPos = 1
    }
    if (el.setSelectionRange) {
      el.setSelectionRange(startPos, endPos)
    }
    // // update some state
  }

  onBlur = (event) => {
    this.setState({
      focus: false,
    })
  }

  getComponent = (props) => {
    const {
      classes,
      field,
      form,
      number = true,
      creditCard,
      currency,
      qty,
      percent,
      time,
      timePattern = [
        'h',
        'm',
      ],
      timeFormat = '24',
    } = this.props
    let { inputRef, value, onFocus, onBlur, ...restProps } = props

    const formatVal = {}
    const options = props.options || {}

    if (number || currency || qty || percent) {
      options.numeralThousandsGroupStyle = 'thousand'
      options.numeral = true
    }

    if ((currency || qty || percent) && `${value}`) {
      if ((currency && !currency.allowNegtive) || qty || percent) {
        options.numeralPositiveOnly = true
      }
      if (currency) {
        options.prefix = '$'
        if (!this.state.focus) formatVal.value = numeral(value).format('0.00')
      } else if (qty || percent) {
        if (!this.state.focus) formatVal.value = numeral(value).format('0.0')
        options.numeralDecimalScale = 1
      }
    }

    if (time) {
      options.time = true
      options.timePattern = timePattern
      options.timeFormat = timeFormat
      formatVal.value = value
    }

    if (creditCard) {
      options.creditCard = true
    }

    return (
      <Cleave
        options={options}
        {...restProps}
        {...formatVal}
        onFocus={(e) => {
          if (onFocus) onFocus(e)
          this.onFocus(e)
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e)
          this.onBlur(e)
        }}
        onChange={this.onChange}
      />
    )
  }

  render () {
    const { inputProps = {}, theme, ...restProps } = this.props
    const { form, field } = restProps
    let shrink = !!(
      !!this.state.value ||
      this.state.value === 0 ||
      this.state.focus
    )

    if (form && field) {
      const { name } = field
      const { errors = {} } = form
      shrink = shrink || errors[name]
    }

    inputProps.inputComponent = this.getComponent

    return (
      <CustomInput
        labelProps={{
          shrink,
        }}
        inputProps={inputProps}
        {...restProps}
      />
    )
  }
}

NumberInput.propTypes = {}

export default withStyles(styles, { withTheme: true })(NumberInput)
