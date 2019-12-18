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
      // '& > div': {
      //   // erase all border, and boxShadow
      //   // height: 31,
      //   border: 'none',
      //   boxShadow: 'none !important',
      //   borderRadius: 0,
      //   // borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
      // },
      // '& .ant-select-selection': {
      //   background: 'none',
      // },
      // '& .ant-select-selection__rendered': {
      //   lineHeight: 'inherit',
      //   marginRight: 0,
      // },
      // '& .ant-select-selection--single': {
      //   height: '100%',
      // },
      // '& .ant-select-selection--multiple': {
      //   height: '100%',
      //   minHeight: '20px',
      //   // to match the same line
      //   // with ant-select-select--single
      //   paddingBottom: 0,
      //   position: 'relative',
      //   top: -4,
      // },
      // '& .ant-select-selection > div': {
      //   marginLeft: 0,
      //   // fontSize: '1rem',
      //   // fontWeight: 400,
      //   // paddingTop: 3,
      // },
    },
  }
}

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
    debounceDuration: 1000,
    precision: 1,
  }

  constructor (props) {
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
    this.state = {
      value: roundTo(
        Number(
          field.value !== undefined && field.value !== ''
            ? field.value
            : defaultValue || value,
        ),
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

  handleFocus = (e) => {
    this.setState({
      focused: true,
    })
    const { target } = e
    setTimeout(() => {
      const v = `${this.state.value}`

      if (v) {
        const dotIndex = v.indexOf('.') > 0 ? v.indexOf('.') : v.length

        if (dotIndex) {
          target.setSelectionRange(dotIndex, dotIndex)
        }
      }
    }, 0)
    // if (!e.target.value && e.target.value !== 0) {
    //   const cfg = this.getConfig()
    //   if (cfg && cfg.formatter)
    //     this.setState({
    //       value: 0.0000000000000001,
    //     })
    // }
    // const { parser } = this.props
    // if (parser) {
    //   this.setState({
    //     displayValue: parser(this.state.value),
    //   })
    // }
  }

  handleBlur = (e) => {
    let v = e.target.value
    if (
      !e.target.value &&
      !this.props.allowEmpty &&
      (this.props.min || this.props.min === 0)
    ) {
      v = this.props.min
    }
    this._onChange(v || v === 0 ? numeral(v)._value : undefined)

    this.debouncedOnChange.cancel()
    this.setState({
      focused: false,
    })
  }

  _onChange = (value) => {
    // console.log({ value })
    const { props } = this
    const { field, loadOnChange, readOnly, onChange } = props
    if (readOnly || loadOnChange) return
    // const { formatter } = this.props
    // if (formatter) {
    //   console.log('c', value)
    //   this.setState({
    //     displayValue: formatter(value),
    //   })
    // }
    // const re = /^[0-9\b]+$/
    // if (!re.test(value)) {
    //   return
    // }
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

  handleKeyUp = (e) => {
    if (
      [
        13,
      ].includes(e.which)
    ) {
      this._onChange(numeral(e.target.value)._value)
      this.debouncedOnChange.cancel()
    }
  }

  handleKeyDown = (e) => {
    if (
      e.shiftKey &&
      ![
        187,
        9,
      ].includes(e.keyCode)
    ) {
      e.preventDefault()
      return false
    }
    if (e.keyCode === 190) {
      const v = `${this.state.value}`

      const dotIndex = v.indexOf('.') > 0 ? v.indexOf('.') : v.length
      // console.log(v, dotIndex, v.length)

      if (dotIndex) {
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
      ![
        8,
        9,
        46,
        187,
        189,
        109,
        107,
        190,
      ].includes(e.keyCode)
    ) {
      e.preventDefault()
    }
    // console.log(this.state.value)
    // if (e.keyCode === 189 || e.keyCode === 109) {
    //   if (this.props.min >= 0) {
    //     e.preventDefault()
    //   } else if (this.state.value > 0) {
    //     this.handleValueChange(-Math.abs(this.state.value), true)

    //     e.preventDefault()
    //   }
    // }

    if (
      e.ctrlKey &&
      ![
        65,
        67,
        86,
        88,
      ].includes(e.keyCode)
    ) {
      e.preventDefault()
    }
    if (e.keyCode === 8 && Number(this.state.value) === 0) {
      this.setState({
        value: '',
      })
    }

    // if (e.keyCode === 190 && e.target.value.indexOf('.') >= 0)
    //   e.preventDefault()

    // console.log('handleKeyDown', e.ctrlKey, e.target.value, e.keyCode)
    // this.setState({
    //   selectionStart: e.target.selectionStart,
    // })
  }

  handleValueChange = (v, force) => {
    // if ((v === undefined || !/\S/.test(v)) && !this.props.allowEmpty) {
    //   return false
    // }
    // console.log(this.props.allowEmpty, v)
    // const re = /^[0-9\b]+$/
    // if (!re.test(v)) {
    //   return
    // }
    // console.log('handleValueChange', v)
    let newV = v
    if (!isNumber(newV)) {
      newV = undefined
    }
    if ((newV === undefined || newV === null) && !this.props.allowEmpty) {
      newV = this.props.min
    } else if (v > this.props.max) {
      newV = this.props.max
    }
    if (newV === undefined || newV === null) newV = ''
    // console.log(!newV && newV !== 0 ? '' : newV)
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

  // debouncedParser = (value) => {
  //   const { props } = this
  //   const { parser } = props
  //   if (parser) {
  //     return parser(value)
  //   }
  //   return this.state.value
  // }

  // handleParser = (v) => {
  //   console.log(v)

  //   this.debouncedParser(v)
  //   return this.state.value
  // }

  // debouncedFormatter = (value) => {
  //   const { props } = this
  //   const { formatter } = props
  //   if (formatter) {
  //     return formatter(value)
  //   }
  //   return this.state.value
  // }

  // handleFormatter = (v) => {
  //   console.log(v)
  //   return this.debouncedFormatter(v)
  // }

  getConfig = () => {
    const {
      currency,
      percentage,
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

    if (!format) {
      let precisionStr = '.'
      for (let i = 0; i < extraCfg.precision; i++) {
        precisionStr += '0'
      }
      if (currency) {
        format = `$0,0` + (precisionStr.length > 1 ? precisionStr : '')
      } else {
        format = `0` + (precisionStr.length > 1 ? precisionStr : '')
      }
    }
    if (currency) {
      extraCfg.formatter = (v) => {
        if (v === '') return ''
        if (!this.state.focused) {
          const nv = numeral(v)
          if (nv._value < 0) return `(${numeral(Math.abs(v)).format(format)})`

          return nv.format(format)
        }
        return `${v}`
      }
      // extraCfg.precision = 2
    } else if (percentage) {
      if (!format) format = percentageFormat

      extraCfg.formatter = (v) => {
        if (v === '') return ''
        if (!this.state.focused) {
          if (v > 100) v = 100
          return numeral(v / 100).format(percentageFormat)
        }
        return v
      }

      extraCfg.max = extraCfg.max || 100
      extraCfg.min = -100
    } else if (formatter) {
      extraCfg.formatter = (v) => {
        if (v === '') return ''

        if (!this.state.focused) {
          return formatter(v)
        }
        return v
      }
    } else if (format) {
      extraCfg.formatter = (v) => {
        if (v === '') return ''
        // console.log(v, format)
        if (!this.state.focused) {
          return numeral(v).format(format)
        }
        return v
      }
    }
    if (!parser) {
      const dotPos =
        format && format.indexOf('.') >= 0
          ? format.substring(
              format.lastIndexOf('.') + 1,
              format.lastIndexOf('0') + 1,
            )
          : ''
      extraCfg.parser = (v) => {
        if (v === '') return v
        // console.log('parser', v)
        if (v) {
          if (v.indexOf('+') >= 0) {
            v = `${v.replace('-', '').replace('+', '')}`
          }
          if (v.indexOf('-') > 0) {
            v = `-${v.replace('-', '')}`
          }
        }
        if (!Number(v) && this.state.value === '' && v !== '-') return ''
        // if (format && v !== '-') {
        //   if (format.lastIndexOf('.') > 0) {
        //     v = `${v}`.replace('.', '')
        //     const lastCharIsZero = v[v.length - 1] === '0'
        //     const tv = Number(v) / Math.pow(10, dotPos.length)
        //     if (Number.isNaN(tv)) return ''
        //     v = `${tv}`
        //     const idx = v.indexOf('.')
        //     if (lastCharIsZero && idx >= 0) {
        //       v += dotPos
        //       v =
        //         v.substring(0, idx) + v.substring(idx, idx + dotPos.length + 1)
        //     }
        //     if (idx < 0) v += `.${dotPos}`
        //   }
        // }
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
      formatter,
      // parser,
      ...restProps
    } = this.props

    // if (selectValue !== undefined) {
    //   cfg.value = selectValue
    // }
    if (this.props.text) {
      if (!this.state.value && this.state.value !== 0 && !this.props.showZero)
        return <span>-</span>

      const cfg = this.getConfig()
      return (
        <AutosizeInput
          readOnly
          tabIndex='-1'
          inputClassName={props.className}
          value={cfg.formatter(this.state.value)}
        />
      )
    }
    // console.log(restProps, this.getConfig())
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
          // formatter={this.handleFormatter}
          // parser={this.handleParser}
        />
      </div>
    )
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { field, value, min } = nextProps
    const { convertedPrecision: precision } = this.state

    if (field) {
      this.setState({
        value:
          field.value === undefined || Number.isNaN(Number(field.value))
            ? ''
            : roundTo(Number(field.value), precision),
        // focused:
        //   field.value !== undefined &&
        //   field.value !== null &&
        //   field.value !== '' &&
        //   !Number.isNaN(field.value),
      })
    } else if (value || value === 0) {
      this.setState({
        value:
          value === undefined || Number.isNaN(Number(value))
            ? ''
            : roundTo(Number(value), precision),
        // focused:
        //   value !== undefined &&
        //   value !== null &&
        //   value !== '' &&
        //   !Number.isNaN(value),
      })
    } else {
      this.setState({
        value: undefined,
        // focused: false,
      })
    }
    // console.log(field)
  }

  render () {
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
        // preventDefaultKeyDownEvent
        maxLength='12'
        muiType='numberinput'
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdNumberInput' })(AntdNumberInput)
