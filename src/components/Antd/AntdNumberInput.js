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
import { CustomInput } from '@/components'
import { control } from '@/components/Decorator'
import { extendFunc } from '@/utils/utils'
import config from '@/utils/config'

const { currencyFormat, qtyFormat, currencySymbol } = config

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
  }

  static defaultProps = {
    disabled: false,
    size: 'default',
    allowEmpty: true,
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
      shrink: field.value !== undefined && field.value !== '',
      value:
        field.value !== undefined && field.value !== ''
          ? field.value
          : defaultValue || value,
      focused: false,
    }
    this.debouncedOnChange = _.debounce(this.debouncedOnChange.bind(this), 1000)
  }

  componentWillReceiveProps (nextProps) {
    const { field } = nextProps
    if (field) {
      this.setState({
        value: field.value === undefined ? '' : field.value,
      })
    }
  }

  handleFocus = () => {
    window.$_inputFocused = true
    this.setState({
      shrink: true,
      focused: true,
    })
    // const { parser } = this.props
    // if (parser) {
    //   this.setState({
    //     displayValue: parser(this.state.value),
    //   })
    // }
  }

  handleBlur = () => {
    window.$_inputFocused = false

    if (
      this.state.value === undefined ||
      this.state.value === null ||
      this.state.value === ''
    ) {
      this.setState({ shrink: false })
    }
    this.setState({
      focused: false,
    })
    const { form, field } = this.props
    if (form && field) form.setFieldTouched(field.name, true)

    // const { formatter } = this.props
    // if (formatter) {
    //   this.setState({
    //     value: formatter(this.state.value, true),
    //   })
    // }
  }

  debouncedOnChange = (value) => {
    const { props } = this
    const { field, loadOnChange, readOnly, onChange } = props
    // console.log('c', value)
    if (readOnly || loadOnChange) return
    // const { formatter } = this.props
    // if (formatter) {
    //   console.log('c', value)
    //   this.setState({
    //     displayValue: formatter(value),
    //   })
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

  handleValueChange = (v) => {
    // if ((v === undefined || !/\S/.test(v)) && !this.props.allowEmpty) {
    //   return false
    // }
    // console.log(this.props.allowEmpty, v)
    let newV = v
    if (v === undefined && !this.props.allowEmpty) {
      newV = this.props.min
    }
    this.setState({
      value: newV,
    })

    this.debouncedOnChange(newV)
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
    const { currency, percentage, formatter } = this.props
    const extraCfg = {}

    if (currency) {
      extraCfg.formatter = (v) => {
        if (v === '') return ''
        if (!this.state.focused) {
          return currencySymbol + numeral(v).format(`${currencyFormat}`)
        }
        return v
      }
      extraCfg.parser = (v) => {
        if (typeof v === 'number') return v
        return v.replace(/\$\s?|(,*)/g, '')
      }

      extraCfg.precision = 2
    } else if (percentage) {
      extraCfg.formatter = (v) => {
        if (v === '') return ''
        if (!this.state.focused) {
          return numeral(v / 100).format('0.00%')
        }
        return v
      }
      extraCfg.parser = (v) => {
        if (typeof v === 'number') return v
        return v.replace(/\$\s?|(,*)/g, '')
      }
      extraCfg.max = 100
      extraCfg.min = -100
    } else if (formatter) {
      extraCfg.formatter = (v) => {
        if (v === '') return ''
        if (!this.state.focused) {
          return formatter(v)
        }
        return v
      }
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
    // console.log(props)

    if (this.props.text) {
      const cfg = this.getConfig()
      return (
        <AutosizeInput
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
          {...this.getConfig()}
          {...restProps}
          // formatter={this.handleFormatter}
          // parser={this.handleParser}
        />
      </div>
    )
  }

  render () {
    const { classes, onChange, ...restProps } = this.props

    const labelProps = {
      shrink:
        !(
          this.state.value === undefined ||
          this.state.value === '' ||
          this.state.value === null
        ) || this.state.shrink,
    }

    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdNumberInput' })(AntdNumberInput)
