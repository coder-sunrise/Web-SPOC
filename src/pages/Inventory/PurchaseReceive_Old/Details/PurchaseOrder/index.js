import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import Add from '@material-ui/icons/Add'
import {
  CardContainer,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  OutlinedTextField,
  EditableTableGrid,
  Button,
  CodeSelect,
  CommonModal,
} from '@/components'
import POForm from './POForm'
import Grid from './Grid'
import POSummary from './POSummary'
import { calculateItemLevelAdjustment } from '@/utils/utils'
import { isPOStatusFinalized } from '../../variables'

@connect(({ purchaseOrderDetails, gstSetup }) => ({
  purchaseOrderDetails,
  gstSetup,
}))
@withFormikExtend({
  displayName: 'purchaseOrderDetails',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseOrderDetails }) => {
    return purchaseOrderDetails.entity
  },
})
class index extends PureComponent {
  state = {
    purchaseOrderStatus: 'Draft',
  }

  static getDerivedStateFromProps (props, state) {
    const { values, purchaseOrderDetails } = props
    const { purchaseOrder } = values
    const { entity } = purchaseOrderDetails

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

  showInvoiceAdjustment = () => {
    const { theme, values, dispatch, ...resetProps } = this.props
    const { purchaseOrder } = values
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          showRemark: true,
          defaultValues: {
            initialAmout: purchaseOrder.invoiceTotal,
          },
          callbackConfig: {
            model: 'purchaseOrderDetails',
            reducer: 'addAdjustment',
          },
          callbackMethod: this.calculateInvoice,
        },
      },
    })
  }

  calculateInvoice = () => {
    const { values, setFieldValue, purchaseOrderDetails, gstSetup } = this.props
    const { rows, purchaseOrderAdjustment, purchaseOrder } = values
    /*-------------------------------------------*/
    // Retrieve from /api/GSTSetup
    const isEnableGST = gstSetup.isEnableGST === 'true'
    const gSTPercentage = Number(gstSetup.gSTPercentage)
    /*-------------------------------------------*/
    const { gstEnabled, gstIncluded } = purchaseOrder || false
    let tempInvoiceTotal = 0
    let invoiceTotal = 0
    let invoiceGST = 0
    const filteredPurchaseOrderAdjustment = purchaseOrderAdjustment.filter(
      (x) => !x.isDeleted,
    )
    const filteredPurchaseOrderItem = rows.filter((x) => !x.isDeleted)

    // Calculate all unitPrice
    filteredPurchaseOrderItem.forEach((row) => {
      tempInvoiceTotal += row.totalPrice
      row.tempSubTotal = row.totalPrice
    })
    // Check is there any adjustment was added
    if (
      filteredPurchaseOrderAdjustment &&
      filteredPurchaseOrderAdjustment.length > 0
    ) {
      // Calculate adjustment for added items
      filteredPurchaseOrderAdjustment.forEach((adj, adjKey, adjArr) => {
        if (!adj.isDeleted) {
          // Init adjAmount for percentage
          if (adj.adjType === 'Percentage') {
            adj.adjDisplayAmount = 0
          }

          filteredPurchaseOrderItem.map((item) => {
            const itemLevelAmount = calculateItemLevelAdjustment(
              adj.adjType,
              adj.adjValue,
              item.tempSubTotal,
              tempInvoiceTotal,
              isEnableGST,
              gSTPercentage,
              gstEnabled,
              gstIncluded,
            )

            if (adj.adjType === 'Percentage') {
              item[adj.id] = itemLevelAmount.itemLevelAdjustmentAmount
              item.tempSubTotal += itemLevelAmount.itemLevelAdjustmentAmount
              adj.adjDisplayAmount += itemLevelAmount.itemLevelAdjustmentAmount
            } else {
              item[adj.id] = itemLevelAmount.itemLevelAdjustmentAmount
              item.tempSubTotal += itemLevelAmount.itemLevelAdjustmentAmount
            }

            item.itemLevelGST = itemLevelAmount.itemLevelGSTAmount

            // Sum up all itemLevelGST & invoiceTotal at last iteration
            if (Object.is(adjArr.length - 1, adjKey)) {
              // Calculate item level totalAfterAdjustments & totalAfterGst
              if (gstIncluded) {
                item.totalAfterGst = item.tempSubTotal
                invoiceTotal += item.tempSubTotal
              } else {
                item.totalAfterGst = item.tempSubTotal + item.itemLevelGST
                invoiceTotal += item.itemLevelGST + item.tempSubTotal
              }

              item.totalAfterAdjustments = item.tempSubTotal
              invoiceGST += item.itemLevelGST
            }
          })
        }
      })
    } else {
      filteredPurchaseOrderItem.map((item) => {
        if (isEnableGST) {
          if (!gstEnabled) {
            item.itemLevelGST = 0
          } else if (gstIncluded) {
            item.itemLevelGST = item.tempSubTotal * (gSTPercentage / 107)
          } else {
            item.itemLevelGST = item.tempSubTotal * (gSTPercentage / 100)
          }
        } else {
          item.itemLevelGST = 0
        }

        // Calculate item level totalAfterAdjustments & totalAfterGst
        item.totalAfterAdjustments = item.tempSubTotal
        item.totalAfterGst = item.tempSubTotal + item.itemLevelGST

        // Sum up all and display at summary
        invoiceGST += item.itemLevelGST
        invoiceTotal += item.itemLevelGST + item.tempSubTotal
      })
    }

    setTimeout(() => {
      setFieldValue('purchaseOrder.invoiceGST', invoiceGST)
    }, 1)

    setTimeout(() => {
      setFieldValue('purchaseOrder.invoiceTotal', invoiceTotal)
    }, 1)
  }

  onClickPrint = () => {
    const { purchaseOrderDetails } = this.props
    const { id, type } = purchaseOrderDetails
    this.props.dispatch({
      type: 'purchaseOrderDetails/fakeQueryDone',
      payload: {
        id,
        type,
      },
    })
  }

  isPOFinalized = () => {
    const { purchaseOrderStatus } = this.state
    return isPOStatusFinalized(purchaseOrderStatus)
  }

  render () {
    const {
      classes,
      isEditable,
      values,
      setFieldValue,
      dispatch,
      purchaseOrderDetails,
    } = this.props
    const { clinicSetting } = purchaseOrderDetails
    const { purchaseOrderAdjustment, purchaseOrder, rows } = values
    return (
      <div>
        <POForm
          setFieldValue={setFieldValue}
          isPOFinalized={this.isPOFinalized()}
        />
        <Grid
          rows={rows}
          dispatch={dispatch}
          setFieldValue={setFieldValue}
          calculateInvoice={this.calculateInvoice}
          isEditable={!this.isPOFinalized()}
        />
        <POSummary
          dispatch={dispatch}
          calculateInvoice={this.calculateInvoice}
          purchaseOrder={purchaseOrder}
          purchaseOrderAdjustment={purchaseOrderAdjustment}
          setFieldValue={setFieldValue}
          toggleInvoiceAdjustment={this.showInvoiceAdjustment}
          clinicSetting={clinicSetting}
        />

        <GridContainer direction='row' style={{ marginTop: 20 }}>
          <GridItem xs={4} md={8} />
          <GridItem xs={8} md={4}>
            {!this.isPOFinalized() ? (
              <Button color='danger'>
                {formatMessage({
                  id: 'inventory.pr.detail.pod.cancelpo',
                })}
              </Button>
            ) : (
              ''
            )}
            <Button color='primary'>
              {formatMessage({
                id: 'inventory.pr.detail.pod.save',
              })}
            </Button>
            <Button color='success'>
              {formatMessage({
                id: 'inventory.pr.detail.pod.finalize',
              })}
            </Button>
            <Button color='info' onClick={this.onClickPrint}>
              {formatMessage({
                id: 'inventory.pr.detail.print',
              })}
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default index
