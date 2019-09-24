import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '../mui-pro/CustomButtons'

export default ({
  options = [],
  children,
  valueField = 'id',
  textField = 'name',
  color = 'info',
  onClick = (f) => f,
  ...props
}) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(undefined)
  const tagButtonHandleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const tagButtonHandleClose = () => {
    setAnchorEl(undefined)
  }

  return (
    <React.Fragment>
      <Button
        onClick={tagButtonHandleClick}
        aria-controls='customized-menu'
        aria-haspopup='true'
        color={color}
      >
        {children}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={tagButtonHandleClose}
        PaperProps={{
          style: {
            maxHeight: 500,
            width: 250,
          },
        }}
      >
        {options.map((tag) => (
          <MenuItem
            key={tag[valueField]}
            onClick={() => {
              onClick(tag)
              tagButtonHandleClose()
            }}
          >
            {tag[textField]}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}
