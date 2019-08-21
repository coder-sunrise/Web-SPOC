import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import BG from '@material-ui/core/ButtonGroup'
import classnames from 'classnames'

const styles = () => ({
  buttonMargin: {
    margin: '1px !important',
  },
})

const ButtonGroup = ({
  options,
  disabled = false,
  defaultValue = '',
  classes,
}) => {
  const [
    selectedValue,
    setSelectedValue,
  ] = useState(defaultValue)

  const handleClick = (value) => () => {
    setSelectedValue(value)
  }

  const buttonComponent = options.map((op, index) => {
    // if (op.value === selectedValue) {
    //   return (
    //     <Button
    //       key={index}
    //       className={classes.buttonMargin}
    //       color='primary'
    //       disabled={disabled}
    //       onClick={handleClick(op.value)}
    //     >
    //       {op.label}
    //     </Button>
    //   )
    // }
    return (
      <Button
        key={index}
        // className={classnames({
        //   // [classes.buttonMargin]: true,
        //   [classes.firstButton]: index === 0,
        //   [classes.lastButton]: index === options.length - 1,
        // })}
        disabled={disabled}
        color='primary'
        onClick={handleClick(op.value)}
      >
        {op.label}
      </Button>
    )
  })

  return (
    <BG size='small' aria-label='small outlined button group'>
      {buttonComponent}
    </BG>
  )
}
ButtonGroup.propTypes = {
  options: PropTypes.array.isRequired,
}
export default withStyles(styles)(ButtonGroup)
