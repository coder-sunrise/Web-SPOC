import React from 'react'
import Link, { FormattedMessage } from 'umi'

import { connect } from 'dva'
import Paper from '@material-ui/core/Paper'
import PageHeader from '@/components/PageHeader'
import MenuContext from '@/layouts/MenuContext'
import GridContent from './GridContent'
import styles from './index.less'

const PageHeaderWrapper = ({
  children,
  contentWidth,
  wrapperClassName,
  top,
  ...restProps
}) => (
  <div
    className={wrapperClassName}
    style={{ height: '100%', backgroundColor: '#fff' }}
  >
    {top}

    {children || null}
  </div>
)

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper)
