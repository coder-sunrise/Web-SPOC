import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingPaymentMode }) => ({
  settingPaymentMode,
}))
@withSettingBase({ modelName: 'settingPaymentMode' })
class Room extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingPaymentMode/query',
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
    const {
      classes,
      settingPaymentMode,
      dispatch,
      theme,
      ...restProps
    } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
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
