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

@connect(({ settingReferralPerson }) => ({
  settingReferralPerson,
}))
@withSettingBase({
  modelName: 'settingReferralPerson',
})
class ReferralPerson extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingReferralPerson/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingReferralPerson/updateState',
      payload: {
        showModal: !this.props.settingReferralPerson.showModal,
      },
    })
  }

  render () {
    const { settingReferralPerson } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />

        <CommonModal
          open={settingReferralPerson.showModal}
          observe='ReferralPersonDetail'
          title={
            settingReferralPerson.entity ? (
              'Edit Referral Person'
            ) : (
                'Add Referral Person'
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

export default withStyles(styles, { withTheme: true })(ReferralPerson)
