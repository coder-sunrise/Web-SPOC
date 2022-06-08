import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingReferralPerson, global }) => ({
  settingReferralPerson,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({
  modelName: 'settingReferralPerson',
})
class ReferralPerson extends PureComponent {
  state = {
    referralSource: [],
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'settingReferralPerson/query',
    })

    this.props
      .dispatch({
        type: 'settingReferralPerson/getReferralSourceList',
        payload: {
          pagesize: 9999,
        },
      })
      .then(response => {
        const { data } = response || []
        const templateOptions = data
          .filter(template => template.isActive)
          .map(template => {
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

  render() {
    const { settingReferralPerson, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
      referralSource: this.state.referralSource,
    }
    let height =
      mainDivHeight - 120 - ($('.filterReferralPersonBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterReferralPersonBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingReferralPerson.showModal}
          observe='ReferralPersonDetail'
          title={
            settingReferralPerson.entity
              ? 'Edit Referral Person'
              : 'Add Referral Person'
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
