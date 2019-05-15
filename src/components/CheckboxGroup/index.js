import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormLabel, Checkbox, FormControlLabel } from '@material-ui/core'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'

class CheckboxGroup extends React.Component {
  state = {
    selectedValue: this.props.defaultValue || [],
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { field, value } = nextProps

    if (field) {
      return {
        selectedValue: field.value || nextProps.defaultValue,
      }
    }
    if (value) {
      return {
        selectedValue: value,
      }
    }
    return null
  }

  handleChange = (event) => {
    let { selectedValue = [] } = this.state
    if (selectedValue.find((o) => o === event.target.value)) {
      selectedValue = selectedValue.filter((o) => o !== event.target.value)
    } else {
      selectedValue.push(event.target.value)
    }
    this.setState({ selectedValue })

    const { form, field, onChange } = this.props
    const v = {
      target: {
        value: selectedValue,
      },
    }
    if (form && field) {
      field.onChange({
        ...v,
        name: field.name,
      })
    } else if (onChange) {
      onChange(v)
    }
  }

  getComponent = () => {
    const { state } = this
    const {
      classes,
      options = [],
      field,
      form,
      vertical,
      valueField = 'value',
      textField = 'label',
      ...resetProps
    } = this.props
    return (
      <div>
        {options.map((o) => {
          const v = `${o[valueField]}`
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
                    checked={state.selectedValue.find((m) => m === v)}
                    onChange={this.handleChange}
                    value={v}
                    // icon={
                    //   <FiberManualRecord className={classes.uncheckedIcon} />
                    // }
                    // checkedIcon={
                    //   <FiberManualRecord className={classes.checkedIcon} />
                    // }
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                }}
                label={o[textField]}
              />
            </div>
          )
        })}
      </div>
    )
  }

  render () {
    const { inputProps = {}, classes, ...restProps } = this.props
    inputProps.inputComponent = this.getComponent
    return (
      <CustomInput
        inputProps={inputProps}
        {...restProps}
        value={this.state.selectedValue}
      />
    )
  }
}

CheckboxGroup.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(CheckboxGroup)
