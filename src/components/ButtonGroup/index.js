import React, { useState } from 'react'
import { Button } from '@/components'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

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
  const [ selectedValue, setSelectedValue ] = useState(defaultValue)

  const handleClick = (value) => () => {
    setSelectedValue(value)
  }

  const buttonComponent = options.map((op, index) => {
    if (op.value === selectedValue) {
      return (
        <Button
          key={index}
          className={classes.buttonMargin}
          color='primary'
          disabled={disabled}
          onClick={handleClick(op.value)}
        >
          {op.label}
        </Button>
      )
    }
    return (
      <Button
        key={index}
        className={classes.buttonMargin}
        disabled={disabled}
        onClick={handleClick(op.value)}
      >
        {op.label}
      </Button>
    )
  })

  return <div>{buttonComponent}</div>
}
ButtonGroup.propTypes = {
  options: PropTypes.array.isRequired,
}
export default withStyles(styles)(ButtonGroup)
