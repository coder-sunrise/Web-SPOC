import React, { PureComponent, createElement } from 'react'
import pathToRegexp from 'path-to-regexp'
import { Breadcrumb } from 'antd'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import headerStyle from 'mui-pro-jss/material-dashboard-pro-react/components/headerStyle.jsx'
import Button from 'mui-pro-components/CustomButtons'
import { Link } from 'umi'
import { navigateDirtyCheck } from '@/utils/utils'
import styles from './index.less'
import { urlToList } from '../_utils/pathTools'

export const getBreadcrumb = (breadcrumbNameMap = [], url) => {
  let breadcrumb = breadcrumbNameMap[url]
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item]
      }
    })
  }
  return breadcrumb || {}
}

const conversionBreadcrumbList = nextProps => {
  const {
    breadcrumbList,
    breadcrumbSeparator,
    classes,
    routes,
    params,
    breadcrumbNameMap,
    itemRender,
    linkElement = Link,
    home,
    route,
  } = nextProps || this.props

  if (breadcrumbList && breadcrumbList.length) {
    return (
      <Breadcrumbs
        className={styles.breadcrumb}
        separator={breadcrumbSeparator}
      >
        {breadcrumbList.map((item, index) => {
          const title = itemRender ? itemRender(item) : item.title
          // console.log(
          //   item.active,
          //   item.href,
          //   !location.href.toLowerCase().endsWith(item.href),
          //   location.href,
          // )
          return !item.active &&
            item.href &&
            !location.href.toLowerCase().endsWith(item.href) ? (
            <Link
              key={index}
              to={item.href}
              disabled={item.disabled}
              onClick={e => {
                navigateDirtyCheck({
                  redirectUrl: item.href,
                  displayName: item.observe,
                })(e)
              }}
            >
              {title}
            </Link>
          ) : (
            <Typography key={index} color='textPrimary'>
              {title}
            </Typography>
          )
        })}
      </Breadcrumbs>
    )
  }
  // 如果传入 routes 和 params 属性
  // If pass routes and params attributes
  // console.log(routes, params)

  // if (routes && params) {
  //   return (
  //     <Breadcrumb
  //       className={classes.breadcrumb}
  //       routes={routes.filter((route) => route.breadcrumbName)}
  //       params={params}
  //       itemRender={this.itemRender}
  //       separator={breadcrumbSeparator}
  //     />
  //   )
  // }
  // 根据 location 生成 面包屑
  // Generate breadcrumbs based on location
  // console.log(breadcrumbSeparator)
  if (location && location.pathname) {
    // Convert the url to an array
    const pathSnippets = urlToList(location.pathname)
    // console.log(pathSnippets)
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url)
      if (currentBreadcrumb.inherited) {
        return null
      }
      let targetUrl = url
      if (currentBreadcrumb.children && currentBreadcrumb.children.length) {
        targetUrl = currentBreadcrumb.children[0].path
      }
      const isLinkable =
        index !== pathSnippets.length - 1 && currentBreadcrumb.component
      const name = itemRender
        ? itemRender(currentBreadcrumb, index === pathSnippets.length - 1)
        : currentBreadcrumb.name
      // console.log(routerLocation)
      // console.log(url, targetUrl)
      // console.log(location)
      // eslint-disable-next-line no-nested-ternary
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        location.pathname === targetUrl ? (
          <Typography key={index} color='textPrimary'>
            {name}
          </Typography>
        ) : (
          <Link
            key={index}
            to={targetUrl}
            onClick={e => {
              const rt =
                route.routes
                  .map(o => o.routes || [])
                  .reduce((a, b) => {
                    return a.concat(b)
                  }, [])
                  .find(o => location.pathname === o.path) || {}

              navigateDirtyCheck({
                redirectUrl: targetUrl,
                displayName: rt.observe,
              })(e)
            }}
          >
            {name}
          </Link>
        )
      ) : null
    })
    return (
      // <div >
      <Breadcrumbs
        className={classes.breadcrumb}
        separator={breadcrumbSeparator}
      >
        {extraBreadcrumbItems}
      </Breadcrumbs>
      // </Typography>
    )
  }
  return null
}

class BreadcrumbView extends PureComponent {
  state = {
    breadcrumb: null,
  }

  static defaultProps = {
    breadcrumbSeparator: <NavigateNextIcon />,
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { breadcrumbList } = nextProps
    // console.log(
    //   breadcrumbList,
    //   preState.breadcrumbList,
    //   breadcrumbList === preState.breadcrumbList,
    // )
    if (breadcrumbList !== preState.breadcrumbList) {
      const breadcrumb = conversionBreadcrumbList(nextProps)

      return {
        breadcrumbList: nextProps.breadcrumbList,
        breadcrumb,
      }
    }
    return null
  }

  componentDidMount() {
    this.getBreadcrumbDom()
  }

  componentDidUpdate(preProps) {
    const { location, breadcrumbNameMap = [] } = this.props
    if (!location || !preProps.location) {
      return
    }
    const prePathname = preProps.location.pathname
    if (
      prePathname !== location.pathname ||
      (preProps.breadcrumbNameMap || []).length !== breadcrumbNameMap.length
    ) {
      this.getBreadcrumbDom()
    }
  }

  getBreadcrumbDom = () => {
    // console.log(this.props.menuData)

    const breadcrumb = conversionBreadcrumbList(this.props)

    this.setState({
      breadcrumbList: this.props.breadcrumbList,
      breadcrumb,
    })
  }

  // Generated according to props
  conversionFromProps = () => {
    const {
      breadcrumbList,
      breadcrumbSeparator,
      itemRender,
      linkElement = Link,
    } = this.props
    return (
      <Breadcrumbs
        className={styles.breadcrumb}
        separator={breadcrumbSeparator}
      >
        {breadcrumbList.map((item, index) => {
          const title = itemRender ? itemRender(item) : item.title
          return !item.active &&
            item.href &&
            !location.href.endsWith(item.href) ? (
            <Link
              key={index}
              to={item.href}
              disabled={item.disabled}
              onClick={e => {
                navigateDirtyCheck({
                  redirectUrl: item.href,
                  displayName: item.observe,
                })(e)
              }}
            >
              {title}
            </Link>
          ) : (
            <Typography key={index} color='textPrimary'>
              {title}
            </Typography>
          )
        })}
      </Breadcrumbs>
    )
  }

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = Link } = this.props
    const last = routes.indexOf(route) === routes.length - 1
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName,
      )
    )
  }

  render() {
    const { breadcrumb } = this.state
    return breadcrumb
  }
}

export default withStyles(headerStyle)(BreadcrumbView)
