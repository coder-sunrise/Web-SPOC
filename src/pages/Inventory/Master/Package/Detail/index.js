import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'
import { Remove, Apps } from '@material-ui/icons'
import { NavPills } from '@/components'

import DetailPanel from '../../Details/Detail'
import Pricing from '../../Details/Pricing'
import Stock from '../../Details/Stock'
import {CommonTableGrid,CommonTableGrid2,Tooltip,Button }from '@/components'
// dev grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Grid from '../Detail/Grid'

const styles = () => ({})
@connect(({ pack }) => ({
  pack,
}))
@compare('pack')



class Detail extends PureComponent {

  render () {
    const { classes, theme, ...restProps } = this.props
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
          this.props.history.push(
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
          {
            tabButton: 'Medication',
            tabContent: <Grid {...pMedi}></Grid>,
          },
          {
            tabButton: 'Vaccination',
            tabContent: <Grid {...pVacc}></Grid>,
          },
          {
            tabButton: 'Consumable',
            tabContent: <Grid {...pCons}></Grid>,
          },
          {
            tabButton: 'Service',
            tabContent: <Grid {...pServ}></Grid>,
          },
        ]}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
