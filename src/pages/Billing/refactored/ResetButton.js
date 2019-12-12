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
import { Button } from '@/components'

const ResetButton = ({ handleResetClick, handleClearClick }) => {
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

  const onClearClick = () => {
    handleClearClick()
    handleClickAway()
  }

  const open = Boolean(anchorEl)
  return (
    <React.Fragment>
      <Button color='default' size='sm' onClick={onClick}>
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
              <MenuItem onClick={onResetClick}>Reset</MenuItem>
              <MenuItem onClick={onClearClick}>Clear</MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </React.Fragment>
  )
}

export default ResetButton
