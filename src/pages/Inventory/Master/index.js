import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'

import { PageHeaderWrapper, NavPills, CardContainer } from '@/components'

import Consumable from './Consumable'
import Medication from './Medication'
import Vaccination from './Vaccination'
import Pack from './Package'

const styles = () => ({})
@connect(({ inventoryMaster }) => ({
  inventoryMaster,
}))
@compare('inventoryMaster')
class InventoryMaster extends PureComponent {
  render () {
    // console.log(this)
    const { props } = this
    const { classes, theme, inventoryMaster, ...restProps } = props
    return (
      <NavPills
        color='info'
        onChange={(event, active) => {
          this.props.history.push(
            getAppendUrl({
              t: active,
            }),
          )
        }}
        index={inventoryMaster.currentTab}
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'Consumable',
            tabContent: <Consumable {...restProps} />,
          },
          {
            tabButton: 'Medication',
            tabContent: <Medication {...restProps} />,
          },
          {
            tabButton: 'Vaccination',
            tabContent: <Vaccination {...restProps} />,
          },
          {
            tabButton: 'Package',
            tabContent: <Pack {...restProps} />,
          },
        ]}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(InventoryMaster)
