import React, { Suspense } from 'react'
import NProgress from 'nprogress'
import $ from 'jquery'
import _ from 'lodash'
import { headerHeight } from 'mui-pro-jss'
import { ProLayout } from '@medisys/component'
import { PageContainer } from '@/components'
import { connect, formatMessage, Link, getLocale } from 'umi'
import { Breadcrumb, Alert } from 'antd'
import { RightOutlined } from '@ant-design/icons'

import CssBaseline from '@material-ui/core/CssBaseline'
import DocumentTitle from 'react-document-title'
import isEqual from 'lodash/isEqual'
import memoizeOne from 'memoize-one'
import cx from 'classnames'
import pathToRegexp from 'path-to-regexp'
import Media from 'react-media'
import { checkAuthoritys, navigateDirtyCheck } from '@/utils/utils'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import withStyles from '@material-ui/core/styles/withStyles'
import appStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx'
import Loading from '@/components/PageLoading/index'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { initStream } from '@/utils/realtime'
import { initClinicSettings } from '@/utils/config'
import Authorized, { reloadAuthorized } from '@/utils/Authorized'
import defaultSettings from '@/defaultSettings'
import { getMenuData } from '@ant-design/pro-layout'
import styles from './BasicLayout.less'
import RightContent from './components/RightContent'
import ErrorBoundary from './ErrorBoundary'
import GlobalModalContainer from './GlobalModalContainer'
import HeaderBreadcrumb from './components/HeaderBreadcrumb'

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

    this.setState({
      authorized: true,
    })

    const { pathname } = location
    checkAuthoritys(pathname, history)
  }

  resize = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false })
    }
    if (window) {
      this.props.dispatch({
        type: 'global/updateState',
        payload: {
          mainDivHeight: window.innerHeight - headerHeight,
        },
      })
    }
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

  render() {
    const {
      classes,
      loading,
      theme,
      route,
      clinicSettings: { settings = [] },
      ...props
    } = this.props
    const routesConfig = {
      ...route,
      routes: route.routes.map(current => {
        const clinicSettingDisabledRoutes =
          current.clinicSetting &&
          current.clinicSetting.filter(
            s => typeof settings[s] === 'boolean' && !settings[s],
          ).length >= current.clinicSetting.length
        if (
          clinicSettingDisabledRoutes ||
          Authorized.check(current.authority)?.rights === 'hidden'
        ) {
          return {
            ...current,
            hideInMenu: true,
          }
        }

        return {
          ...current,
          routes: current.routes?.map(route => {
            const clinicSettingDisabledRoute =
              route.clinicSetting &&
              route.clinicSetting.filter(
                s => typeof settings[s] === 'boolean' && !settings[s],
              ).length >= route.clinicSetting.length
            if (
              clinicSettingDisabledRoute ||
              Authorized.check(route.authority)?.rights === 'hidden'
            ) {
              return {
                ...route,
                hideInMenu: true,
              }
            }
            return route
          }),
        }
      }, []),
    }

    NProgress.start()
    if (!loading.global) {
      NProgress.done()
    }
    const {
      children,
      location: { pathname },
    } = this.props
    return (
      <React.Fragment>
        <MuiThemeProvider theme={_theme}>
          <CssBaseline />
          <div id='main-page' style={{ height: '100vh', overflow: 'auto' }}>
            <ErrorBoundary>
              <ProLayout
                // {...defaultProps}
                {...props.setting}
                route={routesConfig}
                className={styles.root}
                headerContentRender={p => (
                  <HeaderBreadcrumb {...this.props} breadcrumb={p.breadcrumb} />
                )}
                rightContentRender={() => <RightContent {...this.props} />}
                fixedHeader
                fixSiderbar
                formatMessage={formatMessage}
                menuItemRender={(menuItemProps, defaultDom) => {
                  if (
                    menuItemProps.isUrl ||
                    !menuItemProps.path ||
                    location.pathname === menuItemProps.path
                  ) {
                    return defaultDom
                  }
                  return (
                    <Link
                      to={menuItemProps.path}
                      onClick={e => {
                        const {
                          route: { routes },
                        } = this.props
                        const rt =
                          routes
                            .map(o => o.routes || [])
                            .reduce((a, b) => {
                              return a.concat(b)
                            }, [])
                            .find(o => location.pathname === o.path) || {}

                        navigateDirtyCheck({
                          redirectUrl: menuItemProps.path,
                          displayName: rt.observe,
                        })(e)
                      }}
                    >
                      {defaultDom}
                    </Link>
                  )
                }}
                breadcrumbRender={(routers = []) => [
                  {
                    path: '/',
                    breadcrumbName: formatMessage({ id: 'menu.home' }),
                  },
                  ...routers,
                ]}
                location={{ pathname }}
              >
                {children}
              </ProLayout>
              {this.state.authorized && <GlobalModalContainer {...props} />}
            </ErrorBoundary>
          </div>
          {/* <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense> */}
        </MuiThemeProvider>
      </React.Fragment>
    )
  }
}

export default withStyles(appStyle)(
  connect(({ loading, setting, clinicSettings }) => ({
    // menuData: menu.menuData,
    clinicSettings,
    setting,
    loading,
  }))(BasicLayout),
)
