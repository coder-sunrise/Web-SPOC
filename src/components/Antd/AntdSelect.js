import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
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
      },
      '& .ant-select-selection--multiple': {
        height: '100%',
        // to match the same line
        // with ant-select-select--single
        paddingBottom: 0,
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
    label: 'Select',
    labelField: 'name',
    valueField: 'value',
    disabled: false,
    size: 'default',
  }

  state = {
    shrink: false,
  }

  handleFilter = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    this.setState({ shrink: false })
  }

  handleValueChange = (event) => {
    const { form, field } = this.props
    let returnValue = event

    if (event) {
      returnValue = event.target ? event.target.value : event
    }

    if (form && field) {
      form.setFieldValue(
        field.name,
        returnValue === undefined ? '' : returnValue,
      )
      form.setFieldTouched(field.name, true)
    }
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
      ...restProps
    } = this.props
    const { form, field, value } = restProps

    const newOptions = options.map((s) => ({
      ...s,
      value: s[valueField],
      label: s[labelField],
    }))
    const selectValue = form && field ? field.value : value
    const cfg = {}
    if (selectValue !== undefined) {
      cfg.value = selectValue
    }
    // console.log(selectValue)
    return (
      <div style={{ width: '100%' }} {...props}>
        <Select
          className={classnames(classes.selectContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          allowClear
          showSearch
          // defaultOpen
          onChange={extendFunc(onChange, this.handleValueChange)}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          defaultValue={defaultValue}
          filterOption={this.handleFilter}
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
    const { classes, ...restProps } = this.props
    const { form, field, value } = restProps
    const selectValue = form && field ? field.value : value
    const labelProps = {
      shrink: !!selectValue || this.state.shrink,
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

export default withStyles(STYLES, { name: 'AntdSelect' })(AntdSelect)
