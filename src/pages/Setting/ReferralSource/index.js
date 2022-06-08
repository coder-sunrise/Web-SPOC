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

@connect(({ settingReferralSource, global }) => ({
  settingReferralSource,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({
  modelName: 'settingReferralSource',
})
class ReferralSource extends PureComponent {
  state = {}

  componentDidMount() {
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

  render() {
    const { settingReferralSource, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterReferralSourceBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterReferralSourceBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingReferralSource.showModal}
          observe='ReferralSourceDetail'
          title={
            settingReferralSource.entity
              ? 'Edit Referral Source'
              : 'Add Referral Source'
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
