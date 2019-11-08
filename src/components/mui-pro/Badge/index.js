import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

const CustomizedBadge = ({ ripple, classes, ...resetProps }) => {
  // console.log(classes)
  const { color = 'primary' } = resetProps
  return (
    <Badge
      classes={{
        badge: classnames({
          [classes.rippleCls]: !!ripple,
          [classes[color]]: true,
        }),
      }}
      {...resetProps}
    />
  )
}

CustomizedBadge.propTypes = {
  // classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'warning',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
}

export default withStyles((theme) => ({
  info: {
    backgroundColor: '#44b700',
    '&::after': {
      border: '1px solid #44b700',
    },
  },
  danger: {
    backgroundColor: 'red',
    '&::after': {
      border: '1px solid red',
    },
  },
  rippleCls: {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      // top: 0,
      // left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(CustomizedBadge)
