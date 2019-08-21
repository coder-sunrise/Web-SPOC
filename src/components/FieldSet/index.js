import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// custom components
import { Card, CardBody } from '@/components'
// style
import CardStyle from './style'

const FieldSet = ({ classes, title, size, children }) => {
  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <fieldset className={classes.fieldset}>
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
