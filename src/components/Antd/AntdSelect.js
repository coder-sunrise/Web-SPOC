import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
// ant
import { Select } from 'antd'

import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import AntdWrapper from './AntdWrapper'

const STYLES = (theme) => {
  return {
    ...inputStyle(theme),
    container: {
      width: '100%',
    },
    selectContainer: {
      width: '100%',
      '& > div': {
        // erase all border, and boxShadow
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
        fontSize: '1rem',
        fontWeight: 400,
        paddingTop: 3,
      },
    },
    control: {},
  }
}

class AntdSelect extends React.PureComponent {
  static propTypes = {
    // required props
    options: PropTypes.array,
    // optional props
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.string,
  }

  static defaultProps = {
    disabled: false,
    size: 'default',
  }

  render () {
    const { options, classes, form, field, value } = this.props

    const selectValue = form && field ? field.value : value

    return (
      <AntdWrapper {...this.props}>
        <Select
          className={classnames(classes.selectContainer)}
          allowClear
          showSearch
          value={selectValue}
        >
          {options.map((option) => (
            <Select.Option
              key={option.value}
              title={option.name}
              value={option.value}
              disabled={!!option.disabled}
            >
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </AntdWrapper>
    )
  }
}

export default withStyles(STYLES, { name: 'AntdSelect' })(AntdSelect)
