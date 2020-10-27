import React, { Component } from 'react'
import { connect } from 'dva'
import { CardContainer, Tabs } from '@/components'
import { ReceivingGoodsDetailOption } from '../subComponents'

@connect(({ receivingGoodsDetails, clinicSettings, clinicInfo }) => ({
  receivingGoodsDetails,
  clinicSettings,
  clinicInfo,
}))
class Index extends Component {
  componentWillUnmount () {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })
  }

  render () {
    const { receivingGoodsDetails } = this.props
    const { receivingGoods } = receivingGoodsDetails
    const rgStatus = receivingGoods ? receivingGoods.receivingGoodsStatusFK : 1

    return (
      <CardContainer hideHeader>
        <Tabs
          defaultActiveKey='0'
          options={ReceivingGoodsDetailOption(rgStatus, this.props)}
        />
      </CardContainer>
    )
  }
}

export default Index
