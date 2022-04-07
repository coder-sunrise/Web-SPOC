import { Breadcrumb } from 'antd'
import React, { useState, useRef } from 'react'
import { useIntl, Link } from 'umi'
import { RightOutlined } from '@ant-design/icons'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles } from '@material-ui/styles'
import { navigateDirtyCheck } from '@/utils/utils'

interface IHeaderBreadcrumbProps {
  breadcrumb: any
  classes: any
}

const styles = (theme: Theme) => ({
  breadcrumbtext: {
    fontSize: '18px',
    color: 'black',
  },
  breadcrumblink: {
    fontSize: '18px',
    color: 'black',
    '&:hover': {
      color: '#4255bd',
    },
  },
})

const HeaderBreadcrumb: React.FC<IHeaderBreadcrumbProps> = props => {
  const { breadcrumb, classes } = props
  const { pathname } = window.location
  const { formatMessage } = useIntl()

  if (breadcrumb) {
    const pathSnippets = pathname.split('/').filter(i => i)
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      const breadcrumbItem = breadcrumb[url]
      if (breadcrumbItem && breadcrumbItem.name) {
        const breadcrumbName = formatMessage({ id: breadcrumbItem.locale })
        return (
          <Breadcrumb.Item key={url}>
            {pathname === url ? (
              <span className={classes.breadcrumbtext}>{breadcrumbName}</span>
            ) : (
              <Link
                to={url}
                onClick={e => {
                  const {
                    route: { routes },
                  } = props
                  const rt =
                    routes
                      .map(o => o.routes || [])
                      .reduce((a, b) => {
                        return a.concat(b)
                      }, [])
                      .find(o => location.pathname === o.path) || {}

                  navigateDirtyCheck({
                    redirectUrl: url,
                    displayName: rt.observe,
                  })(e)
                }}
              >
                <span className={classes.breadcrumblink}>{breadcrumbName}</span>
              </Link>
            )}
          </Breadcrumb.Item>
        )
      }
      return <></>
    })

    const breadcrumbItems = [
      <Breadcrumb.Item key='home'>
        <Link to='/'>
          {' '}
          <span className={classes.breadcrumblink}>
            {' '}
            {formatMessage({ id: 'menu.home' })}
          </span>
        </Link>
      </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems)

    return (
      <div style={{ display: 'inline-block' }}>
        {' '}
        <Breadcrumb separator={<RightOutlined style={{ fontWeight: 700 }} />}>
          {breadcrumbItems}
        </Breadcrumb>
      </div>
    )
  }
  return <></>
}

export default withStyles(styles)(HeaderBreadcrumb)
