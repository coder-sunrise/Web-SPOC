import React, { Suspense } from 'react'
import NProgress from 'nprogress'
import $ from 'jquery'
import _ from 'lodash'
import moment from 'moment'
import { headerHeight } from 'mui-pro-jss'
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout'
import { connect, formatMessage, Link, getLocale } from 'umi'

import CssBaseline from '@material-ui/core/CssBaseline'
import DocumentTitle from 'react-document-title'
import isEqual from 'lodash/isEqual'
import memoizeOne from 'memoize-one'
import cx from 'classnames'
import pathToRegexp from 'path-to-regexp'
import Media from 'react-media'
import { checkAuthoritys } from '@/utils/utils'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import image from 'assets/img/sidebar-2.jpg'
// import logo from 'assets/img/logo-white.svg'
import logo from 'assets/img/logo/logo_blue.png'
// import logo from 'assets/img/logo/nscmh-logo-2.png'
import withStyles from '@material-ui/core/styles/withStyles'
import appStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx'
import Header from 'mui-pro-components/Header'
import Footer from 'mui-pro-components/Footer'
import Loading from '@/components/PageLoading/index'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { initStream } from '@/utils/realtime'
import { initClinicSettings } from '@/utils/config'
import Authorized, { reloadAuthorized } from '@/utils/Authorized'
import defaultSettings from '@/defaultSettings'

import ErrorBoundary from './ErrorBoundary'
import GlobalModalContainer from './GlobalModalContainer'

initClinicSettings()

// setInterval(() => {
//   console.log(document.activeElement)
//   // $(document.activeElement).trigger($.Event('keyup', { which: 49 }))
// }, 2000)
const _theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  props: {
    ...defaultTheme.props,
  },
  palette: {
    ...defaultTheme.palette,
    // primary: {
    //   main: primaryColor,
    // },
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#000',
    // },
  },
  overrides: {
    ...defaultTheme.overrides,
  },
})

const refreshTokenTimer = 10 * 60 * 1000
const sessionTimeoutTimer = 30 * 60 * 1000
// const sessionTimeoutTimer = 2500

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      mobileOpen: false,
      authorized: false,
      accessable: false,
      routesData: undefined,
    }
    // this.resize = this.resize.bind(this)
    this.resize = _.debounce(this.resize, 500, {
      leading: true,
    })
    const { dispatch } = this.props

    this.initUserData()
    initStream()

    let sessionTimeOutInterval = null
    this.refreshTokenInterval = null

    const resetSessionTimeOut = e => {
      // console.log(e)
      clearTimeout(sessionTimeOutInterval)
      const now = Date.now()
      localStorage.setItem('lastActiveTime', now)
      sessionTimeOutInterval = setInterval(() => {
        if (
          Number(localStorage.getItem('lastActiveTime')) <=
          Date.now() - sessionTimeoutTimer
        ) {
          if (localStorage.getItem('token')) {
            dispatch({
              type: 'global/updateAppState',
              payload: {
                showSessionTimeout: true,
              },
            })
            clearInterval(sessionTimeOutInterval)
          } else {
            window.location.reload()
          }
        }
      }, sessionTimeoutTimer)
    }
    const debouncedRST = _.debounce(resetSessionTimeOut, 10000, {
      leading: true,
      trailing: false,
    })
    $(document).on('click', debouncedRST)
    $(document).on('keydown', debouncedRST)

    resetSessionTimeOut()
    this.refreshToken()
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
    this.resize()
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      if (window.mainPanel) window.mainPanel.scrollTop = 0
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false })
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    clearInterval(this.refreshTokenInterval)
  }

  getContext() {
    const { location } = this.props
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    }
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap(menus) {
    // console.log('getBreadcrumbNameMap')
    const routerMap = {}
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children)
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem
      })
    }
    flattenMenuData(menus)
    return routerMap
  }

  refreshToken = () => {
    clearInterval(this.refreshTokenInterval)
    this.refreshTokenInterval = setInterval(() => {
      this.props.dispatch({
        type: 'login/refreshToken',
      })
    }, refreshTokenTimer)
  }

  checkShouldProceedRender = async () => {
    const { dispatch } = this.props
    try {
      const currentSystemVersion =
        JSON.parse(localStorage.getItem('systemVersion')) || null
      const latestSystemVersion = await dispatch({
        type: 'global/getSystemVersion',
      })
      // console.log(currentSystemVersion)
      // first time open
      if (!currentSystemVersion || !latestSystemVersion['semr2-frontend'])
        return true

      const currentUIVersion = currentSystemVersion['semr2-frontend']
        .split('.')
        .map(item => parseInt(item, 10))
      const latestUIVersion = latestSystemVersion['semr2-frontend']
        .split('.')
        .map(item => parseInt(item, 10))

      const shouldRefresh = latestUIVersion.reduce(
        (refresh, version, index) => {
          if (version > currentUIVersion[index]) return true
          return refresh
        },
        false,
      )

      return !shouldRefresh
    } catch (error) {
      console.log({ error })
      return true
    }
  }

  redirectToAccessable = () => {
    const { location } = this.props.history
    const { pathname } = location
    const _cloned = _.cloneDeep(this.menus)
    const isAccessible = _cloned.reduce((canAccess, _menu) => {
      const { children, path } = _menu
      if (Array.isArray(children) && children.length > 0) {
        const valid = children.find(child => {
          return pathToRegexp(child.path).test(pathname)
        })

        return canAccess || !!valid
      }
      return canAccess || pathToRegexp(path).test(pathname)
    }, false)

    if (isAccessible) return true
    const [firstMenu] = _cloned

    // check if menu has any sub menu
    // redirect to first accessible sub menu
    if (firstMenu.children && Array.isArray(firstMenu.children)) {
      const [firstChildren] = firstMenu.children
      if (firstChildren && typeof firstChildren.path === 'string') {
        return this.props.history.push(firstChildren.path)
      }
    }

    if (firstMenu && typeof firstMenu.path === 'string') {
      return this.props.history.push(firstMenu.path)
    }

    return this.props.history.push('/not-found')
  }

  initNecessaryCodetable = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'doctorprofile',
        filter: {
          'clinicianProfile.isActive': true,
        },
      },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
      },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'copaymentscheme',
        filter: {
          isActive: undefined,
        },
      },
    })
  }

  initUserData = async () => {
    const {
      dispatch,
      route: { routes, authority },
      location,
      history,
    } = this.props
    const shouldProceed = await this.checkShouldProceedRender()
    if (!shouldProceed) {
      // system version is lower than db, should do a refresh
      // reload(true) will reload the page from server, instead of cache
      window.location.reload(true)
      return
    }
    this.initNecessaryCodetable()

    const user = await dispatch({
      type: 'user/fetchCurrent',
    })

    if (!user) return
    reloadAuthorized()
    await dispatch({
      type: 'codetable/fetchAllCachedCodetable',
    })

    const menus = await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    })
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual)
    this.breadcrumbNameMap = this.getBreadcrumbNameMap(menus)
    // console.log(this.breadcrumbNameMap)

    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual)
    this.getPageTitle = memoizeOne(this.getPageTitle)
    this.menus = menus
    this.redirectToAccessable()

    this.setState({
      authorized: true,
    })

    const { pathname } = location
    checkAuthoritys(pathname, history)
  }

  matchParamsPath = pathname => {
    if (!this.breadcrumbNameMap) return null
    // console.log('matchParamsPath', pathname, this.breadcrumbNameMap)
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname),
    )
    return this.breadcrumbNameMap[pathKey]
  }

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname)
    if (!currRouterData) {
      return defaultSettings.appTitle
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    })
    return `${pageName} - ${defaultSettings.appTitle}`
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      }
    }
    return null
  }

  getContentStyle = () => {
    const { fixedHeader } = this.props
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    }
  }

  // handleMenuCollapse = (collapsed) => {
  //   const { dispatch } = this.props
  //   dispatch({
  //     type: 'global/changeLayoutCollapsed',
  //     payload: collapsed,
  //   })
  //   console.log('handleMenuCollapse')
  //   // $(window).trigger('resize')
  //   setTimeout(() => {
  //     this.triggerResizeEvent()
  //   }, 5000)
  // }

  resize = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false })
    }
    if (window.mainPanel) {
      this.props.dispatch({
        type: 'global/updateState',
        payload: {
          mainDivHeight: window.mainPanel.offsetHeight - headerHeight,
        },
      })
    }
  }

  sidebarMinimize = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !this.props.collapsed,
    }).then(() => {
      // console.log('resize')
      setTimeout(this.triggerResizeEvent, 500)
    })
  }

  handleDrawerToggle = () => {
    this.setState(preState => ({
      mobileOpen: !preState.mobileOpen,
    }))
  }

  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, false)
    window.dispatchEvent(event)
    // console.log(event)
  }

  // renderSettingDrawer = () => {
  //   // Do not render SettingDrawer in production
  //   // unless it is deployed in preview.pro.ant.design as demo
  //   if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
  //     return null
  //   }
  //   return <SettingDrawer />
  // };

  renderChild = () => {
    const { children } = this.props
    const { authorized } = this.state
    if (!authorized) return <Loading />

    return children
  }

  render() {
    const { classes, loading, theme, ...props } = this.props
    console.log(props, getLocale())
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
    }
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      collapsed,
    } = this.props
    // console.log(this.props)
    const isTop = PropsLayout === 'topmenu'
    // const routerConfig = this.matchParamsPath(pathname)
    // console.log('routerConfig', routerConfig)
    const mainPanel = `${classes.mainPanel} ${cx({
      [classes.mainPanelSidebarMini]: collapsed,
    })}`
    // console.log(this.props)
    // console.log(this)
    // console.log(this.state.mainDivHeight, window.mainPanel)
    return (
      <React.Fragment>
        <MuiThemeProvider theme={_theme}>
          <CssBaseline />
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <div id='main-page' style={{ height: '100vh' }}>
              <ErrorBoundary>
                <ProLayout
                  // {...defaultProps}
                  {...props}
                  formatMessage={formatMessage}
                  menuItemRender={(menuItemProps, defaultDom) => {
                    console.log(defaultDom)
                    if (
                      menuItemProps.isUrl ||
                      !menuItemProps.path ||
                      location.pathname === menuItemProps.path
                    ) {
                      return defaultDom
                    }
                    return <Link to={menuItemProps.path}>{defaultDom}</Link>
                  }}
                  breadcrumbRender={(routers = []) => [
                    {
                      path: '/',
                      breadcrumbName: formatMessage({ id: 'menu.home' }),
                    },
                    ...routers,
                  ]}
                  location={{
                    pathname,
                  }}
                >
                  <PageContainer title={null} content={children} />
                </ProLayout>
              </ErrorBoundary>
              {this.state.authorized && <GlobalModalContainer {...props} />}
            </div>
          </DocumentTitle>
          {/* <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense> */}
        </MuiThemeProvider>
      </React.Fragment>
    )
  }
}

export default withStyles(appStyle)(
  connect(({ global, setting, menu, loading }) => ({
    collapsed: global.collapsed,
    layout: setting.layout,
    // menuData: menu.menuData,
    ...setting,
    loading,
  }))(props => (
    <Media query='(max-width: 599px)'>
      {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
    </Media>
  )),
)
