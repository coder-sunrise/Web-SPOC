import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core'
import Done from '@material-ui/icons/Done'
import Button from '../mui-pro/CustomButtons'


export default ({
  options = [],
  children,
  valueField = 'id',
  textField = 'name',
  color = 'info',
  mode = 'default',
  includeAll = true,
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
        {...props}
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
        {mode === 'multiple' &&
        includeAll && (
          <MenuItem
            key='$all'
            onClick={() => {
              // onClick(tag)
              // tagButtonHandleClose()
            }}
          >
            All
          </MenuItem>
        )}
        {options.map((tag) => (
          <MenuItem
            key={tag[valueField]}
            onClick={() => {
              onClick(tag)
              tagButtonHandleClose()
            }}
          >
            <ListItemIcon>
              <Done fontSize='small' />
            </ListItemIcon>
            <Typography variant='inherit' noWrap>
              A very long text that overflows
            </Typography>

            {tag[textField]}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}
