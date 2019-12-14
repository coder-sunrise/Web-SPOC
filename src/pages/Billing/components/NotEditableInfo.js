import React, { useState } from 'react'
// material ui
import { Popover, withStyles } from '@material-ui/core'
import Info from '@material-ui/icons/Info'
// common components

const styles = (theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  container: {
    padding: theme.spacing(1),
    width: 300,
  },
})

const NotEditableInfo = ({ classes }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)

  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)

  return (
    <React.Fragment>
      <Info
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id='max-cap-info'
        disableRestoreFocus
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.container}>
          <p>
            This scheme is not editable because it does not exist in patient
            schemes or is expired.
          </p>
        </div>
      </Popover>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'NotEditableInfo' })(NotEditableInfo)
