import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
// ant
import { Input, Select } from 'antd'
import { extendFunc, currencyFormat } from '@/utils/utils'

import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import AntdWrapper from './AntdWrapper'

const Option = Select.Option
const STYLES = (theme) => {
  return {
    ...inputStyle(theme),
    container: {
      width: '100%',
    },
    control: {
      '& .ant-form-item': {
        paddingTop: '24px',
        transformOrigin: 'top left',
      },
    },
    selectContainer: {
      width: '100%',
      '& > div': {
        // erase all border, and boxShadow
        border: 'none',
        boxShadow: 'none !important',
        borderRadius: 0,
        borderBottom: '1px solid',
        marginLeft: 5,
        marginRight: 5,
      },
      '& .ant-select-selection--multiple': {
        // to match the same line
        // with ant-select-select--single
        paddingBottom: 0,
      },
      '& .ant-select-selection > div': {
        marginLeft: 0,
        fontSize: '1rem',
        fontWeight: 400,
        paddingTop: 3,
      },
    },
    // label: {
    //   '& .ant-form-item-label': {
    //     pointerEvents: 'none',
    //     position: 'absolute',
    //     top: 4,
    //     left: 5,
    //     zIndex: 999,
    //     paddingBottom: 0,
    //     transform: 'translate(0, 28px) scale(1)',
    //   },
    //   '& .ant-form-item-label > label': {
    //     color: 'rgba(0, 0, 0, 0.54)',
    //     fontSize: '1rem',
    //   },
    // },
    // labelFocused: {
    //   '& .ant-form-item-label > label': {
    //     color: theme.palette.primary.main,
    //   },
    // },
    // labelShrink: {
    //   '& .ant-form-item-label': {
    //     transform: 'translate(0, 5px) scale(0.8)',
    //     transformOrigin: 'top left',
    //   },
    // },
    // labelAnimation: {
    //   '& .ant-form-item-label': {
    //     transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
    //   },
    // },
    clearButton: {
      position: 'absolute',
      top: '-4px',
      right: '-5px',
    },
  }
}

class AntdInput extends React.PureComponent {
  static propTypes = {
    // conditionally required
    name: (props, propName, componentName) => {
      const { onChange } = props
      if (onChange && props[propName] === undefined)
        return new Error(
          `prop { name } is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    value: (props, propName, componentName) => {
      const { onChange } = props
      if (onChange && props[propName] === undefined)
        return new Error(
          `prop ${propName} is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    // optional props
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.string,
    size: PropTypes.string,
  }

  static defaultProps = {
    label: 'Select',
    loading: false,
    disabled: false,
    size: 'default',
  }

  state = {
    shrink: false,
  }

  handleValueChange = (value) => {
    const { form, field, onChange } = this.props
    if (form && field) {
      form.setFieldValue(field.name, value === undefined ? '' : value)
    }

    if (onChange) {
      const { name } = this.props
      onChange(name, value)
    }
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    this.setState({ shrink: false })
  }

  render () {
    const { shrink } = this.state
    const {
      classes,
      disabled,
      form,
      field,
      label,
      multiple,
      options,
      value,
      loading,
      size,
      children,
      ...restProps
    } = this.props

    return (
      <AntdWrapper {...this.props}>
        <Select
          defaultValue='lucy'
          style={{ width: 120 }}
          onChange={(e) => {
            console.log(e)
          }}
          {...restProps}
        >
          <Option value='jack'>Jack</Option>
          <Option value='lucy'>Lucy</Option>
          <Option value='disabled' disabled>
            Disabled
          </Option>
          <Option value='Yiminghe'>yiminghe</Option>
        </Select>
      </AntdWrapper>
    )
  }
}

export default withStyles(STYLES, { name: 'AntdInput' })(AntdInput)
