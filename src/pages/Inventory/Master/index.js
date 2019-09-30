import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
// import { getAppendUrl } from '@/utils/utils'
import { compose } from 'redux'
import { NavPills, Tabs } from '@/components'
// import Consumable from './Consumable'
// import Medication from './Medication'
// import Vaccination from './Vaccination'
// import Package from './Package'
import { InventoryMasterOption } from './variables'

const styles = () => ({})

const InventoryMaster = ({ inventoryMaster, dispatch, history }) => {
  const [
    activeTab,
    setActiveTab,
  ] = useState('0')

  const componentProps = {
    dispatch,
    history,
    setActiveTab,
  }
  console.log({ activeTab, setActiveTab })

  useEffect(() => {
    const tabIndex = inventoryMaster.currentTab
    setActiveTab(tabIndex)
  }, [])
  return (
    // <NavPills
    //   color='primary'
    //   onChange={(event, active) => {
    //     history.push(
    //       getAppendUrl({
    //         t: active,
    //       }),
    //     )
    //   }}
    //   index={inventoryMaster.currentTab}
    //   contentStyle={{ margin: '0 -5px' }}
    //   tabs={[
    //     {
    //       tabButton: 'Medication',
    //       tabContent: <Medication {...componentProps} />,
    //     },
    //     {
    //       tabButton: 'Consumable',
    //       tabContent: <Consumable {...componentProps} />,
    //     },
    //     {
    //       tabButton: 'Vaccination',
    //       tabContent: <Vaccination {...componentProps} />,
    //     },
    //     {
    //       tabButton: 'Package',
    //       tabContent: <Package {...componentProps} />,
    //     },
    //   ]}
    // />
    <Tabs
      style={{ marginTop: 20 }}
      activeKey={activeTab}
      onChange={(e) => setActiveTab(e)}
      options={InventoryMasterOption(componentProps)}
    />
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ inventoryMaster, pack }) => ({
    inventoryMaster,
    pack,
  })),
)(InventoryMaster)
