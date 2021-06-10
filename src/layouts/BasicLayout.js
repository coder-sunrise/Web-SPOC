import React, { Suspense } from 'react'
import NProgress from 'nprogress'
import $ from 'jquery'
import _ from 'lodash'
import { headerHeight } from 'mui-pro-jss'
import { ProLayout } from '@medisys/component'
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
import withStyles from '@material-ui/core/styles/withStyles'
import appStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx'
import Loading from '@/components/PageLoading/index'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { initStream } from '@/utils/realtime'
import { initClinicSettings } from '@/utils/config'
import Authorized, { reloadAuthorized } from '@/utils/Authorized'
import defaultSettings from '@/defaultSettings'
import styles from './BasicLayout.less'
import RightContent from './components/RightContent'

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
    if (window.mainPanel) {
      this.props.dispatch({
        type: 'global/updateState',
        payload: {
          mainDivHeight: window.mainPanel.offsetHeight - headerHeight,
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
    const { classes, loading, theme, ...props } = this.props
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
          <div id='main-page' style={{ height: '100vh' }}>
            <ErrorBoundary>
              <ProLayout
                // {...defaultProps}
                {...props.setting}
                route={props.route}
                className={styles.root}
                rightContentRender={() => <RightContent />}
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
  connect(({ loading, setting }) => ({
    // menuData: menu.menuData,
    setting,
    loading,
  }))(BasicLayout),
)
