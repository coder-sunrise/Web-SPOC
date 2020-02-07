import React, { Component } from 'react'
// import { connect } from 'dva'
import router from 'umi/router'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  GridContainer,
  GridItem,
  ProgressButton,
  CommonModal,
  notification,
} from '@/components'
import { ReportViewer } from '@/components/_medisys'
import POForm from './POForm'
import POGrid from './POGrid'
import { calculateItemLevelAdjustment } from '@/utils/utils'
import {
  isPOStatusDraft,
  poSubmitAction,
  getPurchaseOrderStatusFK,
  isPOStatusFulfilled,
  isPOStatusFinalized,
  enableSaveButton,
} from '../../variables'
import { podoOrderType } from '@/utils/codes'
import { INVOICE_STATUS, PURCHASE_ORDER_STATUS } from '@/utils/constants'
import AuthorizedContext from '@/components/Context/Authorized'
import AmountSummary from '@/pages/Shared/AmountSummary'

const styles = (theme) => ({
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

@withFormikExtend({
  displayName: 'purchaseOrderDetails',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseOrderDetails }) => {
    return {
      ...purchaseOrderDetails,
    }
  },
  validationSchema: Yup.object().shape({
    purchaseOrder: Yup.object().shape({
      supplierFK: Yup.string().required(),
      purchaseOrderDate: Yup.date().required(),
    }),
    rows: Yup.array().required('At least one item is required.'),
  }),
  handleSubmit: () => {},
})
class Index extends Component {
  state = {
    showReport: false,
  }

  componentDidMount () {
    this.getPOdata()
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'purchaseOrderDetails/initializePurchaseOrder',
    })
  }

  getPOdata = (createdId) => {
    const { purchaseOrderDetails } = this.props
    const { id, type } = purchaseOrderDetails
    switch (type) {
      // Duplicate order
      case 'dup':
        if (createdId) {
          router.push(
            `/inventory/pr/pdodetails?id=${createdId}&&type=${'edit'}`,
          )
          this.props.dispatch({
            type: 'purchaseOrderDetails/queryPurchaseOrder',
            payload: { id: createdId, type: 'edit' },
          })
        } else {
          this.props.dispatch({
            type: 'purchaseOrderDetails/duplicatePurchaseOrder',
            payload: { id, type },
          })
        }
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
        if (createdId && type === 'new') {
          router.push(
            `/inventory/pr/pdodetails?id=${createdId}&&type=${'edit'}`,
          )
          this.props.dispatch({
            type: 'purchaseOrderDetails/queryPurchaseOrder',
            payload: { id: createdId, type: 'edit' },
          })
        } else {
          this.props.dispatch({
            type: 'purchaseOrderDetails/initializePurchaseOrder',
          })
        }

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

  onSubmitButtonClicked = async (action) => {
    const { dispatch, validateForm, history } = this.props
    let dispatchType = 'purchaseOrderDetails/savePO'
    let processedPayload = {}
    const isFormValid = await validateForm()
    let validation = false
    if (!_.isEmpty(isFormValid)) {
      validation = false
      this.props.handleSubmit()
    } else {
      const submit = () => {
        dispatch({
          type: dispatchType,
          payload: {
            ...processedPayload,
          },
        }).then((r) => {
          if (r) {
            if (
              action === poSubmitAction.SAVE ||
              action === poSubmitAction.FINALIZE
            ) {
              let message = 'PO saved'
              if (action === poSubmitAction.FINALIZE) {
                message = 'PO finalized'
              }
              notification.success({
                message,
              })
            }
            const { id } = r

            this.getPOdata(id)
          }
        })
        validation = true
        return validation
      }

      const openConfirmationModal = (statusCode, content, confirmText) => {
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            openConfirmContent: content,
            onConfirmSave: async () => {
              processedPayload = this.processSubmitPayload(false, statusCode)
              await submit()
              if (statusCode === PURCHASE_ORDER_STATUS.CANCELLED) {
                history.push('/inventory/pr')
              }
            },
            openConfirmText: confirmText,
          },
        })
      }

      switch (action) {
        case poSubmitAction.SAVE:
          processedPayload = this.processSubmitPayload(true)
          break
        case poSubmitAction.CANCEL:
          dispatchType = 'purchaseOrderDetails/upsertWithStatusCode'
          openConfirmationModal(
            PURCHASE_ORDER_STATUS.CANCELLED,
            'Are you sure want to cancel PO?',
            'Cancel PO',
          )
          return true
        case poSubmitAction.FINALIZE:
          processedPayload = this.processSubmitPayload(
            false,
            PURCHASE_ORDER_STATUS.FINALIZED,
          )
          break
        case poSubmitAction.COMPLETE:
          dispatchType = 'purchaseOrderDetails/upsertWithStatusCode'
          openConfirmationModal(
            PURCHASE_ORDER_STATUS.COMPLETED,
            'Are you sure want to complete PO?',
            'Complete PO',
          )
          return true

        default:
        // case block
      }

      submit()
    }
    return validation
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
      newPurchaseOrderStatusFK = PURCHASE_ORDER_STATUS.DRAFT
      purchaseOrderItem = rows.map((x) => {
        const itemType = podoOrderType.find((y) => y.value === x.type)
        return {
          isDeleted: x.isDeleted || false,
          inventoryItemTypeFK: itemType.value,
          orderQuantity: x.orderQuantity,
          bonusQuantity: x.bonusQuantity,
          totalQuantity: x.totalQuantity,
          totalPrice: x.totalPrice,
          totalAfterAdjustments: x.totalAfterAdjustments,
          totalAfterGst: x.totalAfterGst,
          unitPrice: x.unitPrice,
          sortOrder: x.sortOrder,
          IsACPUpdated: false,
          unitOfMeasurement: x.unitOfMeasurement,
          [itemType.prop]: {
            [itemType.itemFKName]: x.code,
            [itemType.itemCode]: x.codeString,
            [itemType.itemName]: x.nameString,
          },
          purchaseOrderItemAdjustment: poAdjustment.purchaseOrderItemAdjustment,
        }
      })
    } else if (type === 'dup') {
      newPurchaseOrderStatusFK = PURCHASE_ORDER_STATUS.DRAFT
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
          unitPrice: x.unitPrice,
          totalAfterAdjustments: x.totalAfterAdjustments,
          totalAfterGst: x.totalAfterGst,
          sortOrder: x.sortOrder,
          IsACPUpdated: false,
          unitOfMeasurement: x.unitOfMeasurement,
          [itemType.prop]: {
            [itemType.itemFKName]: x[itemType.itemFKName],
            [itemType.itemCode]: x.codeString,
            [itemType.itemName]: x.nameString,
          },
          purchaseOrderItemAdjustment: poAdjustment.purchaseOrderItemAdjustment,
        }
      })
    } else {
      if (!isSaveAction) {
        newPurchaseOrderStatusFK = purchaseOrderStatusFK
      } else if (purchaseOrderStatusFK === PURCHASE_ORDER_STATUS.COMPLETED) {
        newPurchaseOrderStatusFK = purchaseOrderStatusFK
      } else {
        newPurchaseOrderStatusFK = purchaseOrder.purchaseOrderStatusFK
      }

      purchaseOrderItem = rows.map((x) => {
        const itemType = podoOrderType.find((y) => y.value === x.type)
        let result = {}
        if (x.isNew) {
          result = {
            isDeleted: x.isDeleted || false,
            inventoryItemTypeFK: itemType.value,
            orderQuantity: x.orderQuantity,
            bonusQuantity: x.bonusQuantity,
            totalQuantity: x.totalQuantity,
            totalPrice: x.totalPrice,
            totalAfterAdjustments: x.totalAfterAdjustments,
            totalAfterGst: x.totalAfterGst,
            sortOrder: x.sortOrder,
            IsACPUpdated: false,
            unitOfMeasurement: x.unitOfMeasurement,
            [itemType.prop]: {
              [itemType.itemFKName]: x[itemType.itemFKName],
              [itemType.itemCode]: x.codeString,
              [itemType.itemName]: x.nameString,
            },
            purchaseOrderItemAdjustment:
              poAdjustment.purchaseOrderItemAdjustment,
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

  calcPurchaseOrderSummary = () => {
    const { values, setFieldValue } = this.props
    const { rows, purchaseOrderAdjustment, purchaseOrder } = values
    const { isGSTEnabled, isGstInclusive, gstValue } = purchaseOrder || false
    let tempInvoiceTotal = 0
    let totalAmount = 0
    let gstAmount = 0
    let totalAdjustmentAmount = 0

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
              gstValue,
              isGSTEnabled,
              isGstInclusive,
              filteredPurchaseOrderItem.length,
            )

            if (adj.adjType === 'Percentage') {
              item[adj.id] = itemLevelAmount.itemLevelAdjustmentAmount
              item.tempSubTotal += itemLevelAmount.itemLevelAdjustmentAmount
              adj.adjDisplayAmount += itemLevelAmount.itemLevelAdjustmentAmount
            } else {
              item[adj.id] = itemLevelAmount.itemLevelAdjustmentAmount
              item.tempSubTotal += itemLevelAmount.itemLevelAdjustmentAmount
            }

            totalAdjustmentAmount += itemLevelAmount.itemLevelAdjustmentAmount
            item.itemLevelGST = itemLevelAmount.itemLevelGSTAmount

            // Sum up all itemLevelGST & invoiceTotal at last iteration
            if (Object.is(adjArr.length - 1, adjKey)) {
              // Calculate item level totalAfterAdjustments & totalAfterGst
              if (isGstInclusive) {
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
        if (!isGSTEnabled) {
          item.itemLevelGST = 0
        } else if (isGstInclusive) {
          item.itemLevelGST = item.tempSubTotal * (gstValue / 107)
        } else {
          item.itemLevelGST = item.tempSubTotal * (gstValue / 100)
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
      setFieldValue('purchaseOrder.totalAmount', totalAmount)
      setFieldValue('purchaseOrder.AdjustmentAmount', totalAdjustmentAmount)
    }, 1)
  }

  handleDeleteInvoiceAdjustment = (adjustmentList) => {
    const { setFieldValue } = this.props
    setFieldValue('purchaseOrderAdjustment', adjustmentList)
  }

  toggleReport = () => {
    this.setState((preState) => ({
      showReport: !preState.showReport,
    }))
  }

  isEditable = (poStatus, isWriteOff, poItem) => {
    if (
      (poItem && poStatus !== PURCHASE_ORDER_STATUS.DRAFT) ||
      poStatus > PURCHASE_ORDER_STATUS.DRAFT ||
      isWriteOff
    )
      return false
    return true
  }

  render () {
    const {
      purchaseOrderDetails,
      values,
      setFieldValue,
      errors,
      classes,
    } = this.props
    const { purchaseOrder: po, type } = purchaseOrderDetails
    const poStatus = po ? po.purchaseOrderStatusFK : 0
    const { purchaseOrder, purchaseOrderAdjustment, rows } = values
    const {
      isGSTEnabled,
      isGstInclusive,
      gstValue,
      deliveryOrder = [],
      purchaseOrderPayment = [],
    } =
      purchaseOrder || false
    const isWriteOff = po
      ? po.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false

    const currentGstValue = isGSTEnabled ? gstValue : undefined
    return (
      <React.Fragment>
        <POForm
          isReadOnly={!this.isEditable(poStatus, isWriteOff)}
          isFinalize={isPOStatusFinalized(poStatus)}
          setFieldValue={setFieldValue}
          {...this.props}
        />
        <AuthorizedContext.Provider
          value={{
            rights: this.isEditable(poStatus, isWriteOff)
              ? 'enable'
              : 'disable',
          }}
        >
          {errors.rows && (
            <p className={classes.errorMsgStyle}>{errors.rows}</p>
          )}
          <POGrid
            calcPurchaseOrderSummary={this.calcPurchaseOrderSummary}
            isEditable={this.isEditable(poStatus, isWriteOff, 'poItem')}
            {...this.props}
          />
        </AuthorizedContext.Provider>
        <AuthorizedContext.Provider
          value={{
            rights: this.isEditable(poStatus, isWriteOff)
              ? 'enable'
              : 'disable',
          }}
        >
          <GridContainer>
            <GridItem xs={2} md={9} />
            <GridItem xs={10} md={3}>
              <AmountSummary
                rows={rows}
                adjustments={purchaseOrderAdjustment}
                config={{
                  isGSTInclusive: isGstInclusive,
                  itemFkField: 'purchaseOrderItemFK',
                  itemAdjustmentFkField: 'purchaseOrderAdjustmentFK',
                  invoiceItemAdjustmentField: 'purchaseOrderItemAdjustment',
                  totalField: 'totalPrice',
                  adjustedField: 'totalAfterAdjustments',
                  gstField: 'totalAfterGst',
                  gstAmtField: 'itemLevelGST',
                  gstValue: currentGstValue,
                }}
                onValueChanged={(v) => {
                  setFieldValue('purchaseOrder.totalAmount', v.summary.total)
                  setFieldValue(
                    'purchaseOrder.totalAfterAdj',
                    v.summary.totalAfterAdj,
                  )
                  setFieldValue(
                    'purchaseOrder.totalAftGst',
                    v.summary.totalWithGST,
                  )
                  setFieldValue(
                    'purchaseOrder.gstAmount',
                    Math.round(v.summary.gst * 100) / 100,
                  )

                  setFieldValue(
                    'purchaseOrderAdjustment',
                    v.adjustments.map((a) => {
                      return {
                        sequence: a.index + 1,
                        ...a,
                      }
                    }),
                  )
                  setFieldValue(
                    'purchaseOrder.isGstInclusive',
                    v.summary.isGSTInclusive,
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </AuthorizedContext.Provider>

        <GridContainer
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {poStatus !== PURCHASE_ORDER_STATUS.COMPLETED && (
            <div>
              {poStatus !== PURCHASE_ORDER_STATUS.CANCELLED &&
              deliveryOrder.length === 0 &&
              purchaseOrderPayment.length === 0 &&
              type === 'edit' ? (
                <ProgressButton
                  color='danger'
                  icon={null}
                  onClick={() =>
                    this.onSubmitButtonClicked(poSubmitAction.CANCEL)}
                >
                  {formatMessage({
                    id: 'inventory.pr.detail.pod.cancelpo',
                  })}
                </ProgressButton>
              ) : (
                ''
              )}

              <ProgressButton
                color='primary'
                icon={null}
                disabled={!enableSaveButton(poStatus)}
                onClick={() => this.onSubmitButtonClicked(poSubmitAction.SAVE)}
              >
                {formatMessage({
                  id: 'inventory.pr.detail.pod.save',
                })}
              </ProgressButton>
              {!isPOStatusDraft(poStatus) ? (
                <ProgressButton
                  color='success'
                  icon={null}
                  onClick={() =>
                    this.onSubmitButtonClicked(poSubmitAction.COMPLETE)}
                  disabled={!isPOStatusFulfilled(poStatus)}
                >
                  {formatMessage({
                    id: 'inventory.pr.detail.pod.complete',
                  })}
                </ProgressButton>
              ) : (
                ''
              )}
              {isPOStatusDraft(poStatus) && type !== 'new' && type !== 'dup' ? (
                <ProgressButton
                  color='success'
                  icon={null}
                  onClick={() =>
                    this.onSubmitButtonClicked(poSubmitAction.FINALIZE)}
                >
                  {formatMessage({
                    id: 'inventory.pr.detail.pod.finalize',
                  })}
                </ProgressButton>
              ) : (
                ''
              )}
            </div>
          )}

          <ProgressButton
            color='info'
            icon={null}
            onClick={this.toggleReport}
            authority='none'
            disabled={!values.id || type === 'dup'}
          >
            {formatMessage({
              id: 'inventory.pr.detail.print',
            })}
          </ProgressButton>
        </GridContainer>

        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Purchase Order'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={26}
            reportParameters={{
              PurchaseOrderId: values ? values.id : '',
            }}
          />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Index)
