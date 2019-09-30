import React, { Component } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import Add from '@material-ui/icons/Add'
import {
  GridContainer,
  GridItem,
  Button,
  CommonModal,
  withFormikExtend,
} from '@/components'
import { isPOStatusFinalized } from '../../variables'
import DOGrid from './DOGrid'
import DODetails from './DODetails'

// @withFormikExtend({
//   displayName: 'deliveryOrderDetails',
//   enableReinitialize: true,
//   mapPropsToValues: ({ deliveryOrderDetails }) => {
//     return deliveryOrderDetails
//   },
// })
@connect(({ purchaseOrderDetails, deliveryOrderDetails }) => ({
  purchaseOrderDetails,
  deliveryOrderDetails,
}))
class index extends Component {
  state = {
    showDeliveryOrderDetails: false,
  }

  componentDidMount () {
    // this.props.dispatch({
    //   type: 'deliveryOrderDetails/queryDeliveryOrder',
    // })

    this.props.dispatch({
      type: 'deliveryOrderDetails/getOutstandingPOItem',
      payload: this.props.purchaseOrderDetails,
    })
  }

  refreshDeliveryOrder = () => {
    this.props.dispatch({
      type: 'deliveryOrderDetails/getOutstandingPOItem',
      payload: this.props.purchaseOrderDetails,
    })
  }

  onAddDeliveryOrderClicked = () => {
    const { dispatch } = this.props
    this.setState({ showDeliveryOrderDetails: true })
    dispatch({
      type: 'deliveryOrderDetails/addNewDeliveryOrder',
    })
  }

  onEditDeliveryOrderClicked = () =>
    this.setState({ showDeliveryOrderDetails: true })

  closeDODetailsModal = () => this.setState({ showDeliveryOrderDetails: false })

  render () {
    const { purchaseOrderDetails } = this.props
    const { purchaseOrder } = purchaseOrderDetails
    const poStatus = purchaseOrder ? purchaseOrder.purchaseOrderStatusFK : 1
    const { showDeliveryOrderDetails } = this.state

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} md={12}>
            <h4 style={{ fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.dod.do',
              })}
            </h4>
          </GridItem>
          <DOGrid {...this.props} />
          <CommonModal
            open={showDeliveryOrderDetails}
            title='Delivery Order Details'
            maxWidth='xl'
            bodyNoPadding
            onConfirm={this.closeDODetailsModal}
            onClose={this.closeDODetailsModal}
          >
            <DODetails
              refreshDeliveryOrder={this.refreshDeliveryOrder}
              {...this.props}
            />
          </CommonModal>
          <Button
            disabled={!isPOStatusFinalized(poStatus)}
            onClick={this.onAddDeliveryOrderClicked}
            hideIfNoEditRights
            color='info'
            link
          >
            <Add />
            {formatMessage({
              id: 'inventory.pr.detail.dod.addDeliveryOrder',
            })}
          </Button>
        </GridContainer>
      </div>
    )
  }
}

export default index
