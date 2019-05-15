import React from 'react'
import { Drawer } from 'antd'
import SiderMenu from './SiderMenu'
import { getFlatMenuKeys } from './SiderMenuUtils'

const SiderMenuWrapper = React.memo(props => {
  const { isMobile, menuData, collapsed, onCollapse } = props
  const flatMenuKeys = getFlatMenuKeys(menuData)
  return <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
})

export default SiderMenuWrapper
