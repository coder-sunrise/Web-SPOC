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
  state = {
    referralSource: [],
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'settingReferralPerson/query',
    })

    this.props.dispatch({
      type: 'settingReferralPerson/getReferralSourceList',
      payload: {
        pagesize: 9999,
      },
    })
      .then((response) => {
        const { data } = response || []
        const templateOptions = data
          .filter((template) => template.isActive)
          .map((template) => {
            return {
              ...template,
              value: template.id,
              name: template.name,
            }
          })
        this.setState({ referralSource: templateOptions })
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
      referralSource: this.state.referralSource,
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
