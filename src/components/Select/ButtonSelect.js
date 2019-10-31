import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Menu from '@material-ui/core/Menu'
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core'
import Done from '@material-ui/icons/Done'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Button from '../mui-pro/CustomButtons'

export default ({
  options = [],
  children,
  valueField = 'id',
  textField = 'name',
  color = 'info',
  mode = 'default',
  includeAll = true,
  value,
  field,
  form,
  onChange = (f) => f,
  ...props
}) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(undefined)
  const [
    selected,
    setSelected,
  ] = useState(
    field ? field.value : value || (mode === 'multiple' ? [] : undefined),
  )
  const tagButtonHandleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const tagButtonHandleClose = (e) => {
    setAnchorEl(undefined)
    if (mode === 'multiple') {
      if (form) form.setFieldValue(field.name, selected)
      onChange(
        selected,
        options.filter((o) => (selected || []).indexOf(o[valueField]) >= 0),
      )
    }
  }
  // useEffect(
  //   () => {
  //     if (anchorEl) {

  //     }
  //   },
  //   [
  //     selected,
  //   ],
  // )
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
        PaperProps={{
          style: {
            maxHeight: 500,
            width: 250,
          },
        }}
        onClose={tagButtonHandleClose}
      >
        {mode === 'multiple' &&
        includeAll && (
          <MenuItem
            key='$all'
            onClick={() => {
              if (selected.length === options.length) {
                setSelected([])
              } else {
                setSelected(options.map((o) => o[valueField]))
              }
              // onClick(tag)
              // if (mode !== 'multiple') tagButtonHandleClose()
            }}
          >
            {mode === 'multiple' ? (
              <ListItemIcon>
                {(selected || []).length === options.length ? (
                  <Done fontSize='small' />
                ) : null}
              </ListItemIcon>
            ) : null}
            All
          </MenuItem>
        )}
        {options.map((tag) => (
          <MenuItem
            key={tag[valueField]}
            onClick={() => {
              if (mode !== 'multiple') {
                setSelected(tag[valueField])
                if (form) form.setFieldValue(field.name, tag[valueField])
                onChange(
                  tag[valueField],
                  options.find((o) => o[valueField] === tag[valueField]),
                )
                tagButtonHandleClose()
              } else {
                setSelected(
                  selected.indexOf(tag[valueField]) >= 0
                    ? _.reject(selected, (o) => o === tag[valueField])
                    : selected.concat([
                        tag[valueField],
                      ]),
                )
              }

              // tagButtonHandleClose()
            }}
          >
            {mode === 'multiple' ? (
              <ListItemIcon>
                {(selected || []).indexOf(tag[valueField]) >= 0 ? (
                  <Done fontSize='small' />
                ) : null}
              </ListItemIcon>
            ) : null}
            {tag[textField]}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}
