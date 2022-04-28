import React from 'react'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormLabel, FormControlLabel } from '@material-ui/core'
import { Formik, Field } from 'formik'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'
import { control } from '@/components/Decorator'
import { Radio, Space } from 'antd'

@control()
class RadioGroup extends React.Component {
  state = {
    selectedValue: this.props.defaultValue,
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { field, value } = nextProps
    if (field) {
      return {
        selectedValue: field.value,
      }
    }

    if (value) {
      return {
        selectedValue: value,
      }
    }
    return null
  }

  handleChange = value => {
    let newValue = value
    if (this.state.selectedValue === newValue) {
      const { isAllowReset = false } = this.props
      if (!isAllowReset) return
      newValue = undefined
    }
    this.setState({ selectedValue: newValue })
    const { form, field, onChange } = this.props
    const v = {
      target: {
        value: newValue,
        name: field ? field.name : '',
      },
    }
    if (form && field) {
      field.onChange(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  getComponent = ({ inputRef, onChange, className, ...props }) => {
    const { state } = this
    const {
      classes,
      options = [],
      field,
      form,
      vertical,
      valueField = 'value',
      textField = 'label',
      disabled,
      inputClass,
      ...resetProps
    } = this.props
    return (
      <div
        className={classnames({
          [className]: true,
          'checkbox-container': true,
        })}
        style={{ width: '100%', height: 'auto' }}
        //{...props}
      >
        <Radio.Group value={this.state.selectedValue} disabled={disabled}>
          <Space direction={vertical ? 'vertical' : 'horizontal'}>
            {options.map(o => {
              return (
                <Radio
                  value={o[valueField]}
                  onClick={() => {
                    this.handleChange(o[valueField])
                  }}
                >
                  {o[textField]}
                </Radio>
              )
            })}
          </Space>
        </Radio.Group>
      </div>
    )
  }

  render() {
    const { classes, ...restProps } = this.props
    return (
      <CustomInput
        inputComponent={this.getComponent}
        noUnderline
        labelProps={{
          shrink: true,
        }}
        {...restProps}
        value={this.state.selectedValue}
      />
    )
  }
}

RadioGroup.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(RadioGroup)
