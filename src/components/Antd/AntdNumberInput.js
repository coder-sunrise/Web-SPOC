import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
import numeral from 'numeral'

// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import { primaryColor } from 'mui-pro-jss'
// ant
import { InputNumber } from 'antd'
import { CustomInput } from '@/components'

import { extendFunc } from '@/utils/utils'

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
      '&, &:focus, &:hover': {
        boxShadow: 'none !important',
        borderRightWidth: '0px !important',
      },
      '& .ant-input-number-input': {
        height: 'auto',
        padding: 0,
      },
      '& .ant-input-number-handler-wrap': {
        background: 'none',
        top: -2,
        border: `0px solid rgba(0.4, 0, 0.2, 1)`,
      },
      '& .ant-input-number-handler-down': {
        borderTop: `0px solid rgba(0.4, 0, 0.2, 1)`,
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
  }

  constructor (props) {
    super(props)
    const { field = {}, form, inputProps = {}, formatter, parser } = props
    this.state = {
      shrink: field.value !== undefined && field.value !== '',
      value: field.value !== undefined && field.value !== '' ? field.value : '',
      focused: false,
    }
    this.debouncedOnChange = _.debounce(this.debouncedOnChange.bind(this), 1000)
  }

  componentWillReceiveProps (nextProps) {
    const { field } = nextProps
    if (field && typeof field.value === 'number') {
      this.setState({
        value: field.value,
      })
    }
  }

  handleFocus = () => {
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
    if (this.state.value === undefined || this.state.value.length === 0) {
      this.setState({ shrink: false })
    }
    this.setState({
      focused: false,
    })
    // const { formatter } = this.props
    // if (formatter) {
    //   this.setState({
    //     value: formatter(this.state.value, true),
    //   })
    // }
  }

  debouncedOnChange = (value) => {
    const { props } = this
    const { loadOnChange, readOnly, onChange } = props
    console.log('c', value)
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
        name: props.field.name,
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
    this.setState({
      value: v,
    })

    this.debouncedOnChange(v)
    return false
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

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      defaultValue,
      renderDropdown,
      onChange,
      onFocus,
      onBlur,
      currency,
      // formatter,
      // parser,
      ...restProps
    } = this.props
    const { form, field, value } = restProps

    const cfg = {}
    // if (selectValue !== undefined) {
    //   cfg.value = selectValue
    // }
    // console.log(props)
    const extraCfg = {}
    if (currency) {
      extraCfg.formatter = (v) => {
        // console.log(this.state.focused)
        // console.log(this.state.value)
        // const nVal = `${v}`
        // return nVal === ''
        //   ? ''
        //   : `$ ${nVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        // console.log('formatter', v, nVal)
        if (v === '') return ''
        if (!this.state.focused) {
          return numeral(v).format('$0,0.00')
        } /* else if (nVal.indexOf('.') > 0) {
          return this.state.value
        }
        return numeral(v).format('$0,0')*/
        return v
      }
      extraCfg.parser = (v) => {
        // console.log(value)
        if (typeof v === 'number') return v
        return v.replace(/\$\s?|(,*)/g, '')
        if (value === '' || value === undefined) return ''
        console.log('parser', value)

        return numeral(value).value()
      }

      extraCfg.precision = 2
    }
    return (
      <div style={{ width: '100%' }} {...props}>
        <InputNumber
          className={classnames(classes.container)}
          onChange={this.handleValueChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          value={this.state.value}
          {...extraCfg}
          {...restProps}
          // formatter={this.handleFormatter}
          // parser={this.handleParser}
        />
      </div>
    )
  }

  render () {
    const { classes, onChange, form, field, ...restProps } = this.props
    const labelProps = {
      shrink:
        !(this.state.value === undefined || this.state.value === '') ||
        this.state.shrink,
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdNumberInput' })(AntdNumberInput)
