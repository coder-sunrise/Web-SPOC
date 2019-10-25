import React, { Component } from 'react'
import { connect } from 'dva'
import { CardContainer, Tabs, withFormikExtend } from '@/components'
import { PurchaseReceiveDetailOption } from '../subComponents'
import AuthorizedContext from '@/components/Context/Authorized'

@connect(({ purchaseOrderDetails, clinicSettings, clinicInfo }) => ({
  purchaseOrderDetails,
  clinicSettings,
  clinicInfo,
}))
class Index extends Component {
  state = {
    isEditable: false,
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })
  }

  render () {
    let { purchaseOrderDetails } = this.props
    let { purchaseOrder,type } = purchaseOrderDetails
    const poStatus = purchaseOrder ? purchaseOrder.purchaseOrderStatusFK : 1

    if(type && type === 'dup' && purchaseOrder){
      purchaseOrder.purchaseOrderNo = null
      purchaseOrder.invoiceDate = null
      purchaseOrder.remark = null
      purchaseOrder.invoiceNo = null
      purchaseOrder.exceptedDeliveryDate = null
    }

    if(purchaseOrder && !purchaseOrder.IsGSTEnabled)
    {
      purchaseOrder.IsGSTEnabled = purchaseOrder.gstAmount > 0
    }

    return (
      // <AuthorizedContext.Provider
      //   value={{
      //     rights: poStatus !== 6 ? 'enable' : 'disable',
      //     // rights: 'disable',
      //   }}
      // >
      <CardContainer hideHeader>
        <Tabs
          defaultActiveKey='0'
          options={PurchaseReceiveDetailOption(poStatus, this.props)}
        />
      </CardContainer>
      // </AuthorizedContext.Provider>
    )
  }
}

export default Index
