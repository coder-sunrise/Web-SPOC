import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
// common components
import { Button, Popover, Tooltip } from '@/components'

const styles = (theme) => ({
  popoverContainer: {
    textAlign: 'center',
  },
  popoverMessage: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
})

const DeleteWithPopover = ({
  classes,
  disabled,
  index,
  title = 'Remove this scheme',
  contentText = 'Confirm to remove this scheme?',
  extraCmd,
  onConfirmDelete,
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  const toggleVisibleChange = () => setShow(!show)

  const onCancelClick = () => toggleVisibleChange()

  const onConfirmClick = () => {
    onConfirmDelete(index)
    toggleVisibleChange()
  }

  return (
    <Popover
      title={title}
      trigger='click'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      visible={show}
      onVisibleChange={toggleVisibleChange}
      content={
        <div className={classes.popoverContainer}>
          <p className={classes.popoverMessage}>{contentText}</p>
          <div>{extraCmd}</div>
          <Button size='sm' color='danger' onClick={onCancelClick}>
            Cancel
          </Button>
          <Button size='sm' color='primary' onClick={onConfirmClick}>
            Confirm
          </Button>
        </div>
      }
    >
      <Tooltip title={title}>
        <Button justIcon color='danger' disabled={disabled}>
          <Delete />
        </Button>
      </Tooltip>
    </Popover>
  )
}

export default withStyles(styles, { name: 'DeleteWithPopover' })(
  DeleteWithPopover,
)
