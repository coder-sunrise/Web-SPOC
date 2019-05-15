import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cx from "classnames"

import sidebarStyle from "mui-pro-jss/material-dashboard-pro-react/components/sidebarStyle.jsx"

class Logo extends React.PureComponent {
  render () {
    const {
        classes,
        color,
        logo,
        image,
        logoText,
        routes,
        bgColor,
        rtlActive,
        collapsed,
      } = this.props
  
      const logoNormal =
      `${classes.logoNormal 
      } ${ 
      cx({
        [classes.logoNormalSidebarMini]:
          collapsed,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && collapsed ,
        [classes.logoNormalRTL]: rtlActive,
      })}`
    const logoMini =
      `${classes.logoMini 
      } ${ 
      cx({
        [classes.logoMiniRTL]: rtlActive,
      })}`
    const logoClasses =
      `${classes.logo 
      } ${ 
      cx({
        [classes.whiteAfter]: bgColor === "white",
      })}`
    return (
      <div className={logoClasses}>
        <a href="/" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img} />
        </a>
        <a href="/" className={logoNormal}>
          {logoText}
        </a>
      </div>
    )
  }
}

Logo.propTypes = {
}

export default withStyles(sidebarStyle)(Logo)