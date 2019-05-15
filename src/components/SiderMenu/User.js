import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cx from "classnames"
import { NavLink } from "react-router-dom"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Collapse from "@material-ui/core/Collapse"

import sidebarStyle from "mui-pro-jss/material-dashboard-pro-react/components/sidebarStyle.jsx"

import avatar from "assets/img/faces/avatar.jpg"
// const styles = theme => ({
//   root: {
//     display: 'flex',
//   },
//   formControl: {
//     margin: theme.spacing.unit * 3,
//   },
//   group: {
//     margin: `${theme.spacing.unit}px 0`,
//   },
// })
import customCheckboxRadioSwitch from "mui-pro-jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx"

class User extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          openAvatar: false,
        }
      }

      openCollapse (collapse) {
        let st = {}
        st[collapse] = !this.state[collapse]
        this.setState(st)
      }

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
  
    const itemText =
      `${classes.itemText 
      } ${ 
      cx({
        [classes.itemTextMini]: collapsed,
        [classes.itemTextMiniRTL]:
          rtlActive && collapsed,
        [classes.itemTextRTL]: rtlActive,
      })}`
    const collapseItemText =
      `${classes.collapseItemText 
      } ${ 
      cx({
        [classes.collapseItemTextMini]:
          collapsed,
        [classes.collapseItemTextMiniRTL]:
          rtlActive && collapsed,
        [classes.collapseItemTextRTL]: rtlActive,
      })}`
    const userWrapperClass =
      `${classes.user 
      } ${ 
      cx({
        [classes.whiteAfter]: bgColor === "white",
      })}`
    const caret =
      `${classes.caret 
      } ${ 
      cx({
        [classes.caretRTL]: rtlActive,
      })}`
    const collapseItemMini =
      `${classes.collapseItemMini 
      } ${ 
      cx({
        [classes.collapseItemMiniRTL]: rtlActive,
      })}`
    const photo =
      `${classes.photo 
      } ${ 
      cx({
        [classes.photoRTL]: rtlActive,
      })}`
    return (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img src={avatar} className={classes.avatarImg} alt="..." />
        </div>
        <List className={classes.list}>
          <ListItem className={`${classes.item  } ${  classes.userItem}`}>
            <NavLink
              to="#"
              className={`${classes.itemLink  } ${  classes.userCollapseButton}`}
              onClick={() => this.openCollapse("openAvatar")}
            >
              <ListItemText
                primary={rtlActive ? "تانيا أندرو" : "Tania Andrew"}
                secondary={
                  <b
                    className={
                      `${caret 
                      } ${ 
                      classes.userCaret 
                      } ${ 
                      this.state.openAvatar ? classes.caretActive : ""}`
                    }
                  />
                }
                disableTypography
                className={`${itemText  } ${  classes.userItemText}`}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={`${classes.list  } ${  classes.collapseList}`}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      `${classes.itemLink  } ${  classes.userCollapseLinks}`
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? "مع" : "MP"}
                    </span>
                    <ListItemText
                      primary={rtlActive ? "ملفي" : "My Profile"}
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      `${classes.itemLink  } ${  classes.userCollapseLinks}`
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? "هوع" : "EP"}
                    </span>
                    <ListItemText
                      primary={
                        rtlActive ? "تعديل الملف الشخصي" : "Edit Profile"
                      }
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      `${classes.itemLink  } ${  classes.userCollapseLinks}`
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? "و" : "S"}
                    </span>
                    <ListItemText
                      primary={rtlActive ? "إعدادات" : "Settings"}
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    )
  }
}

User.propTypes = {
}

export default withStyles(sidebarStyle)(User)