import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { FormattedMessage } from 'umi/locale'

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Hidden from "@material-ui/core/Hidden"

// material-ui icons
import Menu from "@material-ui/icons/Menu"
import MoreVert from "@material-ui/icons/MoreVert"
import ViewList from "@material-ui/icons/ViewList"

// core components
import Button from "mui-pro-components/CustomButtons"

import headerStyle from "mui-pro-jss/material-dashboard-pro-react/components/headerStyle.jsx"
import HeaderLinks from "./HeaderLinks"

import PageHeader from '@/components/PageHeader'
import Link from 'umi/link'
import MenuContext from '@/layouts/MenuContext'

function Header ({ ...props }) {
  // function makeBrand () {
  //   let name
  //   props.menuData.map((prop, key) => {
  //     // console.log(prop)

  //     (prop.children || []).map((p, key) => {
  //       if (p.path === props.location.pathname) {
  //         name = p.name
  //       }
  //       return null
  //     })
  //     if (prop.path === props.location.pathname) {
  //       name = prop.name
  //     }
  //     return null
  //   })
  //   if(name){
  //     return name
  //   } 
  //     return "Default Brand Name"
    
  // }
  const { classes, color, rtlActive } = props
  const appBarClasses = cx({
    [` ${  classes[color]}`]: color,
  })
  const sidebarMinimize =
    `${classes.sidebarMinimize 
    } ${ 
    cx({
      [classes.sidebarMinimizeRTL]: rtlActive,
    })}`

  const {children, contentWidth, wrapperClassName, top, ...restProps} = props
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown implementation="css">
          <div className={sidebarMinimize}>
            {props.miniActive ? (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <ViewList className={classes.sidebarMiniIcon} />
              </Button>
            ) : (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <MoreVert className={classes.sidebarMiniIcon} />
              </Button>
            )}
          </div>
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          {/* <Button href="#" className={classes.title} color="transparent">
            {makeBrand()}
          </Button> */}

          <MenuContext.Consumer>
            {value => (
              <PageHeader
                wide={contentWidth === 'Fixed'}
                home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
                {...value}
                key="pageheader"
                {...restProps}
                // linkElement={Link}
                itemRender={(item,isLast) => {
            if (isLast && sessionStorage.getItem(location.pathname)) {
              return sessionStorage.getItem(location.pathname) 
            }if(item.locale){
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />

            }
            return item.title
          }}
              />
      )}
          </MenuContext.Consumer>
        </div>
        <Hidden smDown implementation="css">
          <HeaderLinks rtlActive={rtlActive} />
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
}

export default withStyles(headerStyle)(Header)
