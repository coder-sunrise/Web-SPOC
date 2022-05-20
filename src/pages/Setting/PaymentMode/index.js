import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingPaymentMode, global }) => ({
  settingPaymentMode,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingPaymentMode' })
class Room extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingPaymentMode/query',
      payload: {
        isActive:true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingPaymentMode/updateState',
      payload: {
        showModal: !this.props.settingPaymentMode.showModal,
      },
    })
  }

  render () {
    const { settingPaymentMode, mainDivHeight = 700 } = this.props
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
          open={settingPaymentMode.showModal}
          observe='PaymentModeDetail'
          title={
            settingPaymentMode.entity ? 'Edit Payment Mode' : 'Add Payment Mode'
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

export default withStyles(styles, { withTheme: true })(Room)
