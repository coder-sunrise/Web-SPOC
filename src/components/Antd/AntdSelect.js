import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { Select } from 'antd'
import AntdWrapper from './AntdWrapper'
import { extendFunc } from '@/utils/utils'

const STYLES = () => {
  return {
    dropdownMenu: {
      zIndex: 1310,
    },
    selectContainer: {
      width: '100%',
      '& > div': {
        // erase all border, and boxShadow
        height: 31,
        border: 'none',
        boxShadow: 'none !important',
        borderRadius: 0,
        borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
      },
      '& .ant-select-selection--multiple': {
        // to match the same line
        // with ant-select-select--single
        paddingBottom: 0,
      },
      '& .ant-select-selection > div': {
        marginLeft: 0,
        // fontSize: '1rem',
        fontWeight: 400,
        paddingTop: 3,
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
    label: 'Select',
    labelField: 'name',
    valueField: 'value',
    disabled: false,
    size: 'default',
  }

  handleFilter = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

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

  render () {
    const {
      valueField,
      labelField,
      options,
      classes,
      defaultValue,
      renderDropdown,
      onChange,
      ...restProps
    } = this.props
    const { form, field, value } = restProps

    const selectValue = form && field ? field.value : value
    const newOptions = options.map((s) => ({
      ...s,
      value: s[valueField],
      label: s[labelField],
    }))

    return (
      <AntdWrapper {...restProps}>
        <Select
          className={classnames(classes.selectContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          allowClear
          showSearch
          onChange={extendFunc(onChange, this.handleValueChange)}
          value={selectValue}
          defaultValue={defaultValue}
          filterOption={this.handleFilter}
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
      </AntdWrapper>
    )
  }
}

export default withStyles(STYLES, { name: 'AntdSelect' })(AntdSelect)
