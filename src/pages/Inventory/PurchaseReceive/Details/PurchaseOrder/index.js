import React, { Component } from 'react'
// import { connect } from 'dva'
import Yup from '@/utils/yup'
import { formatMessage } from 'umi/locale'
import { withFormikExtend, GridContainer, GridItem, Button } from '@/components'
import POForm from './POForm'
import POGrid from './POGrid'
// import POSummary from './POSummary'
import POSummary from './Share/index'
import { calculateItemLevelAdjustment, sumReducer } from '@/utils/utils'
import {
  isPOStatusDraft,
  isPOStatusFinalized,
  poSubmitAction,
  getPurchaseOrderStatusFK,
} from '../../variables'
import { podoOrderType } from '@/utils/codes'

// @connect(({ clinicSettings }) => ({
//   clinicSettings,
// }))
@withFormikExtend({
  displayName: 'purchaseOrderDetails',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseOrderDetails }) => {
    return purchaseOrderDetails
  },
  // validationSchema: Yup.object().shape({
  //   ['purchaseOrder.supplierFK']: Yup.string().required(),
  // }),
})
class index extends Component {
  state = {
    settingGSTEnable: false,
    settingGSTPercentage: 0,
  }

  static getDerivedStateFromProps (props, state) {
    const { clinicSettings } = props
    const { settings } = clinicSettings

    if (settings) {
      if (
        settings.IsEnableGST !== state.settingGSTEnable &&
        settings.GSTPercentageInt !== state.settingGSTPercentage
      )
        return {
          ...state,
          settingGSTEnable: settings.IsEnableGST,
          settingGSTPercentage: settings.GSTPercentageInt,
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
          type: 'purchaseOrderDetails/duplicatePurchaseOrder',
          payload: { id, type },
        })
        break
      // Edit order
      case 'edit':
        this.props.dispatch({
          type: 'purchaseOrderDetails/queryPurchaseOrder',
          payload: { id, type },
        })
        break
      // Create new order
      default:
        this.props.dispatch({
          type: 'purchaseOrderDetails/initializePurchaseOrder',
        })
        break
    }
  }

  showInvoiceAdjustment = () => {
    const { values, dispatch } = this.props
    const { purchaseOrder } = values
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          showRemark: true,
          defaultValues: {
            initialAmout: purchaseOrder.totalAmount,
          },
          callbackConfig: {
            model: 'purchaseOrderDetails',
            reducer: 'addAdjustment',
          },
          callbackMethod: this.calcPurchaseOrderSummary,
        },
      },
    })
  }

  onSubmitButtonClicked = (action) => {
    const { dispatch, history } = this.props
    let dispatchType = 'purchaseOrderDetails/upsert'
    let processedPayload = {}

    switch (action) {
      case poSubmitAction.SAVE:
        processedPayload = this.processSubmitPayload(true)
        break
      case poSubmitAction.CANCEL:
        dispatchType = 'purchaseOrderDetails/upsertWithStatusCode'
        processedPayload = this.processSubmitPayload(false, 4)
        break
      case poSubmitAction.FINALIZE:
        dispatchType = 'purchaseOrderDetails/upsertWithStatusCode'
        processedPayload = this.processSubmitPayload(false, 2)
        break
      case poSubmitAction.COMPLETE:
        //
        break
      case poSubmitAction.PRINT:
        //
        break
      default:
      // case block
    }

    dispatch({
      type: dispatchType,
      payload: {
        ...processedPayload,
      },
    }).then((r) => {
      if (r) {
        history.push('/inventory/pr')
      }
    })
  }

  processSubmitPayload = (isSaveAction = false, purchaseOrderStatusFK) => {
    const { purchaseOrderDetails, values } = this.props
    const { type } = purchaseOrderDetails
    const {
      purchaseOrder,
      purchaseOrderAdjustment: poAdjustment,
      rows,
    } = values
    let purchaseOrderItem = []
    let newPoAdjustment
    let newPurchaseOrderStatusFK = purchaseOrderStatusFK
    if (type === 'new') {
      newPurchaseOrderStatusFK = 1
      purchaseOrderItem = rows.map((x) => {
        const itemType = podoOrderType.find((y) => y.value === x.type)
        return {
          inventoryItemTypeFK: itemType.value,
          orderQuantity: x.orderQuantity,
          bonusQuantity: x.bonusQuantity,
          totalQuantity: x.totalQuantity,
          totalPrice: x.totalPrice,
          totalAfterAdjustments: x.totalAfterAdjustments,
          totalAfterGst: x.totalAfterGst,
          sortOrder: x.sortOrder,
          IsACPUpdated: false,
          [itemType.prop]: {
            [itemType.itemFKName]: x[itemType.itemFKName],
            [itemType.itemCode]: '',
            [itemType.itemName]: '',
          },
        }
      })
    } else if (type === 'dup') {
      newPurchaseOrderStatusFK = 1
      delete purchaseOrder.id
      delete purchaseOrder.concurrencyToken
      newPoAdjustment = poAdjustment.map((adj) => {
        delete adj.id
        delete adj.concurrencyToken
        delete adj.purchaseOrderFK
        return adj
      })

      purchaseOrderItem = rows.map((x) => {
        const itemType = podoOrderType.find((y) => y.value === x.type)
        return {
          inventoryItemTypeFK: itemType.value,
          orderQuantity: x.orderQuantity,
          bonusQuantity: x.bonusQuantity,
          totalQuantity: x.totalQuantity,
          totalPrice: x.totalPrice,
          totalAfterAdjustments: x.totalAfterAdjustments,
          totalAfterGst: x.totalAfterGst,
          sortOrder: x.sortOrder,
          IsACPUpdated: false,
          [itemType.prop]: {
            [itemType.itemFKName]: x[itemType.itemFKName],
            [itemType.itemCode]: '',
            [itemType.itemName]: '',
          },
        }
      })
    } else {
      if (!isSaveAction) {
        newPurchaseOrderStatusFK = purchaseOrderStatusFK
      } else {
        newPurchaseOrderStatusFK = purchaseOrder.purchaseOrderStatusFK
      }

      purchaseOrderItem = rows.map((x) => {
        const itemType = podoOrderType.find((y) => y.value === x.type)
        let result = {}
        if (x.isNew) {
          result = {
            inventoryItemTypeFK: itemType.value,
            orderQuantity: x.orderQuantity,
            bonusQuantity: x.bonusQuantity,
            totalQuantity: x.totalQuantity,
            totalPrice: x.totalPrice,
            totalAfterAdjustments: x.totalAfterAdjustments,
            totalAfterGst: x.totalAfterGst,
            sortOrder: x.sortOrder,
            IsACPUpdated: false,
            [itemType.prop]: {
              [itemType.itemFKName]: x[itemType.itemFKName],
              [itemType.itemCode]: '',
              [itemType.itemName]: '',
            },
          }
        } else {
          result = {
            ...x,
          }
        }
        return result
      })
    }

    return {
      ...purchaseOrder,
      supplierFK: 11,
      purchaseOrderStatusFK: newPurchaseOrderStatusFK,
      purchaseOrderStatusCode: getPurchaseOrderStatusFK(
        newPurchaseOrderStatusFK,
      ).code,
      invoiceStatusFK: 3, // Soe will double confirm whether this will be done at server side
      purchaseOrderItem,
      purchaseOrderAdjustment: newPoAdjustment || [
        ...poAdjustment.map((adj) => {
          if (adj.isNew) {
            delete adj.id
          }
          return adj
        }),
      ],
    }
  }

  calculateAmount = ({
    adjustmentList = [],
    rows = [],
    IsGSTEnabled = false,
    IsGSTInclusive = false,
    clinicSettings: { settingGSTEnable, settingGSTPercentage },
  }) => {
    let processedRows = rows

    const total = processedRows
      .map((o) => o.totalAfterItemAdjustment)
      .reduce(sumReducer, 0)
    processedRows.forEach((r) => {
      r.weightage = r.totalAfterItemAdjustment / total
      r.totalAfterOverallAdjustment = r.totalAfterItemAdjustment
    })
    adjustmentList.filter((o) => !o.isDeleted).forEach((fa) => {
      processedRows.forEach((r) => {
        r.totalAfterOverallAdjustment += r.weightage * fa.adjAmount
      })
    })

    const totalAfterAdj = processedRows
      .map((o) => o.totalAfterOverallAdjustment)
      .reduce(sumReducer, 0)
    const gst = totalAfterAdj * settingGSTPercentage / 100

    return {
      processedRows,
      summary: {
        gst,
        total: totalAfterAdj,
        totalWithGST: gst + totalAfterAdj,
      },
    }
  }

  calcPurchaseOrderSummary = () => {
    const { settingGSTEnable, settingGSTPercentage } = this.state
    const { values, setFieldValue } = this.props
    const { rows, purchaseOrderAdjustment, purchaseOrder } = values
    const { IsGSTEnabled, IsGSTInclusive } = purchaseOrder || false
    let tempInvoiceTotal = 0
    let totalAmount = 0
    let gstAmount = 0

    const filteredPurchaseOrderAdjustment = purchaseOrderAdjustment.filter(
      (x) => !x.isDeleted,
    )
    const filteredPurchaseOrderItem = rows.filter((x) => !x.isDeleted)

    // Calculate all unitPrice
    filteredPurchaseOrderItem.map((row) => {
      tempInvoiceTotal += row.totalPrice
      row.tempSubTotal = row.totalPrice
      return null
    })

    // Check is there any adjustment was added
    if (
      filteredPurchaseOrderAdjustment &&
      filteredPurchaseOrderAdjustment.length > 0
    ) {
      // Calculate adjustment for added items
      filteredPurchaseOrderAdjustment.map((adj, adjKey, adjArr) => {
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
              settingGSTEnable,
              settingGSTPercentage,
              IsGSTEnabled,
              IsGSTInclusive,
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
              if (IsGSTInclusive) {
                item.totalAfterGst = item.tempSubTotal
                totalAmount += item.tempSubTotal
              } else {
                item.totalAfterGst = item.tempSubTotal + item.itemLevelGST
                totalAmount += item.itemLevelGST + item.tempSubTotal
              }

              item.totalAfterAdjustments = item.tempSubTotal
              gstAmount += item.itemLevelGST
            }
            return null
          })
        }
        return null
      })
    } else {
      filteredPurchaseOrderItem.map((item) => {
        if (settingGSTEnable) {
          if (!IsGSTEnabled) {
            item.itemLevelGST = 0
          } else if (IsGSTInclusive) {
            item.itemLevelGST = item.tempSubTotal * (settingGSTPercentage / 107)
          } else {
            item.itemLevelGST = item.tempSubTotal * (settingGSTPercentage / 100)
          }
        } else {
          item.itemLevelGST = 0
        }

        // Calculate item level totalAfterAdjustments & totalAfterGst
        item.totalAfterAdjustments = item.tempSubTotal
        item.totalAfterGst = item.tempSubTotal + item.itemLevelGST

        // Sum up all and display at summary
        gstAmount += item.itemLevelGST
        totalAmount += item.itemLevelGST + item.tempSubTotal
        return null
      })
    }

    setTimeout(() => {
      setFieldValue('purchaseOrder.gstAmount', gstAmount)
    }, 1)

    setTimeout(() => {
      setFieldValue('purchaseOrder.totalAmount', totalAmount)
    }, 1)

    // {
    //   adjustmentList = [],
    //   rows = [],
    //   IsGSTEnabled = false,
    //   IsGSTInclusive = false,
    //   clinicSettings: { settingGSTEnable, settingGSTPercentage
    // }

    const result = this.calculateAmount({
      rows,
      adjustmentList: purchaseOrderAdjustment,
      IsGSTEnabled,
      IsGSTInclusive,
      clinicSettings: { settingGSTEnable, settingGSTPercentage },
    })

    console.log('calculateAmount', result)
  }

  handleDeleteInvoiceAdjustment = (adjustmentList) => {
    const { setFieldValue } = this.props
    setFieldValue('purchaseOrderAdjustment', adjustmentList)
  }

  render () {
    const { purchaseOrderDetails, values, dispatch, setFieldValue } = this.props
    const { purchaseOrder: po } = purchaseOrderDetails
    const poStatus = po ? po.purchaseOrderStatusFK : 0
    const { purchaseOrder, purchaseOrderAdjustment } = values
    const { IsGSTEnabled } = purchaseOrder || false

    return (
      <div>
        <POForm
          isPOFinalized={!isPOStatusFinalized(poStatus)}
          {...this.props}
        />
        <POGrid
          calcPurchaseOrderSummary={this.calcPurchaseOrderSummary}
          isEditable={!isPOStatusFinalized(poStatus)}
          {...this.props}
        />
        <POSummary
          toggleInvoiceAdjustment={this.showInvoiceAdjustment}
          handleCalcInvoiceSummary={this.calcPurchaseOrderSummary}
          handleDeleteInvoiceAdjustment={this.handleDeleteInvoiceAdjustment}
          prefix='purchaseOrder.'
          adjustmentListName='purchaseOrderAdjustment'
          adjustmentList={purchaseOrderAdjustment}
          IsGSTEnabled={IsGSTEnabled}
          setFieldValue={setFieldValue}
          // {...this.props}
        />
        <GridContainer direction='row' style={{ marginTop: 20 }}>
          <GridItem xs={4} md={8} />
          <GridItem xs={8} md={4}>
            {isPOStatusDraft(poStatus) ? (
              <Button
                color='danger'
                onClick={() =>
                  this.onSubmitButtonClicked(poSubmitAction.CANCEL)}
              >
                {formatMessage({
                  id: 'inventory.pr.detail.pod.cancelpo',
                })}
              </Button>
            ) : (
              ''
            )}
            <Button
              color='primary'
              onClick={() => this.onSubmitButtonClicked(poSubmitAction.SAVE)}
            >
              {formatMessage({
                id: 'inventory.pr.detail.pod.save',
              })}
            </Button>
            <Button
              color='success'
              onClick={() =>
                this.onSubmitButtonClicked(poSubmitAction.FINALIZE)}
            >
              {formatMessage({
                id: 'inventory.pr.detail.pod.finalize',
              })}
            </Button>
            <Button
              color='info'
              onClick={() => this.onSubmitButtonClicked(poSubmitAction.PRINT)}
            >
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
