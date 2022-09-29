import { useState } from 'react'
import { PageContainer, Icon } from '@/components'
import { connect, history } from 'umi'
import { InventoryMasterOption } from './variables'

const tabs = InventoryMasterOption().map(o => {
  return {
    ...o,
    key: o.name?.toLocaleLowerCase(),
    tab: o.name,
  }
})

const InventoryMasterIndex = () => {
  const [tabKey, setTabKey] = useState('consumable')
  const currentTab = tabs.find(o => o.key === tabKey)
  if (!currentTab?.component) return null
  const TabContent = currentTab?.component
  return (
    <PageContainer
      tabList={tabs}
      onTabChange={key => {
        console.log(
          key,
          tabs.find(o => o.key === key),
        )
        setTabKey(key)
      }}
    >
      <TabContent />
    </PageContainer>
  )
}

// @ts-ignore
export default connect(({ patient }) => {
  return {
    patient,
  }
})(InventoryMasterIndex)
