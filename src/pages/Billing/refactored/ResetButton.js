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

const ResetButton = ({ handleResetClick, handleRestoreClick }) => {
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
    handleResetClick()
    handleClickAway()
  }

  const onRestoreClick = () => {
    handleRestoreClick()
    handleClickAway()
  }

  const open = Boolean(anchorEl)
  return (
    <React.Fragment>
      <Button color='primary' size='sm' onClick={onClick}>
        <More />
        More
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
              <Tooltip title='Reset all applied scheme(s)' placement='right'>
                <MenuItem onClick={onResetClick}>Reset</MenuItem>
              </Tooltip>
              <Tooltip
                title='Restore to last saved scheme(s)'
                placement='right'
              >
                <MenuItem onClick={onRestoreClick}>Restore</MenuItem>
              </Tooltip>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </React.Fragment>
  )
}

export default ResetButton
