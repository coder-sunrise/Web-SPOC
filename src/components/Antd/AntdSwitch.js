import { Switch } from 'antd'
import ErrorOutline from '@material-ui/icons/ErrorOutline'

import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'

// ant
import { CustomInputWrapper, BaseInput, CustomInput } from '@/components'

import { extendFunc } from '@/utils/utils'

const STYLES = () => {
  return {
    switchContainer: {
      boxSizing: 'content-box',
      lineHeight: '1rem',
      color: 'currentColor',
    },
  }
}

class AntdSwitch extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    label: undefined,
    disabled: false,
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
    const { classes, defaultValue, onChange, style, ...restProps } = this.props
    const { form, field, value } = restProps

    const cfg = {
      value: this.state.value,
    }
    // console.log(newOptions, this.state.value, restProps)
    return (
      <div style={{ width: '100%' }} {...props}>
        <Switch
          className={classnames(classes.switchContainer)}
          onChange={this.handleValueChange}
          defaultValue={defaultValue}
          {...cfg}
          {...restProps}
        />
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, ...restProps } = props
    const labelProps = {
      shrink: true,
    }

    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        noUnderline
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdSwitch' })(AntdSwitch)
