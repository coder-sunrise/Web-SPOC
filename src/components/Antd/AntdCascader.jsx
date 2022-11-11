import React, { Component } from 'react'
import { CustomInput, Tooltip } from '@/components'
import { Cascader } from 'antd'
import { control } from '@/components/Decorator'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
const STYLES = theme => ({
  cascaderContainer: {
    width: '100%',
    '& > .ant-select-single > div > .ant-select-selection-item': {
      position: 'absolute',
      left: '0',
      top: '5px',
    },
  },
  cascader: {
    lineHeight: '1rem',
    width: '100%',
    '& > .ant-select-selector': {
      height: '26px !important',
      marginBottom: '3px',
    },
  },
})
class AntdCascader extends Component {
  constructor
  state = {
    shrink: false,
    value:
      this.props.field.value !== undefined && this.props.field.value.length > 0
        ? this.props.field.value
        : this.props.value || this.props.defaultValue || [],
  }

  handleChange = (value, selectedOptions) => {
    let { form, field } = this.props
    this.setState({ value })
    if (form && field) {
      form.setFieldValue(field.name, value)
    }
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    this.setState({ shrink: false })
  }

  getComponent = ({ inputRef, ...props }) => {
    let { options, classes } = this.props
    return (
      <div {...props} className={classes.cascaderContainer}>
        <Cascader
          className={classnames([classes.cascader])}
          onChange={this.handleChange}
          bordered={false}
          value={this.state.value}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          maxTagCount={0}
          maxTagPlaceholder={v =>
            v.length > 1 ? `${v.length} options selected` : v[0]?.label
          }
          suffixIcon={<></>}
          {...this.props}
        />
      </div>
    )
  }

  render() {
    let { shrink, value } = this.state
    let labelProps = {
      shrink: !!(shrink || value?.length),
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        {...this.props}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdCascader' })(AntdCascader)
