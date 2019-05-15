import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'

import {
  PageHeaderWrapper,
  NavPills,
  CardContainer,
  notification,
} from '@/components'

import Company from './Company/index'
import ReferralPerson from './ReferralPerson/index'
import CoPayment from './CoPayment/index'

const styles = () => ({})
@connect(({ scheme }) => ({
  scheme,
}))
@compare('scheme')
class Detail extends PureComponent {
  render () {
    // console.log(this)
    const { props } = this
    const { classes, theme, ...restProps } = props
    const { scheme } = restProps
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
        index={scheme.currentTab}
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'Company',
            tabContent: <Company {...restProps} />,
          },
          {
            tabButton: 'Referral Person',
            tabContent: <ReferralPerson {...restProps} />,
          },
          {
            tabButton: 'Co-Payment',
            tabContent: <CoPayment {...restProps} />,
          },
        ]}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
