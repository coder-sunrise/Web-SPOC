import React, { PureComponent, createElement } from 'react'
import pathToRegexp from 'path-to-regexp'
import { Breadcrumb } from 'antd'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import headerStyle from 'mui-pro-jss/material-dashboard-pro-react/components/headerStyle.jsx'
import Button from 'mui-pro-components/CustomButtons'
import Link from 'umi/link'
import styles from './index.less'
import { urlToList } from '../_utils/pathTools'

import { navigateDirtyCheck } from '@/utils/utils'

export const getBreadcrumb = (breadcrumbNameMap = [], url) => {
  let breadcrumb = breadcrumbNameMap[url]
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item]
      }
    })
  }
  return breadcrumb || {}
}

class BreadcrumbView extends PureComponent {
  state = {
    breadcrumb: null,
  }

  componentDidMount () {
    this.getBreadcrumbDom()
  }

  componentDidUpdate (preProps) {
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

    const breadcrumb = this.conversionBreadcrumbList()

    this.setState({
      breadcrumb,
    })
  }

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props
    return {
      routes,
      params,
      routerLocation: location,
      breadcrumbNameMap,
    }
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
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map((item) => {
          const title = itemRender ? itemRender(item) : item.title
          return (
            <Breadcrumb.Item key={item.title}>
              {item.href ? (
                createElement(
                  linkElement,
                  {
                    [linkElement === 'a' ? 'href' : 'to']: item.href,
                  },
                  title,
                )
              ) : (
                title
              )}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    )
  }

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const {
      classes,
      breadcrumbSeparator,
      home,
      itemRender,
      linkElement = Link,
    } = this.props
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname)
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
      return currentBreadcrumb.name &&
      !currentBreadcrumb.hideInBreadcrumb ? location.pathname === targetUrl ? (
        <Typography color='textPrimary'>{name}</Typography>
      ) : (
        <Link to={targetUrl} onClick={navigateDirtyCheck(targetUrl)}>
          {name}
        </Link>
      ) : null
    })
    // Add home breadcrumbs to your head
    // console.log(pathSnippets)
    // extraBreadcrumbItems.unshift(
    //   <Breadcrumb.Item key="home">
    //     <Button href="#" className={classes.title} color="transparent">

    //       {createElement(
    //       linkElement,
    //       {
    //         [linkElement === 'a' ? 'href' : 'to']: '/',
    //       },
    //       home || 'Home'
    //     )}
    //     </Button>
    //   </Breadcrumb.Item>
    // )
    return (
      // <div >
      <Breadcrumbs
        className={classes.breadcrumb}
        separator={<NavigateNextIcon fontSize='small' />}
      >
        {extraBreadcrumbItems}
      </Breadcrumbs>
      // </Typography>
    )
  }

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator, classes } = this.props
    const {
      routes,
      params,
      routerLocation,
      breadcrumbNameMap,
    } = this.getBreadcrumbProps()
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps()
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={classes.breadcrumb}
          routes={routes.filter((route) => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      )
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap)
    }
    return null
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

  render () {
    const { breadcrumb } = this.state
    return breadcrumb
  }
}
export default withStyles(headerStyle)(BreadcrumbView)
