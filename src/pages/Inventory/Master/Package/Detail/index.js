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
        ]}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
