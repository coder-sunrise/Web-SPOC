import React, { Component } from 'react'
import { connect } from 'dva'
import { CardContainer, Tabs } from '@/components'
import { PurchaseReceiveDetailOption } from '../subComponents'

@connect(({ purchaseOrderDetails, clinicSettings, clinicInfo }) => ({
  purchaseOrderDetails,
  clinicSettings,
  clinicInfo,
}))
class index extends Component {
  componentWillUnmount () {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })
  }

  render () {
    const { purchaseOrderDetails } = this.props
    const { purchaseOrder } = purchaseOrderDetails
    const poStatus = purchaseOrder ? purchaseOrder.purchaseOrderStatusFK : 1
    return (
      <CardContainer hideHeader>
        <Tabs
          defaultActiveKey='0'
          options={PurchaseReceiveDetailOption(poStatus, this.props)}
        />
      </CardContainer>
    )
  }
}

export default index
