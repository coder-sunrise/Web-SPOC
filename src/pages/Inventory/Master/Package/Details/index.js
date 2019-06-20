import React from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import DetailPanel from './Detail'
// import Pricing from '../../DetaPricing'
// import Stock from '../../Details/Stock'
import Grid from '../../Grid'
import { NavPills } from '@/components'

const styles = () => ({})
const Detail = (props) => {
  const { classes, theme, ...restProps } = props
  const p = {
    ...restProps,
    modelType: 'pack',
    type: 'Package',
  }
  const { pack } = restProps

  const pMedi = {
    ...restProps,
    modelType: 'Medication',
    type: 'Medication',
  }

  const pVacc = {
    ...restProps,
    modelType: 'Vaccination',
    type: 'Vaccination',
  }

  const pCons = {
    ...restProps,
    modelType: 'Consumable',
    type: 'Consumable',
  }

  const pServ = {
    ...restProps,
    modelType: 'Service',
    type: 'Service',
  }

  return (
    <NavPills
      color='info'
      onChange={(event, active) => {
        props.history.push(
          getAppendUrl({
            t: active,
          }),
        )
      }}
      index={pack.currentTab}
      contentStyle={{ margin: '0 -5px' }}
      tabs={[
        {
          tabButton: 'Detail',
          tabContent: <DetailPanel {...p} />,
        },
        // {
        //   tabButton: 'Medication',
        //   tabContent: <Grid {...pMedi} />,
        // },
        // {
        //   tabButton: 'Vaccination',
        //   tabContent: <Grid {...pVacc} />,
        // },
        // {
        //   tabButton: 'Consumable',
        //   tabContent: <Grid {...pCons} />,
        // },
        // {
        //   tabButton: 'Service',
        //   tabContent: <Grid {...pServ} />,
        // },
      ]}
    />
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ pack }) => ({
    pack,
  })),
)(Detail)
