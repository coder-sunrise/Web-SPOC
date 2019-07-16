import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { Button } from '@/components'

const style = () => ({
  leftAlign: {
    justifyContent: 'start',
  },
})

const MenuButtonBase = ({ classes, id, onClick, Icon, label, disabled }) => {
  return (
    <Button
      className={classes.leftAlign}
      block
      link
      noUnderline
      disabled={disabled}
      size='sm'
      color='primary'
      id={id}
      onClick={onClick}
    >
      <Icon />
      {label}
    </Button>
  )
}

export default withStyles(style, { name: 'MenuButton' })(MenuButtonBase)
