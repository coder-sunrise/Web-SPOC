import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
// import { getAppendUrl } from '@/utils/utils'
import { compose } from 'redux'
import { Tabs } from '@/components'
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
  ] = useState('-1')

  const [
    mounted,
    setMounted,
  ] = useState(false)

  const componentProps = {
    dispatch,
    history,
    setActiveTab,
  }

  const didMount = async () => {
    await Promise.all([
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctSupplier',
        },
      }),
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctmedicationunitofmeasurement',
        },
      }),
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctConsumableUnitOfMeasurement',
        },
      }),
    ])
    setMounted(true)
    let tabIndex = inventoryMaster.currentTab
    if (!tabIndex) {
      tabIndex = '0'
    }
    setActiveTab(tabIndex)
  }

  useEffect(() => {
    didMount()
  }, [])

  return (
    <Tabs
      style={{ marginTop: 20 }}
      activeKey={mounted ? activeTab : '-1'}
      // defaultActivekey='0'
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
