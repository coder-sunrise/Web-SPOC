import React from 'react'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormLabel, Radio, FormControlLabel } from '@material-ui/core'
import { Formik, Field } from 'formik'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'
import { control } from '@/components/Decorator'

@control()
class RadioGroup extends React.Component {
  state = {
    selectedValue: this.props.defaultValue || '',
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { field, value } = nextProps
    // console.log(nextProps)
    if (field) {
      return {
        selectedValue: field.value || '',
      }
    }

    if (value) {
      return {
        selectedValue: value || '',
      }
    }
    return null
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value })
    const { form, field, onChange } = this.props
    const v = {
      target: {
        value: event.target.value,
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
    console.log(inputClass)
    return (
      <div
        className={classnames({
          [className]: true,
          'checkbox-container': true,
        })}
        style={{ width: '100%', height: 'auto' }}
        {...props}
      >
        {options.map((o, i) => {
          const v = `${o[valueField]}`

          return (
            <div
              className={`${classes.checkboxAndRadio} ${vertical
                ? classes.vertical
                : classes.checkboxAndRadioHorizontal}`}
              key={v}
            >
              <FormControlLabel
                control={
                  <Radio
                    checked={this.state.selectedValue === v}
                    onChange={this.handleChange}
                    color='primary'
                    value={v}
                    disabled={disabled}
                    // icon={
                    //   <FiberManualRecord className={classes.radioUnchecked} />
                    // }
                    // checkedIcon={
                    //   <FiberManualRecord className={classes.radioChecked} />
                    // }
                    className={classnames({
                      [inputClass]: true,
                    })}
                  />
                }
                // classes={{
                //   label: classes.label,
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
    const { classes, ...restProps } = this.props
    // console.log(this.props)
    // console.log(this.state.selectedValue)
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
