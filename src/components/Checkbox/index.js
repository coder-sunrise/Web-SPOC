import React from 'react'
import classnames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { Tooltip } from '@/components'
import {
  FormLabel,
  Checkbox as MUICheckbox,
  Switch,
  FormControlLabel,
} from '@material-ui/core'
import { control } from '@/components/Decorator'

const styles = () => ({
  root: {
    width: 'unset !important',
  },
})

@control()
class Checkbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // value:this.props.field?getValue(this.props.field.value):'',
      checked: props.defaultChecked,
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
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
      tooltip,
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
        style={{ width: '100%', ...controlStyle }}
        {...props}
      >
        <Tooltip title={tooltip}>
          <FormControlLabel
            style={{
              fontSize: 14,
              ...(notCentered ? style : null),
            }}
            classes={{
              root: classes.root,
            }}
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
                  style={{ position: 'relative', top: -1 }}
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
        </Tooltip>
      </div>
    )
  }

  render() {
    const {
      label,
      inputLabel,
      mode = 'input',
      classes,
      ...restProps
    } = this.props
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

export default withStyles(styles)(Checkbox)
