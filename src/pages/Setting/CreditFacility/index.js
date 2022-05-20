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

@connect(({ settingCreditFacility, global }) => ({
  settingCreditFacility,
  global,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingCreditFacility' })
class CreditFacility extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingCreditFacility/query',
      payload: {
        isActive:true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingCreditFacility/updateState',
      payload: {
        showModal: !this.props.settingCreditFacility.showModal,
      },
    })
  }

  render() {
    const { settingCreditFacility, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 110 - ($('.filterBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingCreditFacility.showModal}
          observe='CreditFacilityDetail'
          title={
            settingCreditFacility.entity
              ? 'Edit Credit Facility'
              : 'Add Credit Facility'
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

export default withStyles(styles, { withTheme: true })(CreditFacility)
