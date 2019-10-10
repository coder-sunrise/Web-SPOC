import React, { Component } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Add from '@material-ui/icons/Add'
import {
  GridContainer,
  GridItem,
  Button,
  CommonModal,
  withFormikExtend,
} from '@/components'
import DOGrid from './DOGrid'
import DODetails from './DODetails'
import { isPOStatusFinalized } from '../../variables'

const styles = (theme) => ({
  ...basicStyle(theme),
})

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
    this.refreshDeliveryOrder()
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

  onEditDeliveryOrderClicked = (row) => {
    const { dispatch } = this.props
    this.setState({ showDeliveryOrderDetails: true })
    dispatch({
      type: 'deliveryOrderDetails/queryDeliveryOrder',
      payload: { id: row.id },
    })
  }

  closeDODetailsModal = () => this.setState({ showDeliveryOrderDetails: false })

  render () {
    const { purchaseOrderDetails, theme } = this.props
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
          <DOGrid
            onEditDeliveryOrderClicked={this.onEditDeliveryOrderClicked}
            {...this.props}
          />
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
            // hideIfNoEditRights
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
export default withStyles(styles, { withTheme: true })(index)
