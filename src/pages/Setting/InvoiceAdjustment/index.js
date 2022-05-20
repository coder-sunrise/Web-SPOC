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

@connect(({ settingInvoiceAdjustment, global }) => ({
  settingInvoiceAdjustment,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingInvoiceAdjustment' })
class InvoiceAdjustment extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingInvoiceAdjustment/query',
      payload: {
        isActive:true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingInvoiceAdjustment/updateState',
      payload: {
        showModal: !this.props.settingInvoiceAdjustment.showModal,
      },
    })
  }

  render () {
    const { settingInvoiceAdjustment, mainDivHeight = 700 } = this.props
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
        <Grid {...this.props} height={height} />
        <CommonModal
          open={settingInvoiceAdjustment.showModal}
          observe='InvoiceAdjustmentDetail'
          title={
            settingInvoiceAdjustment.entity ? (
              'Edit Invoice Adjustment'
            ) : (
              'Add Invoice Adjustment'
            )
          }
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(InvoiceAdjustment)
