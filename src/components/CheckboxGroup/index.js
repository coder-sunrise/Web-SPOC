import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormLabel, Checkbox, FormControlLabel } from '@material-ui/core'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'

class CheckboxGroup extends React.Component {
  state = {}

  constructor (props) {
    super(props)
    const { options = [], valueField = 'value' } = props
    const v = {}
    options.forEach((o) => {
      v[`${o[valueField]}`] = false
    })
    this.state = v
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { options, field, value, valueField = 'value' } = nextProps
    const v = preState
    // console.log(field.value)
    if (field) {
      options.forEach((o) => {
        v[`${o[valueField]}`] = false
      })
      ;(field.value || []).forEach((e) => {
        v[`${e}`] = true
      })
      return v
    }
    if (value) {
      return {
        selectedValue: value || [],
      }
    }
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
      field.onChange(v)
    } else if (onChange) {
      onChange(v)
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

  getComponent = ({ inputRef, onChange, ...props }) => {
    const { state } = this
    const {
      classes,
      options = [],
      field,
      form,
      vertical,
      valueField = 'value',
      textField = 'label',
      labelClass,
      ...resetProps
    } = this.props
    return (
      <div style={{ width: '100%', height: 'auto' }} {...props}>
        {options.map((o) => {
          const v = `${o[valueField]}`
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
    const { classes, ...restProps } = this.props
    return (
      <CustomInput
        inputComponent={this.getComponent}
        labelProps={{
          shrink: true,
        }}
        noUnderline
        {...restProps}
        // value={this.state.selectedValue}
      />
    )
  }
}

CheckboxGroup.propTypes = {}

export default withStyles(regularFormsStyle, { withTheme: true })(CheckboxGroup)
