import React, { useState } from 'react'
import { Chip, withStyles } from '@material-ui/core'
import { Button, Popover } from '@/components'

const styles = (theme) => ({
  popoverContainer: {
    textAlign: 'center',
  },
  popoverMessage: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
})
const AttachmentChipWithPopover = ({
  classes,
  onConfirmDelete,
  onClickAttachment,
  isReadOnly,
  attachment,
  title,
  contentText,
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  const toggleVisibleChange = () => setShow(!show)
  return (
    <span>
      <Chip
        key={attachment.id}
        size='small'
        variant='outlined'
        label={attachment.fileName}
        color={attachment.id ? 'primary' : ''}
        onClick={() => onClickAttachment(attachment)}
        onDelete={toggleVisibleChange}
        className={classes.chip}
      />
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
            <Button size='sm' color='danger' onClick={toggleVisibleChange}>
              Cancel
            </Button>
            <Button
              size='sm'
              color='primary'
              onClick={() => {
                if (!isReadOnly) {
                  toggleVisibleChange()
                  onConfirmDelete(attachment.fileIndexFK, attachment.id)
                }
              }}
            >
              Confirm
            </Button>
          </div>
        }
      />
    </span>
  )
}

export default withStyles(styles, { name: 'AttachmentChipWithPopover' })(
  AttachmentChipWithPopover,
)
