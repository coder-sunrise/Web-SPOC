import React from 'react'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormLabel, Checkbox, FormControlLabel } from '@material-ui/core'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'
import { control } from '@/components/Decorator'

@control()
class CheckboxGroup extends React.Component {
  state = {}

  constructor (props) {
    super(props)
    const {
      options = [],
      valueField = 'value',
      field,
      value,
      defaultValue,
    } = props
    const v = {}

    options.forEach((o) => {
      v[`${o[valueField]}`] = false
    })
    if (field && Array.isArray(field.value)) {
      field.value.forEach((e) => {
        v[`${e}`] = true
      })
    } else if (value || defaultValue) {
      ;(value || defaultValue).forEach((e) => {
        v[`${e}`] = true
      })
    }
    this.state = v
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { options, field, value, valueField = 'value' } = nextProps
    const v = preState
    // console.log(value)
    if (field && Array.isArray(field.value)) {
      options.forEach((o) => {
        v[`${o[valueField]}`] = false
      })
      field.value.forEach((e) => {
        v[`${e}`] = true
      })

      return v
    }
    if (value) {
      options.forEach((o) => {
        v[`${o[valueField]}`] = false
      })
      value.forEach((e) => {
        v[`${e}`] = true
      })
      return v
    }
    // console.log(value)
    // if (value) {
    //   return {
    //     selectedValue: value || [],
    //   }
    // }
    return null
  }

  handleChange = (name) => (event) => {
    // console.log(event.target.value)
    const newVal = {
      [name]: event.target.checked,
    }
    this.setState(newVal)
    const newSt = {
      ...this.state,
      ...newVal,
    }
    // console.log(newSt)
    const { form, field, onChange, onSelectedChange } = this.props
    const v = {
      target: {
        value: Object.keys(newSt)
          .map((o) => ({
            v: o,
            selected: newSt[o],
          }))
          .filter((n) => n.selected)
          .map((n) => n.v),
      },
    }
    if (form && field) {
      v.target.name = field.name
      field.onChange(v, newVal)
    }
    if (onChange) {
      onChange(v, newVal)
    }
    // let { selectedValue = [] } = this.state
    // let newSv = selectedValue.slice()
    // if (selectedValue.find((o) => o === event.target.value)) {
    //   newSv = selectedValue.filter((o) => o !== event.target.value)
    // } else {
    //   newSv.push(event.target.value)
    // }
    // this.setState({ selectedValue: newSv })
  }

  getComponent = ({ inputRef, onChange, className, ...props }) => {
    const { state } = this
    const {
      classes,
      options = [],
      field,
      form,
      vertical,
      disabled,
      valueField = 'value',
      textField = 'label',
      labelClass,
      ...resetProps
    } = this.props
    return (
      <div
        className={classnames({
          [className]: true,
          'checkbox-container': true,
        })}
        style={{ width: '100%', height: 'auto' }}
        {...props}
      >
        {options.map((o) => {
          const v = `${o[valueField]}`
          // console.log(v)
          // const checked = .selectedValue.find((m) => m === v)
          return (
            <div
              className={`${classes.checkboxAndRadio} ${vertical
                ? ''
                : classes.checkboxAndRadioHorizontal}`}
              key={v}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state[v]}
                    onChange={this.handleChange(v)}
                    value={v}
                    color='primary'
                    disabled={o.disabled || disabled}
                    // icon={
                    //   <FiberManualRecord className={classes.uncheckedIcon} />
                    // }
                    // checkedIcon={
                    //   <FiberManualRecord className={classes.checkedIcon} />
                    // }
                    // classes={{
                    //   checked: classes.checked,
                    //   root: classes.checkRoot,
                    // }}
                  />
                }
                // classes={{
                //   root: true,
                // }}
                label={o[textField]}
              />
            </div>
          )
        })}
      </div>
    )
  }

  render () {
    const { classes, form, field, onChange, ...restProps } = this.props
    // console.log('check', restProps)
    return (
      <CustomInput
        inputComponent={this.getComponent}
        labelProps={{
          shrink: true,
        }}
        noUnderline
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        {...restProps}
        // value={this.state.selectedValue}
      />
    )
  }
}

CheckboxGroup.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(CheckboxGroup)
