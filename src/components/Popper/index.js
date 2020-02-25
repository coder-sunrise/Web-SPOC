import Grow from '@material-ui/core/Grow'
import React, { useState, useEffect } from 'react'

import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

export default ({
  children,
  overlay,
  trigger = 'hover',
  disabled,
  disabledTransition,
  placement,
  ...props
}) => {
  if (disabled) return children
  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState(null)
  const triggerProps = {
    onContextMenu:
      trigger === 'contextmenu'
        ? (event) => {
            setAnchorEl(event.currentTarget)
            event.preventDefault()
          }
        : null,
    onClick:
      trigger === 'click'
        ? (event) => {
            setAnchorEl(event.currentTarget)
          }
        : null,
    onMouseEnter:
      trigger === 'hover'
        ? (event) => {
            setAnchorEl(event.currentTarget)
          }
        : null,
    onMouseLeave:
      trigger === 'hover'
        ? () => {
            setAnchorEl(null)
          }
        : null,
  }
  // const { className, style, ...resetBtnProps } = children.props

  const popperContainer = (
    <Paper elevation={2}>
      <ClickAwayListener
        onClickAway={() => {
          // console.log('onClickAway')
          trigger !== 'hover' ? setAnchorEl(null) : undefined
        }}
      >
        {overlay}
      </ClickAwayListener>
    </Paper>
  )

  return (
    <span {...triggerProps}>
      {children}
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        transition
        placement={placement}
        // disablePortal
        onClose={() => {
          setAnchorEl(null)
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        style={{ zIndex: 1500 }}
        {...props}
      >
        {({ TransitionProps, p }) => {
          if (disabledTransition) return popperContainer

          return <Grow {...TransitionProps}>{popperContainer}</Grow>
        }}
      </Popper>
    </span>
  )
}
