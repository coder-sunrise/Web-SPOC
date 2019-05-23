import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { Select, Form } from 'antd'

const STYLES = (theme) => {
  return {
    dropdownMenu: {
      zIndex: 1310,
    },
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
        borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
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
    fixSelectContentHeight: {
      '& > div': {
        height: 31,
      },
    },
    label: {
      marginBottom: '0 !important',
      '& .ant-form-item-label': {
        pointerEvents: 'none',
        position: 'absolute',
        top: 4,
        left: 5,
        zIndex: 20,
        paddingBottom: 0,
        transform: 'translate(0, 26px) scale(1)',
      },
      '& .ant-form-item-label > label': {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: '1rem',
      },
    },
    labelFocused: {
      '& .ant-form-item-label > label': {
        color: theme.palette.primary.main,
      },
    },
    labelShrink: {
      '& .ant-form-item-label': {
        transform: 'translate(0, 5px) scale(0.8)',
        transformOrigin: 'top left',
      },
    },
    labelAnimation: {
      '& .ant-form-item-label': {
        transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
      },
    },
  }
}

class AntDSelect extends React.PureComponent {
  static propTypes = {
    // required props
    options: PropTypes.array.isRequired,
    // conditionally required
    name: (props, propName, componentName) => {
      const { handleChange } = props
      if (handleChange && props[propName] === undefined)
        return new Error(
          `prop { name } is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    value: (props, propName, componentName) => {
      const { handleChange } = props
      if (handleChange && props[propName] === undefined)
        return new Error(
          `prop ${propName} is REQUIRED for ${componentName} but not supplied`,
        )
      return ''
    },
    // optional props
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    handleChange: PropTypes.func,
    label: PropTypes.string,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
    size: PropTypes.string,
  }

  static defaultProps = {
    label: 'Select',
    labelField: 'name',
    valueField: 'value',
    loading: false,
    multiple: false,
    disabled: false,
    size: 'default',
  }

  state = {
    shrink: false,
  }

  handleValueChange = (value) => {
    console.log('handlevaluechange', value)
    const { form, field, handleChange } = this.props
    if (form && field) {
      form.setFieldValue(field.name, value)
    }

    if (handleChange) {
      const { name } = this.props
      handleChange(name, value)
    }
  }

  handleVisibleChange = (status) => {
    this.setState({ shrink: status })
  }

  handleFilter = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  render () {
    const { shrink } = this.state
    const {
      labelField,
      valueField,
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
      ...restProps
    } = this.props

    const selectValue = form && field ? field.value : value
    let shouldShrink = shrink || !!selectValue

    if (multiple) {
      if (selectValue) shouldShrink = shrink || selectValue.length !== 0
      else shouldShrink = shrink
    }
    const classForLabel = {
      [classes.label]: true,
      [classes.labelAnimation]: true,
      [classes.labelShrink]: shouldShrink,
      [classes.labelFocused]: shrink,
    }
    const classForSelect = {
      [classes.selectContainer]: true,
      [classes.fixSelectContentHeight]: !multiple,
    }

    const newOptions = options.map((s) => ({
      ...s,
      value: s[valueField],
      label: s[labelField],
    }))

    return (
      <Form layout='vertical' className={classnames(classes.control)}>
        <Form.Item label={label} className={classnames(classForLabel)}>
          <Select
            className={classnames(classForSelect)}
            dropdownClassName={classnames(classes.dropdownMenu)}
            allowClear
            showSearch
            size={size}
            disabled={disabled}
            loading={loading}
            mode={multiple ? 'multiple' : 'default'}
            value={selectValue}
            onDropdownVisibleChange={this.handleVisibleChange}
            filterOption={this.handleFilter}
            onChange={this.handleValueChange}
            {...restProps}
          >
            {newOptions.map((option) => (
              <Select.Option
                key={option.value}
                title={option.name}
                value={option.value}
                disabled={!!options.disabled}
              >
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    )
  }
}

export default withStyles(STYLES, { name: 'AntDesignSelect' })(AntDSelect)
