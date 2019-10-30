import React from 'react'
import classnames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import {
  FormLabel,
  Checkbox as MUICheckbox,
  Switch,
  FormControlLabel,
} from '@material-ui/core'
import { control } from '@/components/Decorator'

@control()
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
        checked: !!field.value,
      }
    }
    return null
  }

  getCheckboxComponent = ({
    inputRef,
    onChange: inputOnChange,
    className,
    ...props
  }) => {
    const {
      classes,
      isSwitch,
      field,
      mode = 'input',
      label,
      labelPlacement = 'end',
      form,
      simple,
      controlStyle,
      onChange,
      notCentered = false,
      disabled,
      ...resetProps
    } = this.props
    const opts = {
      color: 'primary',
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
          onChange({ target: { value: checked } })
        }
      },
      disabled,
      checked: this.state.checked,
      // ...resetProps,
    }
    const style = { margin: '0 auto' }
    return (
      <div
        className={classnames({
          [className]: true,
          'checkbox-container': true,
        })}
        style={{ width: '100%' }}
        {...props}
      >
        <FormControlLabel
          style={notCentered ? style : null}
          control={
            isSwitch ? (
              <Switch
                // classes={{
                //   checked: classes.checked,
                //   switchBase: classes.switchBase,
                //   root: classes.switchRoot,
                // }}
                {...opts}
              />
            ) : (
              <MUICheckbox
                checked={this.state.checked}
                // classes={{
                //   checked: classes.checked,
                //   root: classes.checkRoot,
                // }}
                {...opts}
              />
            )
          }
          // classes={{
          //   root: classes.labelRoot,
          // }}
          labelPlacement={labelPlacement}
          label={label}
        />
      </div>
    )
  }

  render () {
    const { label, inputLabel, mode = 'input', ...restProps } = this.props
    const { simple } = restProps

    return (
      <CustomInput
        label={inputLabel}
        inputComponent={this.getCheckboxComponent}
        noUnderline
        labelProps={{
          shrink: true,
        }}
        preventDefaultChangeEvent
        {...restProps}
      />
    )
  }
}

Checkbox.propTypes = {}

export default Checkbox
