import React, { Component } from 'react'
import { connect } from 'dva'
import { CardContainer, Tabs, withFormikExtend } from '@/components'
import { formatMessage } from 'umi/locale'
import { PurchaseReceiveDetailOption, isPOStatusDraft } from '../variables'

@connect(({ purchaseOrderDetails }) => ({
  purchaseOrderDetails,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseOrderDetails }) => {
    console.log('mapPropsToValues', purchaseOrderDetails)
    return purchaseOrderDetails.entity
  },
})
class index extends Component {
  state = {
    purchaseOrderStatus: 'Draft',
  }

  static getDerivedStateFromProps (props, state) {
    const { values } = props
    const { purchaseOrder } = values

    console.log('state', props)

    if (purchaseOrder) {
      const { status } = purchaseOrder
      if (status !== state.purchaseOrderStatus) {
        return {
          ...state,
          purchaseOrderStatus: status,
        }
      }
    }

    return null
  }

  componentDidMount () {
    const { purchaseOrderDetails } = this.props
    const { id, type } = purchaseOrderDetails
    switch (type) {
      // Duplicate order
      case 'dup':
        this.props.dispatch({
          type: 'purchaseOrderDetails/fakeQueryDone',
          payload: {
            id: id,
            type: type,
          },
        })
        break
      // Edit order
      case 'edit':
        this.props.dispatch({
          type: 'purchaseOrderDetails/fakeQueryDone',
          payload: {
            id: id,
            type: type,
          },
        })
        break
      // Create new order
      default:
        this.props.dispatch({
          type: 'purchaseOrderDetails/initState',
        })
        break
    }
  }

  render () {
    console.log('PR Index', this.props)

    const { purchaseOrderStatus } = this.state
    const isDraft = isPOStatusDraft(purchaseOrderStatus)

    return (
      <CardContainer hideHeader>
        <Tabs
          defaultActiveKey='0'
          options={PurchaseReceiveDetailOption(isDraft)}
        />
      </CardContainer>
    )
  }
}
export default index
