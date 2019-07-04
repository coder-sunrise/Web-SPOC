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
      lineHeight: '1em',
      height: '100%',
      color: 'currentColor',
      borderRadius: 3,
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
    const { form, field } = props
    this.state = {
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

  handleValueChange = (checked) => {
    const { form, field, onChange } = this.props
    if (form && field) {
      form.setFieldValue(field.name, checked)
      form.setFieldTouched(field.name, true)
    }
    if (onChange) {
      onChange(checked)
    }
    this.setState({
      value: checked,
    })
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      defaultValue,
      onChange,
      style,
      form,
      field,
      ...restProps
    } = this.props

    const cfg = {
      checked: this.state.value,
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
