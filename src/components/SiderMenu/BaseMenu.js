import React, { PureComponent } from 'react'
import { Menu } from 'antd'
import Link from 'umi/link'
import isEqual from 'lodash/isEqual'
import memoizeOne from 'memoize-one'
import router from 'umi/router'
import { formatMessage, setLocale, getLocale } from 'umi/locale'

import { NavLink } from 'react-router-dom'
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
import Icon from '@material-ui/core/Icon'
import sidebarStyle from 'mui-pro-jss/material-dashboard-pro-react/components/sidebarStyle.jsx'
import cx from 'classnames'
import { isUrl, confirmBeforeReload, navigateDirtyCheck } from '@/utils/utils'
import styles from './index.less'
import { getMenuMatches } from './SiderMenuUtils'
import { urlToList } from '../_utils/pathTools'

const { SubMenu } = Menu

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt='icon' className={styles.icon} />
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />
  }
  return icon
}
const getSelectedMenuKeys = (pathname, props) => {
  const { flatMenuKeys } = props
  return urlToList(pathname).map((itemPath) =>
    getMenuMatches(flatMenuKeys, itemPath).pop(),
  )
}
class BaseMenu extends PureComponent {
  state = {}

  static getDerivedStateFromProps (nextProps, prevState) {
    const { openKeys, location: { pathname } } = nextProps
    // console.log(this)
    let selectedKey = getSelectedMenuKeys(pathname, nextProps)
    if (!selectedKey.length && openKeys) {
      selectedKey = [
        openKeys[openKeys.length - 1],
      ]
    }
    if (!isEqual(prevState.selectedKey, selectedKey)) {
      return {
        selectedList: selectedKey[0],
        selectedKey,
      }
    }
    return null
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, level) => {
    // console.log(menusData, selectedKey)
    if (!menusData) {
      return []
    }
    return menusData
      .filter((item) => item.name && !item.hideInMenu)
      .map((item, i) => this.getSubMenuOrItem(item, level))
      .filter((item) => item)
  }

  openCollapse = (collapse) => {
    let st = {}
    if (this.state.selectedList === collapse) {
      st.selectedList = ''
    } else {
      st.selectedList = collapse
    }
    this.setState(st)
  }

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item, level) => {
    const key = item.path || 'default'
    const selected = this.state.selectedList === key

    const {
      location,
      isMobile,
      onCollapse,
      classes,
      rtlActive,
      collapsed,
      color,
    } = this.props

    const collapseItemMini = `${classes.collapseItemMini} ${cx({
      [classes.collapseItemMiniRTL]: rtlActive,
    })}`
    if (
      item.children &&
      !item.hideChildrenInMenu &&
      item.children.some((child) => child.name)
    ) {
      const { name } = item
      const navLinkClasses = `${classes.itemLink} ${cx({
        [` ${classes.collapseActive}`]: selected,
      })}`
      const itemText = `${classes.itemText} ${cx({
        [classes.itemTextMini]: collapsed,
        [classes.itemTextMiniRTL]: rtlActive && collapsed,
        [classes.itemTextRTL]: rtlActive,
      })}`

      const caret = `${classes.caret} ${cx({
        [classes.caretRTL]: rtlActive,
      })}`
      const itemIcon = `${classes.itemIcon} ${cx({
        [classes.itemIconRTL]: rtlActive,
      })}`
      return (
        <ListItem key={item.path} className={classes.collapseItem}>
          <Link
            to='#' // "{item.path}"
            target={item.target}
            replace={item.path === location.pathname}
            onClick={(e) => {
              this.openCollapse(key)
              return false
            }}
            className={navLinkClasses}
          >
            <ListItemIcon className={itemIcon}>
              {typeof item.icon === 'string' ? (
                <Icon>{item.icon}</Icon>
              ) : (
                // <item.icon />
                <span className={collapseItemMini}>{item.mini || ''}</span>
              )}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              secondary={
                <b
                  className={`${caret} ${selected ? classes.caretActive : ''}`}
                />
              }
              disableTypography
              className={itemText}
            />
          </Link>
          <Collapse in={selected} unmountOnExit>
            <List className={`${classes.list} ${classes.collapseList}`}>
              {this.getNavMenuItems(item.children, level + 1)}
            </List>
          </Collapse>
        </ListItem>
      )
    }
    return this.getMenuItemPath(item, level)
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item, level) => {
    const { name } = item
    const itemPath = this.conversionPath(item.path)
    const icon = getIcon(item.icon)
    const { target } = item
    const {
      location,
      isMobile,
      onCollapse,
      rtlActive,
      classes,
      collapsed,
      color,
    } = this.props

    const collapseItemMini = `${classes.collapseItemMini} ${cx({
      [classes.collapseItemMiniRTL]: rtlActive,
    })}`
    const collapseItemText = `${classes.collapseItemText} ${cx({
      [classes.collapseItemTextMini]: collapsed,
      [classes.collapseItemTextMiniRTL]: rtlActive && collapsed,
      [classes.collapseItemTextRTL]: rtlActive,
    })}`
    const itemText = `${classes.itemText} ${cx({
      [classes.itemTextMini]: collapsed,
      [classes.itemTextMiniRTL]: rtlActive && collapsed,
      [classes.itemTextRTL]: rtlActive,
    })}`
    const itemIcon = `${classes.itemIcon} ${cx({
      [classes.itemIconRTL]: rtlActive,
    })}`

    const navLinkClasses = `${classes.itemLink} ${cx({
      [` ${classes[color]}`]: this.state.selectedKey.find(
        (o) => o === item.path,
      ),
    })}`
    return (
      <ListItem key={item.path} className={classes.item}>
        <Link
          to={itemPath}
          target={target}
          replace={itemPath === location.pathname}
          onClick={
            isMobile ? (
              () => {
                onCollapse(true)
              }
            ) : (
              navigateDirtyCheck({
                redirectUrl: itemPath,
              })
            )
          }
          className={navLinkClasses}
        >
          {typeof item.icon === 'string' ? (
            <ListItemIcon className={itemIcon}>
              <Icon>{item.icon}</Icon>
            </ListItemIcon>
          ) : (
            <span className={collapseItemMini}>{item.mini || ''}</span>
          )}

          <ListItemText
            primary={item.name}
            disableTypography
            className={level === 0 ? itemText : collapseItemText}
          />
        </Link>
      </ListItem>
    )
  }

  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path
    }
    return `/${path || ''}`.replace(/\/+/g, '/')
  }

  render () {
    const { openKeys, theme, mode, location: { pathname } } = this.props

    const { handleOpenChange, style, menuData, classes } = this.props
    // console.log(selectedKey)
    return (
      <List className={classes.list}>{this.getNavMenuItems(menuData, 0)}</List>
    )
  }
}

export default withStyles(sidebarStyle)(BaseMenu)
