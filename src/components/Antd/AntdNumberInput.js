import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AutosizeInput from 'react-input-autosize'
import _ from 'lodash'
import numeral from 'numeral'

// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import { primaryColor } from 'mui-pro-jss'
// ant
import { InputNumber } from 'antd'
import { isNumber } from 'util'
import { CustomInput } from '@/components'
import { control } from '@/components/Decorator'
import { extendFunc } from '@/utils/utils'
import config from '@/utils/config'

const { currencyFormat, percentageFormat, qtyFormat, currencySymbol } = config

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
  }

  static defaultProps = {
    disabled: false,
    size: 'default',
    allowEmpty: true,
    max: 999999999,
    min: -999999999,
  }

  constructor (props) {
    super(props)
    const {
      field = {},
      form,
      inputProps = {},
      formatter,
      parser,
      defaultValue,
      value,
    } = props
    this.state = {
      value:
        field.value !== undefined && field.value !== ''
          ? field.value
          : defaultValue || value,
      focused: false,
    }
    // console.log(this.state.value)

    this.debouncedOnChange = _.debounce(this._onChange.bind(this), 1000, {
      leading: true,
    })
  }

  handleFocus = (e) => {
    // console.log('handleFocus', e.target.value)
    this.setState({
      focused: true,
    })
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

  handleBlur = () => {
    this._onChange(
      this.state.value || this.state.value === 0
        ? numeral(this.state.value)._value
        : undefined,
    )
    this.debouncedOnChange.cancel()
    this.setState({
      focused: false,
    })
  }

  _onChange = (value) => {
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
      !e.ctrlKey &&
      !(e.keyCode >= 48 && e.keyCode <= 57) &&
      !(e.keyCode >= 96 && e.keyCode <= 105) &&
      !(e.keyCode >= 37 && e.keyCode <= 40) &&
      ![
        8,
        9,
        46,
        189,
      ].includes(e.keyCode)
    ) {
      e.preventDefault()
    }
    // console.log(this.state.value)
    if (e.keyCode === 189 || e.keyCode === 109) {
      if (this.props.min >= 0) {
        e.preventDefault()
      } else {
        this.handleValueChange(-Math.abs(this.state.value), true)

        e.preventDefault()
      }
    }

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
    if (v === undefined && !this.props.allowEmpty) {
      newV = this.props.min
    } else if (v > this.props.max) {
      newV = this.props.max
    }

    this.setState({
      value: newV === undefined ? '' : newV,
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
      formatter = (v) => v,
      max,
      min,
      parser,
      field,
    } = this.props
    let { format } = this.props
    const { selectionStart } = this.state
    const extraCfg = {
      formatter,
      max,
      min,
    }

    if (currency) {
      if (!format) format = `${currencySymbol}${currencyFormat}`

      extraCfg.formatter = (v) => {
        if (v === '') return ''

        if (!this.state.focused) {
          const nv = numeral(v)
          if (nv._value < 0) return nv.format(`(${format})`)
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

        if (!this.state.focused) {
          return numeral(v).format(format)
        }
        return v
      }
    }
    if (!parser) {
      const dotPos = format
        ? format.substring(
            format.lastIndexOf('.') + 1,
            format.lastIndexOf('0') + 1,
          )
        : ''
      extraCfg.parser = (v) => {
        if (!Number(v) && this.state.value === '') return ''
        if (v === '') return v
        if (format) {
          if (format.lastIndexOf('.') > 0) {
            v = `${v}`.replace('.', '')
            const lastCharIsZero = v[v.length - 1] === '0'

            v = `${Number(v) / Math.pow(10, dotPos.length)}`
            const idx = v.indexOf('.')
            if (lastCharIsZero && idx >= 0) {
              v += dotPos
              v =
                v.substring(0, idx) + v.substring(idx, idx + dotPos.length + 1)
            }
            if (idx < 0) v += `.${dotPos}`
          }
        }
        if (typeof v === 'number') return v
        return v.replace(/\$\s?|(,*)/g, '')
      }
      if (dotPos.length) extraCfg.precision = dotPos.length
    }
    return extraCfg
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      defaultValue,
      renderDropdown,
      onChange,
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
      const cfg = this.getConfig()
      return (
        <AutosizeInput
          readOnly
          inputClassName={props.className}
          value={cfg.formatter(this.state.value)}
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
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          {...this.getConfig()}
          {...restProps}
          // formatter={this.handleFormatter}
          // parser={this.handleParser}
        />
      </div>
    )
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { field, value, min, text } = nextProps

    if (field) {
      this.setState({
        value:
          field.value === undefined || Number.isNaN(field.value)
            ? ''
            : Number(field.value),
        focused:
          !text &&
          field.value !== undefined &&
          field.value !== null &&
          field.value !== '' &&
          !Number.isNaN(field.value),
      })
    } else if (value) {
      this.setState({
        value: value === undefined || Number.isNaN(value) ? '' : Number(value),
        focused:
          !text &&
          value !== undefined &&
          value !== null &&
          value !== '' &&
          !Number.isNaN(value),
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
        !(
          this.state.value === undefined ||
          this.state.value === '' ||
          this.state.value === null
        ) || this.state.focused,
    }

    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        maxLength='12'
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdNumberInput' })(AntdNumberInput)
