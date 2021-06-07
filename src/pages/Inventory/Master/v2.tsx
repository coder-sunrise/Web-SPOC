import { useState } from 'react'
import { PageContainer, Icon } from '@/components'
import { ProTable, Select, Input, Button } from '@medisys/component'
import patientService from '@/services/patient'
import { connect, history } from 'umi'
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import MedicationList from './Medicationv2'
import { InventoryMasterOption } from './variables'

const tabs = InventoryMasterOption().map(o => {
  return {
    ...o,
    key: o.name?.toLocaleLowerCase(),
    tab: o.name,
  }
})
console.log(tabs)

const { queryListV2, upsert, query, remove } = patientService
const api = {
  remove,
  create: upsert,
  update: upsert,
  queryList: queryListV2,
  query,
}
const InventoryMasterIndex = ({ dispatch }) => {
  const [tabKey, setTabKey] = useState('medication')
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
