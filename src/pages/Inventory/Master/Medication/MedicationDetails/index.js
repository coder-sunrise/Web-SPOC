import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'

import { NavPills } from '@/components'

import DetailPanel from './Detail'
import Pricing from '../../Details/Pricing'
import Stock from '../../Details/Stock'
import Setting from './Setting'

const styles = () => ({})
@connect(({ medication }) => ({
  medication,
}))
@compare('medication')
class Detail extends PureComponent {
  render () {
    const { classes, theme, ...restProps } = this.props
    const p = {
      ...restProps,
      modelType: 'medication',
      type: 'Medication',
    }
    const { medication } = restProps
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
        index={medication.currentTab}
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'Detail',
            tabContent: <DetailPanel {...p} />,
          },
          {
            tabButton: 'Setting',
            tabContent: <Setting {...p} />,
          },
          {
            tabButton: 'Pricing',
            tabContent: <Pricing {...p} />,
          },
          {
            tabButton: 'Stock',
            tabContent: <Stock {...p} />,
          },
        ]}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
