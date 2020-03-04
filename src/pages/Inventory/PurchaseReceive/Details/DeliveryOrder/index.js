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
import { isPOStatusFinalized, isPOStatusFulfilled } from '../../variables'
import AuthorizedContext from '@/components/Context/Authorized'
import { INVOICE_STATUS } from '@/utils/constants'
import { podoOrderType, getInventoryItemList } from '@/utils/codes'

const styles = (theme) => ({
  ...basicStyle(theme),
  errorMsgStyle: {
    margin: theme.spacing(2),
    color: '#cf1322',
    fontSize: ' 0.75rem',
    minHeight: '1em',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    lineHeight: '1em',
    letterSpacing: ' 0.03333em',
  },
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
    mode: '',
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

  onAddDeliveryOrderClicked = async () => {
    await this.queryInventoryItem()
    this.setState({ showDeliveryOrderDetails: true, mode: 'Add' })
  }

  queryInventoryItem = async () => {
    const { dispatch } = this.props
    let inventoryList = []
    for (const x of podoOrderType) {
      inventoryList.push(
        dispatch({
          type: 'codetable/fetchCodes',
          payload: {
            code: x.ctName,
          },
        }),
      )
    }

    inventoryList = await Promise.all(inventoryList)
    for (let i = 0; i < podoOrderType.length; i++) {
      const { inventoryItemList } = getInventoryItemList(
        inventoryList[i],
        podoOrderType[i].itemFKName,
        podoOrderType[i].stateName,
        podoOrderType[i].stockName,
      )
      this.setState({
        [podoOrderType[i].stateName]: inventoryItemList,
      })
      dispatch({
        type: 'deliveryOrderDetails/updateState',
        payload: {
          [podoOrderType[i].stateName]: inventoryItemList,
        },
      })
    }
  }

  onEditDeliveryOrderClicked = async (row) => {
    const { dispatch } = this.props
    await this.queryInventoryItem()
    await dispatch({
      type: 'deliveryOrderDetails/queryDeliveryOrder',
      payload: { id: row.id },
    })
    this.setState({ showDeliveryOrderDetails: true, mode: 'Edit' })
  }

  closeDODetailsModal = () =>
    this.setState({ showDeliveryOrderDetails: false, mode: '' })

  render () {
    const { purchaseOrderDetails, theme } = this.props
    const { purchaseOrder } = purchaseOrderDetails
    const poStatus = purchaseOrder ? purchaseOrder.purchaseOrderStatusFK : 1
    const isWriteOff = purchaseOrder
      ? purchaseOrder.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false
    const { showDeliveryOrderDetails, mode } = this.state
    const isEditable = () => {
      if (poStatus === 6) return false
      if (isWriteOff) return false
      return true
    }
    return (
      <AuthorizedContext.Provider
        value={{
          rights: isEditable() ? 'enable' : 'disable',
          // rights: 'disable',
        }}
      >
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
              observe='deliveryOrderDetails'
            >
              <DODetails
                refreshDeliveryOrder={this.refreshDeliveryOrder}
                {...this.props}
                mode={mode}
              />
            </CommonModal>
            {!isPOStatusFulfilled(poStatus) ? (
              <Button
                // disabled={isPOStatusFulfilled(poStatus)}
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
            ) : (
              ''
            )}
          </GridContainer>
        </div>
      </AuthorizedContext.Provider>
    )
  }
}
export default withStyles(styles, { withTheme: true })(index)
