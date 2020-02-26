import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingReferralSource }) => ({
  settingReferralSource,
}))
@withSettingBase({
  modelName: 'settingReferralSource',
})
class ReferralSource extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingReferralSource/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingReferralSource/updateState',
      payload: {
        showModal: !this.props.settingReferralSource.showModal,
      },
    })
  }

  render () {
    const { settingReferralSource } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />

        <CommonModal
          open={settingReferralSource.showModal}
          observe='ReferralSourceDetail'
          title={
            settingReferralSource.entity ? (
              'Edit Referral Source'
            ) : (
              'Add Referral Source'
            )
          }
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ReferralSource)
