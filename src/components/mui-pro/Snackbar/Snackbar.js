import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import Snack from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { SizeContainer } from '@/components'
import $ from 'jquery'
// @material-ui/icons
import Close from '@material-ui/icons/Close'

import snackbarContentStyle from 'mui-pro-jss/material-dashboard-pro-react/components/snackbarContentStyle.jsx'

function Snackbar ({ ...props }) {
  const { classes, message, color, close, icon, place, open, theme } = props
  let action = []
  const messageClasses = cx({
    [classes.iconMessage]: icon !== undefined,
  })
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key='close'
        aria-label='Close'
        color='inherit'
        onClick={(e) => {
          // console.log(
          //   this,
          //   e.target,
          //   $(e.target).parents('.ant-notification-notice').find('.close'),
          // )
          $(e.target)
            .parents('.ant-notification-notice')
            .find('.close')
            .trigger('click')
        }}
      >
        <Close className={classes.close} />
      </IconButton>,
    ]
  }
  const iconClasses = cx({
    [classes.icon]: classes.icon,
    [classes.infoIcon]: color === 'info',
    [classes.successIcon]: color === 'success',
    [classes.warningIcon]: color === 'warning',
    [classes.dangerIcon]: color === 'danger' || color === 'error',
    [classes.primaryIcon]: color === 'primary',
    [classes.roseIcon]: color === 'rose',
  })
  return (
    <SizeContainer>
      <Snack
        // classes={{
        //   anchorOriginTopCenter: classes.top20,
        //   anchorOriginTopRight: classes.top40,
        //   anchorOriginTopLeft: classes.top40,
        // }}
        // anchorOrigin={{
        //   vertical: place.indexOf("t") === -1 ? "bottom" : "top",
        //   horizontal:
        //     place.indexOf("l") !== -1
        //       ? "left"
        //       : place.indexOf("c") !== -1 ? "center" : "right",
        // }}
        classes={{
          root: classes.overwrite,
        }}
        open
        message={
          <div>
            {icon !== undefined ? <props.icon className={iconClasses} /> : null}
            <span className={messageClasses}>{message}</span>
          </div>
        }
        action={action}
        ContentProps={{
          classes: {
            root: `${classes.root} ${classes[color]}`,
            message: classes.message,
          },
        }}
      />
    </SizeContainer>
  )
}
{
  /* <div className={contentClasses}>
{icon !== undefined ? <props.icon className={iconClasses} /> : null}
<span className={messageClasses}>{message}</span>
</div> */
}
Snackbar.defaultProps = {
  color: 'info',
}

Snackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'danger',
    'primary',
    'rose',
  ]),
  close: PropTypes.bool,
  icon: PropTypes.func,
  place: PropTypes.oneOf([
    'tl',
    'tr',
    'tc',
    'br',
    'bl',
    'bc',
  ]),
  open: PropTypes.bool,
}

export default withStyles(snackbarContentStyle)(Snackbar)
