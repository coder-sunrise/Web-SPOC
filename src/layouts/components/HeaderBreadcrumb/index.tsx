
import { Breadcrumb } from 'antd'
import React, { useState, useRef } from 'react'
import { useIntl, Link } from 'umi'
import { RightOutlined } from '@ant-design/icons'

import styles from './style.less'

interface HeaderBreadcrumbProps {
  breadcrumb: any;
}

const HeaderBreadcrumb: React.FC<HeaderBreadcrumbProps> = (props) => {
  const { breadcrumb } = props
  const { pathname } = window.location
  const { formatMessage } = useIntl()

  if (breadcrumb) {
    const pathSnippets = pathname.split('/').filter(i => i)
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      return (
        <Breadcrumb.Item key={url}>
          {
            pathname === url
              ? <span className={styles.breadcrumbtext}>{breadcrumb[url].name}</span>
              : (<Link to={url}><span className={styles.breadcrumblink}>{breadcrumb[url].name}</span></Link>)
          }
        </Breadcrumb.Item>
      )
    })

    const breadcrumbItems = [
      <Breadcrumb.Item key="home">
        <Link to="/"> <span className={styles.breadcrumblink}> {formatMessage({ id: 'menu.home' })}</span></Link>
      </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems)

    return <div style={{ display: 'inline-block' }}> <Breadcrumb separator={<RightOutlined style={{ fontWeight: 700 }} />}>{breadcrumbItems}</Breadcrumb></div>

  }
  return <></>
}

export default HeaderBreadcrumb