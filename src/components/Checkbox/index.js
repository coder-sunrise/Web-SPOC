import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import BaseInput from 'mui-pro-components/CustomInput/BaseInput'

import {
  FormLabel,
  Checkbox as MUICheckbox,
  Switch,
  FormControlLabel,
} from '@material-ui/core'

import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'

class Checkbox extends React.Component {
  state = {
    // value:this.props.field?getValue(this.props.field.value):'',
    checked: false,
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { checked, field } = nextProps
    if (checked !== undefined && preState.checked !== checked) {
      return {
        checked,
      }
    }
    if (field) {
      return {
        checked: field.value,
      }
    }
    return null
  }

  getCheckboxComponent = () => {
    const {
      classes,
      isSwitch,
      field,
      label,
      form,
      simple,
      controlStyle,
      onChange,
      notCentered = false,
      ...resetProps
    } = this.props
    // console.log(label)
    const opts = {
      tabIndex: -1,
      // checkedIcon={<Check />} //className={classes.checkedIcon}
      onChange: (event, checked) => {
        this.setState({
          checked,
        })
        if (field) {
          field.onChange({
            target: {
              value: checked,
              name: field.name,
            },
          })
        }
        if (onChange) {
          onChange(field.name, checked)
        }
      },
      checked: this.state.checked,
      ...resetProps,
    }
    const style = { margin: '0 auto' }
    return (
      <FormControlLabel
        style={notCentered ? style : null}
        control={
          isSwitch ? (
            <Switch
              classes={{
                checked: classes.checked,
                switchBase: classes.switchBase,
                root: classes.switchRoot,
              }}
              {...opts}
            />
          ) : (
            <MUICheckbox
              classes={{
                checked: classes.checked,
                root: classes.checkRoot,
              }}
              {...opts}
            />
          )
        }
        label={label}
      />
    )
  }

  render () {
    const { classes, label, ...restProps } = this.props
    const { simple } = restProps
    return (
      <BaseInput
        label={simple ? '' : ' '}
        inputComponent={this.getCheckboxComponent}
        noUnderline
        {...restProps}
      />
    )
  }
}

Checkbox.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(Checkbox)
