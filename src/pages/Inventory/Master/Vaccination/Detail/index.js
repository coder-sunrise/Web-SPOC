import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'

import { NavPills } from '@/components'

import DetailPanel from '../../Details/Detail'
import Pricing from '../../Details/Pricing'
import Stock from '../../Details/Stock'

const styles = () => ({})
@connect(({ vaccination }) => ({
  vaccination,
}))
@compare('vaccination')
class Detail extends PureComponent {
  render () {
    const { classes, theme, ...restProps } = this.props
    const p = {
      ...restProps,
      modelType: 'vaccination',
      type: 'Vaccination',
    }
    const { vaccination } = restProps
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
        index={vaccination.currentTab}
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'Detail',
            tabContent: <DetailPanel {...p} />,
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
