import React, { PureComponent, Suspense } from 'react'
import { Layout } from 'antd'
import { compose } from 'recompose'
import Link from 'umi/link'
import cx from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Hidden from '@material-ui/core/Hidden'
import sidebarStyle from 'mui-pro-jss/material-dashboard-pro-react/components/sidebarStyle.jsx'
import SidebarWrapper from './SidebarWrapper'
import Links from './Links'
import Logo from './Logo'
import User from './User'
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils'
import PageLoading from '../PageLoading'
import styles from './index.less'

const BaseMenu = React.lazy(() => import('./BaseMenu'))
const { Sider } = Layout
class SiderMenu extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
      miniActive: props.miniActive,
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { miniActive } = props
    if (miniActive !== state.miniActive) {
      return {
        miniActive,
      }
    }
    return null
  }

  // isMainMenu = key => {
  //   const { menuData } = this.props
  //   return menuData.some(item => {
  //     if (key) {
  //       return item.key === key || item.path === key
  //     }
  //     return false
  //   })
  // };

  // handleOpenChange = openKeys => {
  //   const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1
  //   this.setState({
  //     openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
  //   })
  // };

  render () {
    let {
      width,
      collapsed,
      miniActive,
      onCollapse,
      fixSiderbar,
      theme,
      ...restProps
    } = this.props
    // if(this.state.miniActive)collapsed= this.state.miniActive
    const { openKeys } = this.state
    const siderClassName = cx(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    })

    const {
      classes,
      color,
      logo,
      image,
      logoText,
      routes,
      bgColor,
      rtlActive,
      isMobile,
    } = this.props
    let shouldCollapse = collapsed
    if (miniActive) shouldCollapse = collapsed && this.state.miniActive
    if (isMobile) shouldCollapse = false
    // console.log(shouldCollapse)
    const defaultProps = shouldCollapse ? {} : { openKeys }
    const drawerPaper = `${classes.drawerPaper} ${cx({
      [classes.drawerPaperMini]: shouldCollapse,
      [classes.drawerPaperRTL]: rtlActive,
    })}`
    const sidebarWrapper = `${classes.sidebarWrapper} ${cx({
      [classes.drawerPaperMini]: shouldCollapse,
      [classes.sidebarWrapperWithPerfectScrollbar]:
        navigator.platform.indexOf('Win') > -1,
    })}`
    return (
      // <Sider
      //   trigger={null}
      //   collapsible
      //   collapsed={collapsed}
      //   breakpoint="lg"
      //   onCollapse={onCollapse}
      //   width={256}
      //   theme={theme}
      //   className={siderClassName}
      // >

      // </Sider>
      <div ref='mainPanel'>
        <Hidden mdUp implementation='css'>
          <Drawer
            variant='temporary'
            anchor={rtlActive ? 'left' : 'right'}
            open={this.props.open}
            classes={{
              paper: `${drawerPaper} ${classes[`${bgColor}Background`]}`,
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Logo {...this.props} collapsed={shouldCollapse} />
            <SidebarWrapper className={sidebarWrapper}>
              <User {...this.props} collapsed={shouldCollapse} />
              <Suspense fallback={null}>
                {/* <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          /> */}
                <BaseMenu {...restProps} collapsed={shouldCollapse} />
              </Suspense>
            </SidebarWrapper>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation='css'>
          <Drawer
            onMouseEnter={() => {
              this.setState({ miniActive: false })
            }}
            onMouseLeave={() => {
              this.setState({ miniActive: true })
            }}
            anchor={rtlActive ? 'right' : 'left'}
            variant='permanent'
            open
            classes={{
              paper: `${drawerPaper} ${classes[`${bgColor}Background`]}`,
            }}
          >
            <Logo {...this.props} collapsed={shouldCollapse} />
            <SidebarWrapper className={sidebarWrapper}>
              <User {...this.props} collapsed={shouldCollapse} />
              <Suspense fallback={null}>
                {/* <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          /> */}
                <BaseMenu {...restProps} collapsed={shouldCollapse} />
              </Suspense>
            </SidebarWrapper>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

// const enhance = compose(
//   withStyles(sidebarStyle, { withTheme: true }),
//   withWidth(),
// )
export default withStyles(sidebarStyle, { withTheme: true })(SiderMenu)
