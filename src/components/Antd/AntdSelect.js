import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import Input from '@material-ui/core/Input'

// ant
import { Select } from 'antd'
import AntdWrapper from './AntdWrapper'
import { CustomInputWrapper, BaseInput, CustomInput } from '@/components'

import { extendFunc } from '@/utils/utils'

const STYLES = () => {
  return {
    dropdownMenu: {
      zIndex: 1310,
    },
    selectContainer: {
      width: '100%',
      boxSizing: 'content-box',
      lineHeight: '1rem',
      color: 'currentColor',

      '& > div': {
        // erase all border, and boxShadow
        // height: 31,
        border: 'none',
        boxShadow: 'none !important',
        borderRadius: 0,
        // borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
      },
      '& .ant-select-selection': {
        background: 'none',
      },
      '& .ant-select-selection__rendered': {
        lineHeight: 'inherit',
        marginRight: 0,
      },
      '& .ant-select-selection--single': {
        height: '100%',
        lineHeight: '1em',
      },
      '& .ant-select-selection--multiple': {
        height: '100%',
        minHeight: '20px',
        // to match the same line
        // with ant-select-select--single
        paddingBottom: 0,
        position: 'relative',
        top: -4,
      },
      '& .ant-select-selection > div': {
        marginLeft: 0,
        // fontSize: '1rem',
        // fontWeight: 400,
        // paddingTop: 3,
      },
    },
  }
}

class AntdSelect extends React.PureComponent {
  static propTypes = {
    // required props
    options: PropTypes.array,
    // optional props
    label: PropTypes.string,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    renderDropdown: PropTypes.func,
  }

  static defaultProps = {
    options: [],
    label: undefined,
    labelField: 'name',
    valueField: 'value',
    disabled: false,
    size: 'default',
  }

  constructor (props) {
    super(props)
    const { form, field, mode } = props
    this.state = {
      shrink: false,
      value: form && field ? field.value : props.value || props.defaultValue,
    }
  }

  componentWillReceiveProps (nextProps) {
    const { field, value } = nextProps
    if (field) {
      this.setState({
        value: field.value,
      })
    } else if (value) {
      this.setState({
        value,
      })
    }
  }

  handleFilter = (input, option) => {
    try {
      return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    if (this.state.value === undefined || this.state.value.length === 0) {
      this.setState({ shrink: false })
    }
  }

  handleValueChange = (val) => {
    const { form, field, all, mode, onChange } = this.props
    let newVal = val
    if (mode === 'multiple') {
      if (val.indexOf(all) > 0) {
        newVal = [
          all,
        ]
      } else if (val.indexOf(all) === 0) {
        newVal = _.reject(newVal, (v) => v === all)
      }
    }
    // console.log(val)
    // console.log(returnValue)
    if (form && field) {
      form.setFieldValue(field.name, newVal)
      form.setFieldTouched(field.name, true)
    }
    if (onChange) {
      onChange(newVal)
    }
    this.setState({
      shrink: newVal !== undefined,
      value: newVal,
    })
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      valueField,
      labelField,
      options,
      classes,
      defaultValue,
      renderDropdown,
      onChange,
      onFocus,
      onBlur,
      allowClear = true,
      style,
      dropdownMatchSelectWidth = false,
      ...restProps
    } = this.props
    const { form, field, value } = restProps

    const newOptions = options.map((s) => ({
      ...s,
      value: s[valueField],
      label: s[labelField],
    }))
    const cfg = {
      value: this.state.value,
    }
    // console.log(newOptions, this.state.value, restProps)
    return (
      <div style={{ width: '100%' }} {...props}>
        <Select
          className={classnames(classes.selectContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          showSearch
          // defaultOpen
          onChange={this.handleValueChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          defaultValue={defaultValue}
          filterOption={this.handleFilter}
          allowClear={allowClear}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          {...cfg}
          {...restProps}
        >
          {renderDropdown !== undefined ? (
            newOptions.map((option) => renderDropdown(option))
          ) : (
            newOptions.map((option) => (
              <Select.Option
                key={option.value}
                title={option.name}
                value={option.value}
                disabled={!!option.disabled}
              >
                {option.name}
              </Select.Option>
            ))
          )}
        </Select>
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, ...restProps } = props
    const { value } = this.state
    const labelProps = {}
    if (!mode || mode === 'default') {
      labelProps.shrink = value !== undefined || this.state.shrink
    } else {
      labelProps.shrink =
        (value !== undefined && value !== '' && value.length > 0) ||
        this.state.shrink
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

export default withStyles(STYLES, { name: 'AntdSelect' })(AntdSelect)
