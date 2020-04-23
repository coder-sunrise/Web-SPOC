import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Undo from '@material-ui/icons/Undo'
// common components
import { Button, Popover, SizeContainer, Tooltip } from '@/components'

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
  onCancelClick,
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  const toggleVisibleChange = () => setShow(!show)

  const handleCancelClick = () => {
    toggleVisibleChange()
    if (onCancelClick) onCancelClick(index)
  }

  const onConfirmClick = () => {
    onConfirmDelete(index, toggleVisibleChange)
    // toggleVisibleChange()
  }

  return (
    <Popover
      title={title}
      trigger='click'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      visible={show}
      onVisibleChange={toggleVisibleChange}
      content={
        <div className={classes.popoverContainer}>
          <p className={classes.popoverMessage}>{contentText}</p>
          <SizeContainer size='sm'>
            {show && <div style={{ marginRight: 8 }}>{extraCmd}</div>}
          </SizeContainer>
          <Button size='sm' color='danger' onClick={handleCancelClick}>
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
          <Undo />
        </Button>
      </Tooltip>
    </Popover>
  )
}

export default withStyles(styles, { name: 'DeleteWithPopover' })(
  DeleteWithPopover,
)
