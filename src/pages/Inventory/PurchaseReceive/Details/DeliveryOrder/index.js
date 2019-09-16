import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { Divider, withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { GridContainer, GridItem, Button, CommonModal, withFormikExtend } from '@/components'
import DeliveryOrderDetails from './Details/DeliveryOrderDetails'
import Grid from './Grid'
import Add from '@material-ui/icons/Add'
import { showErrorNotification } from '@/utils/error'
import { isPOStatusFinalized } from '../../variables'

@connect(({ deliveryOrder, purchaseOrderDetails }) => ({
  deliveryOrder,
  purchaseOrderDetails,
}))
// @withFormikExtend({
//   displayName: 'purchaseOrder',
//   enableReinitialize: true,
//   mapPropsToValues: ({ deliveryOrder }) => {
//     return deliveryOrder.entity || deliveryOrder.default
//   },
// })
class index extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'deliveryOrder/query',
    })

    this.props.dispatch({
      type: 'deliveryOrder/mapPurchaseOrder',
      payload: this.props.purchaseOrderDetails
    })
  }

  toggleDeliveryOrderDetailsModal = () => {
    this.props.dispatch({
      type: 'deliveryOrder/updateState',
      payload: {
        showModal: !this.props.deliveryOrder.showModal,
      },
    })
  }

  render() {
    console.log('DO Index', this.props)
    const { props } = this
    const { classes, deliveryOrder } = props

    const { purchaseOrder } = deliveryOrder
    const { poStatus, purchaseOrderOutstandingItem } = purchaseOrder
    const cfg = {
      toggleDeliveryOrderDetailsModal: this.toggleDeliveryOrderDetailsModal,
    }

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
          <Grid {...this.props} />
          <CommonModal
            open={deliveryOrder.showModal}
            observe='DeliveryOrderDetail'
            title={
              deliveryOrder.entity ? (
                'Edit Delivery Order'
              ) : (
                  'Delivery Order Details'
                )
            }
            maxWidth='xl'
            bodyNoPadding
            onClose={this.toggleDeliveryOrderDetailsModal}
            onConfirm={this.toggleDeliveryOrderDetailsModal}
          >
            <DeliveryOrderDetails {...cfg} {...this.props} />
          </CommonModal>
          <Button
            //onClick={this.toggleDeliveryOrderDetailsModal}
            disabled={!isPOStatusFinalized(poStatus)}
            onClick={() => {
              this.props.dispatch({
                type: 'deliveryOrder/updateState',
                payload: {
                  //entity: undefined,
                  entity: {
                    rows: purchaseOrderOutstandingItem
                  }
                },
              })
              this.toggleDeliveryOrderDetailsModal()
            }}
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
