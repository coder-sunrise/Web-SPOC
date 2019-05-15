import React from 'react'
import { NavLink } from "react-router-dom"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import StarBorder from '@material-ui/icons/StarBorder'
import Icon from "@material-ui/core/Icon"
import sidebarStyle from "mui-pro-jss/material-dashboard-pro-react/components/sidebarStyle.jsx"
import cx from "classnames"


class Links extends React.Component {
  state = {
    open: true,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }))
  };

  activeRoute = ()=>{
      return false
  }

  render () {
    const { classes,menuData,collapsed,rtlActive,color } = this.props

    return (
      <List className={classes.list}>
        {menuData.map((prop, key) => {
          console.log(prop.collapse)
          if (prop.redirect) {
            return null
          }
          if (prop.collapse) {
            const navLinkClasses =
              `${classes.itemLink 
              } ${ 
              cx({
                [` ${  classes.collapseActive}`]: this.activeRoute(prop.path),
              })}`
            const itemText =
              `${classes.itemText 
              } ${ 
              cx({
                [classes.itemTextMini]:
                  collapsed,
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
            const itemIcon =
              `${classes.itemIcon 
              } ${ 
              cx({
                [classes.itemIconRTL]: rtlActive,
              })}`
            const caret =
              `${classes.caret 
              } ${ 
              cx({
                [classes.caretRTL]: rtlActive,
              })}`
            return (
              <ListItem key={key} className={classes.item}>
                <NavLink
                  to="#"
                  className={navLinkClasses}
                  onClick={() => this.openCollapse(prop.state)}
                >
                  <ListItemIcon className={itemIcon}>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <prop.icon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    secondary={
                      <b
                        className={
                          `${caret 
                          } ${ 
                          this.state[prop.state] ? classes.caretActive : ""}`
                        }
                      />
                    }
                    disableTypography
                    className={itemText}
                  />
                </NavLink>
                <Collapse in={this.state[prop.state]} unmountOnExit>
                  <List className={`${classes.list  } ${  classes.collapseList}`}>
                    {prop.children.map((p, key) => {
                      console.log(p)
                      if (p.redirect) {
                        return null
                      }
                      const navLinkClasses =
                        `${classes.collapseItemLink 
                        } ${ 
                        cx({
                          [` ${  classes[color]}`]: this.activeRoute(p.path),
                        })}`
                      const collapseItemMini =
                        `${classes.collapseItemMini 
                        } ${ 
                        cx({
                          [classes.collapseItemMiniRTL]: rtlActive,
                        })}`
                      return (
                        <ListItem key={key} className={classes.collapseItem}>
                          <NavLink to={p.path} className={navLinkClasses}>
                            <span className={collapseItemMini}>
                              {p.mini}
                            </span>
                            <ListItemText
                              primary={p.name}
                              disableTypography
                              className={collapseItemText}
                            />
                          </NavLink>
                        </ListItem>
                      )
                    })}
                  </List>
                </Collapse>
              </ListItem>
            )
          }
          const navLinkClasses =
            `${classes.itemLink 
            } ${ 
            cx({
              [` ${  classes[color]}`]: this.activeRoute(prop.path),
            })}`
          const itemText =
            `${classes.itemText 
            } ${ 
            cx({
              [classes.itemTextMini]:
                collapsed,
              [classes.itemTextMiniRTL]:
                rtlActive && collapsed,
              [classes.itemTextRTL]: rtlActive,
            })}`
          const itemIcon =
            `${classes.itemIcon 
            } ${ 
            cx({
              [classes.itemIconRTL]: rtlActive,
            })}`
          return (
            <ListItem key={key} className={classes.item}>
              <NavLink to={prop.path} className={navLinkClasses}>
                <ListItemIcon className={itemIcon}>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <prop.icon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={prop.name}
                  disableTypography
                  className={itemText}
                />
              </NavLink>
            </ListItem>
          )
        })}
        {/* <ListItem button>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText inset primary="Sent mail" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Drafts" />
        </ListItem>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText inset primary="Inbox" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText inset primary="Starred" />
            </ListItem>
          </List>
        </Collapse> */}
      </List>
    )
  }
}

Links.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(sidebarStyle)(Links)