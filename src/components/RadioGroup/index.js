import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormLabel, Radio, FormControlLabel } from '@material-ui/core'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'

class RadioGroup extends React.Component {
  state = {
    selectedValue: this.props.defaultValue,
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { field, value } = nextProps

  //   // if (field) {
  //   //   return {
  //   //     selectedValue: field.value || nextProps.defaultValue,
  //   //   }
  //   // }

  //   if (value) {
  //     return {
  //       selectedValue: value,
  //     }
  //   }
  //   return null
  // }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value })
    const { form, field, onChange } = this.props
    const v = {
      target: {
        value: event.target.value,
        name: field.name,
      },
    }
    if (form && field) {
      field.onChange({
        ...v,
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
                  <Radio
                    checked={state.selectedValue === v}
                    onChange={this.handleChange}
                    value={v}
                    icon={
                      <FiberManualRecord className={classes.radioUnchecked} />
                    }
                    checkedIcon={
                      <FiberManualRecord className={classes.radioChecked} />
                    }
                    classes={{
                      checked: classes.radio,
                      root: classes.radioRoot,
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

RadioGroup.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(RadioGroup)
