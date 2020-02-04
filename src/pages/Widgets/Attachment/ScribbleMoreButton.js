import React, { useState } from 'react'
// material ui
import More from '@material-ui/icons/MoreVert'
import {
  MenuList,
  Popper,
  Paper,
  ClickAwayListener,
  MenuItem,
} from '@material-ui/core'
import { Button, Tooltip } from '@/components'

const MoreButton = ({ disabled, handleResetClick, handleRestoreClick }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const onClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickAway = () => {
    setAnchorEl(null)
  }

  const onResetClick = () => {
    // handleResetClick()
    handleClickAway()
  }

  const onRestoreClick = () => {
    // handleRestoreClick()
    handleClickAway()
  }

  const open = Boolean(anchorEl)
  return (
    <React.Fragment>
      <Button
        justIcon
        color='primary'
        size='sm'
        onClick={onClick}
        disabled={disabled}
      >
        <More />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        disablePortal
        placement='bottom-end'
        style={{
          zIndex: 1000,
          width: 100,
          left: -63,
        }}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClickAway}>
            <MenuList role='menu'>
              <Tooltip title='Insert into Clinical Note' placement='right'>
                <MenuItem onClick={onRestoreClick}>Insert To Note</MenuItem>
              </Tooltip>
              <Tooltip title='Delete Scribble Note' placement='right'>
                <MenuItem onClick={onResetClick}>Delete</MenuItem>
              </Tooltip>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </React.Fragment>
  )
}

export default MoreButton
