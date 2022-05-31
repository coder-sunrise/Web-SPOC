/* eslint-disable prefer-template */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AutosizeInput from 'react-input-autosize'
import _ from 'lodash'
import numeral from 'numeral'

// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { InputNumber } from 'antd'
import { isNumber } from 'util'
import { CustomInput } from '@/components'
import { control } from '@/components/Decorator'
import { extendFunc, roundTo } from '@/utils/utils'
import { percentageFormat } from '@/utils/config'

const STYLES = () => {
  return {
    dropdownMenu: {
      zIndex: 1310,
    },
    container: {
      width: '100%',
      color: 'currentColor',
      borderWidth: 0,
      background: 'none',
      lineHeight: '1rem',
      height: 'auto',
      '&, &:focus, &:hover': {
        boxShadow: 'none !important',
        borderRightWidth: '0px !important',
      },
      '& .ant-input-number-input': {
        height: '100%',
        padding: 0,
        lineHeight: '1rem',
      },
      '& .ant-input-number-input-wrap': {
        lineHeight: '1rem',
        marginTop: 1,
      },
      '& .ant-input-number-handler-wrap': {
        background: 'none',
        top: -2,
        border: `0px solid rgba(0.4, 0, 0.2, 1)`,
      },
      '& .ant-input-number-handler-down': {
        borderTop: `0px solid rgba(0.4, 0, 0.2, 1)`,
      },
      '& .ant-input-number-handler-up-inner, .ant-input-number-handler-down-inner': {
        right: 6,
      },
    },
  }
}

const reg = /^0\d/gi

@control()
class AntdNumberInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    renderDropdown: PropTypes.func,
    allowEmpty: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    debounceDuration: PropTypes.number,
    precision: PropTypes.number,
  }

  static defaultProps = {
    disabled: false,
    size: 'default',
    allowEmpty: true,
    max: 999999999,
    min: -999999999,
    debounceDuration: 500,
    precision: 1,
  }

  constructor(props) {
    super(props)
    const {
      field = {},
      defaultValue,
      value,
      debounceDuration,
      precision,
      currency,
    } = props

    // TODO: find a better way to config default currency precision
    const convertedPrecision = currency && precision === 1 ? 2 : precision
    const v = defaultValue !== undefined ? defaultValue : value

    this.state = {
      value: roundTo(
        Number(field.value || field.value === 0 ? field.value : v),
        convertedPrecision,
      ),
      convertedPrecision,
      focused: false,
    }

    this.debouncedOnChange = _.debounce(
      this._onChange.bind(this),
      debounceDuration,
      {
        leading: true,
      },
    )
  }

  handleFocus = e => {
    // this.setState({
    //   focused: true,
    // })
    // const { target } = e
    // setTimeout(() => {
    //   const v = `${this.state.value}`
    //   if (v) {
    //     const dotIndex = v.indexOf('.') > 0 ? v.indexOf('.') : v.length
    //     if (dotIndex) {
    //       target.setSelectionRange(dotIndex, dotIndex)
    //     }
    //   }
    // }, 0)
  }

  handleBlur = e => {
    this.debouncedOnChange.cancel()
    let v = e.target.value
    if (
      !e.target.value &&
      !this.props.allowEmpty &&
      (this.props.min || this.props.min === 0)
    ) {
      v = this.props.min
    }
    this._onChange(
      v || v === 0
        ? roundTo(Number(v), this.state.convertedPrecision)
        : undefined,
    )
    // this.setState({
    //   focused: false,
    // })
  }

  _onChange = value => {
    const { props } = this
    const { field, loadOnChange, readOnly, onChange } = props
    if (readOnly || loadOnChange) return
    const v = {
      target: {
        value,
        name: field ? field.name : '',
      },
    }
    if (props.field && props.field.onChange) {
      props.field.onChange(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  handleKeyUp = e => {
    if ([13].includes(e.which)) {
      let val = roundTo(
        numeral(e.target.value)._value,
        this.state.convertedPrecision,
      )
      this._onChange(val)
      this.debouncedOnChange.cancel()
    }
  }

  handleKeyDown = e => {
    const v = e.target.value
    if (this.props.positiveOnly && e.key === '-') {
      e.preventDefault()
      return false
    }

    if (
      (e.shiftKey && ![187, 9].includes(e.keyCode)) ||
      (!e.shiftKey && [187].includes(e.keyCode)) ||
      (e.keyCode === 189 && v.indexOf('-') >= 0)
    ) {
      e.preventDefault()
      return false
    }
    if ([190, 110].includes(e.keyCode)) {
      const dotIndex = v.indexOf('.') > 0 ? v.indexOf('.') : v.length

      if (e.target.value.split('.').length === 2) {
        e.target.setSelectionRange(dotIndex + 1, dotIndex + 1)
        e.preventDefault()
        return false
      }
    }
    if (
      !e.ctrlKey &&
      !(e.keyCode >= 48 && e.keyCode <= 57) &&
      !(e.keyCode >= 96 && e.keyCode <= 105) &&
      !(e.keyCode >= 37 && e.keyCode <= 40) &&
      ![35, 36, 8, 9, 46, 187, 189, 110, 109, 107, 190].includes(e.keyCode)
    ) {
      e.preventDefault()
    }

    if (e.ctrlKey && ![65, 67, 86, 88].includes(e.keyCode)) {
      e.preventDefault()
    }
    if (e.keyCode === 8 && Number(this.state.value) === 0) {
      this.setState({
        value: '',
      })
    }
  }

  handleValueChange = (v, force) => {
    let newV = v
    if (!isNumber(newV)) {
      newV = undefined
    }
    if (!newV && newV !== 0 && !this.props.allowEmpty) {
      newV = this.props.min
    } else if (v > this.props.max) {
      newV = this.props.max
    }
    if (!newV && newV !== 0) newV = ''
    else {
      newV = roundTo(Number(newV), this.state.convertedPrecision)
    }
    this.setState({
      value: !newV && newV !== 0 ? '' : newV,
    })
    if (newV === '' || force) {
      this._onChange(newV)
      this.debouncedOnChange.cancel()
    } else {
      this.debouncedOnChange(newV)
    }
    return true
  }

  getConfig = () => {
    const {
      currency,
      percentage,
      original,
      formatter,
      max,
      min,
      parser,
      field,
    } = this.props
    const { convertedPrecision: precision } = this.state
    let { format } = this.props
    const extraCfg = {
      precision,
      formatter,
      max,
      min,
    }

    // if (!format) {
    //   let precisionStr = '.'
    //   for (let i = 0; i < extraCfg.precision; i++) {
    //     precisionStr += '0'
    //   }
    //   if (currency) {
    //     format = `0,0` + (precisionStr.length > 1 ? precisionStr : '')
    //   } else {
    //     format = `0` + (precisionStr.length > 1 ? precisionStr : '')
    //   }
    // }
    // if (currency) {
    //   extraCfg.formatter = v => {
    //     if (v === '') return ''
    //     // if (!this.state.focused) {
    //     //   const nv = numeral(v)
    //     //   if (nv._value < 0) return `(${numeral(Math.abs(v)).format(format)})`

    //     //   console.log(nv.format(format))
    //     //   return nv.format(format)
    //     // }
    //     console.log(numeral(v).format(format))
    //     return numeral(v).format(format)
    //   }
    // } else if (original) {
    //   extraCfg.formatter = v => {
    //     return v
    //   }
    //   extraCfg.max = extraCfg.max || 100
    //   extraCfg.min = -100
    // } else if (percentage) {
    //   if (!format) format = percentageFormat

    //   extraCfg.formatter = v => {
    //     if (v === '') return ''
    //     return numeral(v).format(percentageFormat)
    //   }

    //   extraCfg.max = extraCfg.max || 100
    //   extraCfg.min = -100
    // } else if (formatter) {
    //   extraCfg.formatter = v => {
    //     if (v === '') return ''

    //     // if (!this.state.focused) {
    //     //   return formatter(v)
    //     // }
    //     return formatter(v)
    //   }
    // } else if (format) {
    //   extraCfg.formatter = v => {
    //     if (v === '') return ''
    //     // if (!this.state.focused) {
    //     //   return numeral(v).format(format)
    //     // }
    //     return numeral(v).format(format)
    //   }
    // }
    if (!parser) {
      const dotPos =
        format && format.indexOf('.') >= 0
          ? format.substring(
              format.lastIndexOf('.') + 1,
              format.lastIndexOf('0') + 1,
            )
          : ''
      extraCfg.parser = v => {
        if (v === '') return v

        if (v) {
          if (v.indexOf('+') >= 0) {
            v = `${v.replace('-', '').replace('+', '')}`
          }
          if (v.indexOf('-') >= 0) {
            v = v.replace('-', '')
            while (v && v.match(reg)) {
              v = v.substring(1, v.length)
            }
            v = `-${v}`
          } else {
            while (v && v.match(reg)) {
              v = v.substring(1, v.length)
            }
          }
        }
        if (
          Number(v) !== 0 &&
          !Number(v) &&
          this.state.value === '' &&
          v !== '-'
        )
          return ''
        if (typeof v === 'number') return v
        return v.replace(/\$\s?|(,*)/g, '')
      }
      if (dotPos.length && !extraCfg.precision)
        extraCfg.precision = dotPos.length
    }
    return extraCfg
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      defaultValue,
      renderDropdown,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      currency,
      percentage,
      style,
      precision,
      formatter,
      ...restProps
    } = this.props

    if (this.props.text) {
      if (!this.state.value && this.state.value !== 0 && !this.props.showZero)
        return <span>-</span>

      const cfg = this.getConfig()
      let val = ''
      let precisionStr = '.'
      for (let i = 0; i < this.state.convertedPrecision; i++) {
        precisionStr += '0'
      }
      let format = ''
      if (currency) {
        if (this.state.value < 0) {
          format = `$0,0` + (precisionStr.length > 1 ? precisionStr : '')
          val = `(${numeral(Math.abs(this.state.value)).format(format)})`
        } else {
          format = `$0,0` + (precisionStr.length > 1 ? precisionStr : '')
          val = numeral(this.state.value).format(format)
        }
      } else if (percentage) {
        format = `0` + (precisionStr.length > 1 ? precisionStr : '') + '%'
        val = numeral(this.state.value).format(format)
      } else {
        format = `0` + (precisionStr.length > 1 ? precisionStr : '')
        val = numeral(this.state.value).format(format)
      }
      return (
        <AutosizeInput
          readOnly
          tabIndex='-1'
          inputClassName={props.className}
          value={val}
        />
      )
    }
    return (
      <div style={{ width: '100%' }} {...props}>
        <InputNumber
          className={classnames(classes.container)}
          onChange={this.handleValueChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          value={this.state.value}
          onKeyDown={extendFunc(onKeyDown, this.handleKeyDown)}
          onKeyUp={this.handleKeyUp}
          {...this.getConfig()}
          {...restProps}
          precision={this.state.convertedPrecision}
        />
      </div>
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { field, value, min, defaultValue } = nextProps
    const { convertedPrecision: precision } = this.state
    const v = value !== undefined ? value : defaultValue
    if (field) {
      this.setState({
        value:
          field.value === undefined ||
          Number.isNaN(Number(field.value)) ||
          field.value === ''
            ? ''
            : roundTo(Number(field.value), precision),
      })
    } else if (v || v === 0) {
      this.setState({
        value:
          v === undefined || Number.isNaN(Number(v)) || v === ''
            ? ''
            : roundTo(Number(v), precision),
      })
    } else {
      this.setState({
        value: undefined,
      })
    }
  }

  render() {
    const { classes, onChange, ...restProps } = this.props
    const labelProps = {
      shrink:
        !(!this.state.value && this.state.value !== 0) || this.state.focused,
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        maxLength='12'
        muiType='numberinput'
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdNumberInput' })(AntdNumberInput)
