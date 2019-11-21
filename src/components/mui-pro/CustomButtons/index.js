import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'

import buttonStyle from 'mui-pro-jss/material-dashboard-pro-react/components/buttonStyle.jsx'
import { control } from '@/components/Decorator'

@control(
  {
    // disabledProps: 'hidden',
  },
)
class RegularButton extends React.PureComponent {
  static displayName = 'RegularButton'

  render () {
    const { ...props } = this.props
    // console.log(props)
    const {
      classes,
      color,
      round,
      children,
      fullWidth,
      disabled,
      simple,
      size,
      block,
      link,
      noUnderline,
      justIcon,
      pureIcon,
      className,
      bigview,
      muiClasses,
      variant = 'contained',
      hidden,
      ...rest
    } = props
    const btnClasses = classNames({
      [classes.button]: true,
      [classes[size]]: size,
      [classes[color]]: color,
      [classes[`${variant}`]]: true,
      [classes[`${variant}${color}`]]: true,
      [classes.bigview]: bigview,
      [classes.round]: round,
      [classes.fullWidth]: fullWidth,
      [classes.disabled]: disabled,
      [classes.simple]: simple,
      [classes.block]: block,
      [classes.noUnderline]: noUnderline,
      [classes.link]: link,
      [classes.justIcon]: pureIcon || justIcon,
      [classes.pureIcon]: pureIcon,
      [className]: className,
    })

    if (hidden) return null
    return (
      <Button
        variant={variant}
        {...rest}
        classes={muiClasses}
        className={btnClasses}
        tabIndex={-1}
      >
        {children}
      </Button>
    )
  }
}

RegularButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'twitter',
    'facebook',
    'google',
    'linkedin',
    'pinterest',
    'youtube',
    'tumblr',
    'github',
    'behance',
    'dribbble',
    'reddit',
    'transparent',
    'gray',
    'login',
    '',
  ]),
  size: PropTypes.oneOf([
    'sm',
    'lg',
  ]),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
  className: PropTypes.string,
  muiClasses: PropTypes.object,
}

export default withStyles(buttonStyle)(RegularButton)
