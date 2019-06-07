import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import InputAdornment from '@material-ui/core/InputAdornment'
import { DateRange, Check } from '@material-ui/icons'
import BaseInput from 'mui-pro-components/CustomInput/BaseInput'

import classNames from 'classnames'
import {
  FormLabel,
  Switch as MUICheckbox,
  FormControlLabel,
} from '@material-ui/core'

// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime'
import moment from 'moment'

import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'

class Switch extends React.Component {
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
    const { classes, field, label, form, simple, ...resetProps } = this.props
    return (
      <FormControlLabel
        control={
          <MUICheckbox
            tabIndex={-1}
            // checkedIcon={<Check />} //className={classes.checkedIcon}
            onChange={(event, checked) => {
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
            }}
            // icon={<Check />} //className={classes.uncheckedIcon}
            classes={{
              checked: classes.checked,
              root: classes.checkRoot,
            }}
            {...resetProps}
            checked={this.state.checked}
          />
        }
        label={label}
      />
    )
  }

  render () {
    const { inputProps = {}, classes, label, ...restProps } = this.props
    return (
      <BaseInput inputComponent={this.getCheckboxComponent} {...restProps} />
    )
  }
}

Switch.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(Switch)
