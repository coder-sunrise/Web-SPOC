import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FiberManualRecord from "@material-ui/icons/FiberManualRecord"

import { withFormik ,Formik, Form, Field,FastField, ErrorMessage } from 'formik'
import { extendFunc } from '@/utils/utils'


// const styles = theme => ({
//   root: {
//     display: 'flex',
//   },
//   formControl: {
//     margin: theme.spacing.unit * 3,
//   },
//   group: {
//     margin: `${theme.spacing.unit}px 0`,
//   },
// })
import customCheckboxRadioSwitch from "mui-pro-jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx"

class RadioButtonsGroup extends React.Component {
 

  render () {
    let { onChange, onBlur, classes, className, label, options=[] ,tipText, help, row,error , field={},form} = this.props
    const {name, value}=field

    if(form){
      const shouldShow=(form.touched[field.name] || form.submitCount)
      if(!error){
        error= shouldShow && !!form.errors[field.name]
      }
      if(error){
        help=shouldShow ? form.errors[field.name]:help
      }
    }

    // console.log(onChange)
// console.log(this.props)
    return (
      // <FormControl error={error} component="fieldset" className={className}>
      //   <FormLabel component="legend">{label}</FormLabel>
      //   <RadioGroup
      //     aria-label={label}
      //     name={name}
      //     onChange={onChange}
      //     onBlur={onBlur}
      //     row={row}
      //   >
      //     {
      //       options.map(o=>{
      //           return <FormControlLabel key={o.value} control={<Radio checked={o.value===value} />} {...o} />
      //       })
      //   }
      //   </RadioGroup>
      //   <FormHelperText>
      //     {helperText || tipText}
      //   </FormHelperText>
      // </FormControl>
      <FormControl error={error} component="fieldset" className={className}>
        <FormLabel className={classes.labelHorizontal} component="legend">{label}</FormLabel>
        <RadioGroup
          aria-label={label}
          name={name}
          onChange={extendFunc(onChange, field.onChange)}
          onBlur={extendFunc(onBlur, field.onBlur)}
          row={row}
        >
          {
          options.map(o=>{
              return <FormControlLabel key={o.value}
                control={<Radio 
                  checked={o.value===value} 
                  icon={
                    <FiberManualRecord
                      className={classes.radioUnchecked}
                    />
                            }
                  checkedIcon={
                    <FiberManualRecord
                      className={classes.radioChecked}
                    />
                            }
                  classes={{
                        checked: classes.radio,
                        root: classes.radioRoot,
                      }}
                />}
                {...o}
              />})
              
          }
        </RadioGroup>
        {help !== undefined ? (
          <FormHelperText>
            {help}
          </FormHelperText>
      ) : null}
      </FormControl>
    )
  }
}

RadioButtonsGroup.propTypes = {
    className: PropTypes.string,
}

export default withStyles(customCheckboxRadioSwitch)(RadioButtonsGroup)