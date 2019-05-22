import React, { Suspense } from 'react'
import NProgress from 'nprogress'
// import { renderWhenReady} from '@sencha/ext-react'
// import { Panel } from '@sencha/ext-modern'
import router from 'umi/router'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Layout, Affix } from 'antd'
import DocumentTitle from 'react-document-title'
import isEqual from 'lodash/isEqual'
import memoizeOne from 'memoize-one'
import { connect } from 'dva'
import { ContainerQuery } from 'react-container-query'
import cx from 'classnames'
import pathToRegexp from 'path-to-regexp'
import Media from 'react-media'
import { formatMessage } from 'umi/locale'
import Authorized from '@/utils/Authorized'
import PerfectScrollbar from 'perfect-scrollbar'
// import { ToastComponent } from '@syncfusion/ej2-react-notifications'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  primaryColor,
  dangerColor,
  roseColor,
  grayColor,
  fontColor,
} from 'mui-pro-jss'
import Sidebar from 'mui-pro-components/Sidebar'
// import logo from '../assets/logo.svg'
import image from 'assets/img/sidebar-2.jpg'
import logo from 'assets/img/logo-white.svg'
import withStyles from '@material-ui/core/styles/withStyles'
import appStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx'
import Header from 'mui-pro-components/Header'
import Footer from 'mui-pro-components/Footer'

// import Footer from './Footer'
// import Header from './Header'
import Context from './MenuContext'
import ErrorBoundary from './ErrorBoundary'
import Exception403 from '../pages/Exception/403'
import PageLoading from '@/components/PageLoading'
import SiderMenu from '@/components/SiderMenu'
import GlobalModalContainer from './GlobalModalContainer'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: primaryColor,
    },
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#000',
    // },
  },
  overrides: {
    MuiInputBase: {
      root: {
        alignItems: 'start',
        // fontSize: 14,
      },
      input: {
        padding: '4px 0 1px',
        minHeight: 24,
      },
    },
    MuiInput: {
      underline: {
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottomWidth: '1px',
        },
        '&:after': {
          borderBottomColor: primaryColor,
          // borderBottomWidth:'1px',
        },
        // "&:before": {
        //   borderBottom: '10px solid rgba(0, 0, 0, 0.42)',
        // },
        '&$focused': {
          '&:after': {
            transform: 'scaleX(1) !important',
          },
        },
      },
    },
    MuiInputAdornment: {
      root: {
        color: fontColor,
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        '& > p': {
          fontWeight: 300,
        },
      },
      positionStart: {
        marginTop: 15,
      },
      positionEnd: {
        marginTop: 15,
      },
    },
    MuiGrid: {
      'direction-xs-column': {
        '& > div': {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    // MuiTableCell: {
    //   root: {
    //     '&:last-child': {
    //       paddingLeft: 'inherit',
    //       paddingRight: 'inherit',
    //     },
    //   },
    // },
    MuiTableRow: {
      root: {
        // overflow: 'hidden',
      },
    },
    TableFixedCell: {
      fixedCell: {
        overflow: 'visible',
        backgroundColor: 'inherit',
      },
    },
    Table: {
      stickyTable: {
        ' & > thead > tr': {
          backgroundColor: '#ffffff',
        },
      },
    },
    // MuiSwitch: {
    //   switchBase: {
    //     height: 'auto',
    //     padding: '5px 4px 4px 4px',
    //   },
    // },
  },
})

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'))

const { Content } = Layout
// let ps
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
}

class BasicLayout extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      mobileOpen: false,
      miniActive: false,
    }
    this.resizeFunction = this.resizeFunction.bind(this)

    const { dispatch, route: { routes, authority } } = this.props
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    }).then((menus) => {
      this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual)
      this.breadcrumbNameMap = this.getBreadcrumbNameMap(menus)
      this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual)
      this.getPageTitle = memoizeOne(this.getPageTitle)
      this.menus = menus
      this.forceUpdate()
    })
  }

  // componentDidMount () {
  //   const {
  //     dispatch,
  //     route: { routes, authority },
  //   } = this.props

  //   dispatch({
  //     type: 'user/fetchCurrent',
  //   })
  //   dispatch({
  //     type: 'setting/getSetting',
  //   })
  //   dispatch({
  //     type: 'menu/getMenuData',
  //     payload: { routes, authority },
  //   })
  // }

  // componentDidUpdate (preProps) {
  //   // After changing to phone mode,
  //   // if collapsed is true, you need to click twice to display
  //   this.breadcrumbNameMap = this.getBreadcrumbNameMap()
  //   const { collapsed, isMobile } = this.props
  //   if (isMobile && !preProps.isMobile && !collapsed) {
  //     this.handleMenuCollapse(false)
  //   }
  // }

  componentDidMount () {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps = new PerfectScrollbar(this.refs.mainPanel, {
    //     suppressScrollX: true,
    //     suppressScrollY: false,
    //   })
    //   document.body.style.overflow = "hidden"
    // }

    // check token, logout if token not exist
    const hasToken = sessionStorage.getItem('token')
    !hasToken && router.push('/login')

    window.addEventListener('resize', this.resizeFunction)

    const { dispatch, route: { routes, authority } } = this.props

    // dispatch({
    //   type: 'user/fetchCurrent',
    // })
    dispatch({
      type: 'setting/getSetting',
    })
  }

  componentWillUnmount () {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps.destroy()
    // }
    window.removeEventListener('resize', this.resizeFunction)
  }

  componentDidUpdate (e) {
    if (e.history.location.pathname !== e.location.pathname) {
      if (window.mainPanel) window.mainPanel.scrollTop = 0
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false })
      }
    }

    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    // this.breadcrumbNameMap = this.getBreadcrumbNameMap()
    // const { collapsed, isMobile } = this.props
    // if (isMobile && !preProps.isMobile && !collapsed) {
    //   this.handleMenuCollapse(false)
    // }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  getRoute () {
    return this.props.location.pathname !== '/maps/full-screen-maps'
  }

  resizeFunction () {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false })
    }
  }

  getContext () {
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
  getBreadcrumbNameMap (menus) {
    const routerMap = {}
    const flattenMenuData = (data) => {
      data.forEach((menuItem) => {
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

  matchParamsPath = (pathname) => {
    if (!this.breadcrumbNameMap) return null
    const pathKey = Object.keys(this.breadcrumbNameMap).find((key) =>
      pathToRegexp(key).test(pathname),
    )
    return this.breadcrumbNameMap[pathKey]
  }

  getPageTitle = (pathname) => {
    const currRouterData = this.matchParamsPath(pathname)

    if (!currRouterData) {
      return 'SEMR V2'
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    })
    return `${pageName} - SEMR V2`
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

  handleMenuCollapse = (collapsed) => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }

  // renderSettingDrawer = () => {
  //   // Do not render SettingDrawer in production
  //   // unless it is deployed in preview.pro.ant.design as demo
  //   if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
  //     return null
  //   }
  //   return <SettingDrawer />
  // };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  sidebarMinimize = () => {
    this.setState({ miniActive: !this.state.miniActive })
    const { dispatch } = this.props
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !this.state.miniActive,
    })
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  getRoute = () => {
    return this.props.location.pathname !== '/maps/full-screen-maps'
  }

  render () {
    const { classes, loading, ...props } = this.props

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
    } = this.props
    // console.log(this.props)
    const isTop = PropsLayout === 'topmenu'
    const routerConfig = this.matchParamsPath(pathname)
    const mainPanel = `${classes.mainPanel} ${cx({
      [classes.mainPanelSidebarMini]: this.state.miniActive,
    })}`
    // console.log(this.props)
    const layout = (
      <div className={classes.wrapper}>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            logoText='SEMR V2'
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            image={image}
            // handleDrawerToggle={this.handleDrawerToggle}
            // open={this.state.mobileOpen}
            open={this.state.mobileOpen}
            color='blue'
            bgColor='black'
            handleDrawerToggle={this.handleDrawerToggle}
            miniActive={this.state.miniActive}
            {...props}
          />
          // <Sidebar
          //   routes={menuData}
          //   logoText="Creative Tim"
          //   logo={logo}
          //   image={image}
          //   handleDrawerToggle={this.handleDrawerToggle}
          //   open={this.state.mobileOpen}
          //   color="blue"
          //   bgColor="black"
          //   miniActive={this.state.miniActive}
          //   {...this.props}
          // />
        )}
        <div
          className={mainPanel}
          ref={(node) => {
            // this.mainPanel = node
            window.mainPanel = node
          }}
        >
          {/* <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...props}
          /> */}
          <Affix target={() => window.mainPanel}>
            <Header
              sidebarMinimize={this.sidebarMinimize}
              miniActive={this.state.miniActive}
              menuData={menuData}
              breadcrumbNameMap={this.breadcrumbNameMap}
              // routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              {...props}
            />
          </Affix>

          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>
                <Authorized
                  authority={routerConfig && routerConfig.authority}
                  noMatch={<Exception403 />}
                >
                  {children}
                </Authorized>
              </div>
            </div>
          ) : (
            <div className={classes.map}>
              <Authorized
                authority={routerConfig && routerConfig.authority}
                noMatch={<Exception403 />}
              >
                {children}
              </Authorized>
            </div>
          )}
          {/* <Content style={this.getContentStyle()}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content> */}
          {/* <Footer /> */}
          {this.getRoute() ? <Footer fluid /> : null}
        </div>
      </div>
    )
    // console.log(this)
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <ContainerQuery query={query}>
              {(params) => (
                <Context.Provider value={this.getContext()}>
                  <ErrorBoundary>
                    {!global.fullscreen && (
                      <div className={cx(params)}>{layout}</div>
                    )}
                    <GlobalModalContainer {...props} />
                  </ErrorBoundary>
                </Context.Provider>
              )}
            </ContainerQuery>
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
    menuData: menu.menuData,
    ...setting,
    loading,
  }))((props) => (
    <Media query='(max-width: 599px)'>
      {(isMobile) => <BasicLayout {...props} isMobile={isMobile} />}
    </Media>
  )),
)
