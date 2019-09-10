import React from 'react'
import PropTypes from 'prop-types'
// material ui
import { withStyles } from '@material-ui/core'
// style
import CardStyle from './style'

const FieldSet = ({ classes, title, size, disabled, children }) => {
  // TODO: enhance -> padding and margin for size = sm || lg
  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <fieldset className={classes.fieldset} disabled={disabled}>
        <legend className={classes.legend}>{title}</legend>
        {children}
      </fieldset>
    </div>
  )
  // return (
  //   <TextField
  //     label={title}
  //     margin='normal'
  //     variant='outlined'
  //     fullWidth
  //     InputLabelProps={{
  //       shrink: true,
  //       focused: false,
  //     }}
  //     InputProps={{
  //       inputComponent: ({ inputRef, ...ps }) => {
  //         return (
  //           <div style={{ width: '100%', height: 'auto' }} {...ps}>
  //             {children}
  //           </div>
  //         )
  //       },
  //     }}
  //   />
  // )
}

FieldSet.propTypes = {
  size: PropTypes.oneOf([
    'sm',
  ]),
  title: PropTypes.string,
  children: PropTypes.object,
}

export default withStyles(CardStyle, { name: 'CommonCardComponent' })(FieldSet)
