import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { NavPills } from '@/components'
import { compose } from 'redux'
import Consumable from './Consumable'
import Medication from './Medication'
import Vaccination from './Vaccination'
import Package from './Package'

const styles = () => ({})

const InventoryMaster = ({ inventoryMaster, dispatch, history }) => {
  const componentProps = {
    dispatch,
    history,
  }
  return (
    <NavPills
      color='primary'
      onChange={(event, active) => {
        history.push(
          getAppendUrl({
            t: active,
          }),
        )
      }}
      index={inventoryMaster.currentTab}
      contentStyle={{ margin: '0 -5px' }}
      tabs={[
        {
          tabButton: 'Medication',
          tabContent: <Medication {...componentProps} />,
        },
        {
          tabButton: 'Consumable',
          tabContent: <Consumable {...componentProps} />,
        },
        {
          tabButton: 'Vaccination',
          tabContent: <Vaccination {...componentProps} />,
        },
        {
          tabButton: 'Package',
          tabContent: <Package {...componentProps} />,
        },
      ]}
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
