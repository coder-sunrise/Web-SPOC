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
} from '@/components'
import { ReportViewer } from '@/components/_medisys'
import POForm from './POForm'
import POGrid from './POGrid'
// import POSummary from './POSummary'
import POSummary from './Share/index'
import { calculateItemLevelAdjustment } from '@/utils/utils'
import {
  isPOStatusDraft,
  isPOStatusFinalized,
  poSubmitAction,
  getPurchaseOrderStatusFK,
  isPOStatusFulfilled,
  isInvoiceReadOnly,
} from '../../variables'
import { podoOrderType } from '@/utils/codes'
import { INVOICE_STATUS } from '@/utils/constants'
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
  mapPropsToValues: ({ purchaseOrderDetails, clinicSettings }) => {
    const newPurchaseOrderDetails = purchaseOrderDetails
    const { settings } = clinicSettings
    if (newPurchaseOrderDetails) {
      if (
        newPurchaseOrderDetails.type &&
        newPurchaseOrderDetails.type === 'dup' &&
        newPurchaseOrderDetails.purchaseOrder
      ) {
        newPurchaseOrderDetails.purchaseOrder.purchaseOrderNo = null
        newPurchaseOrderDetails.purchaseOrder.invoiceDate = null
        newPurchaseOrderDetails.purchaseOrder.remark = null
        newPurchaseOrderDetails.purchaseOrder.invoiceNo = null
        newPurchaseOrderDetails.purchaseOrder.exceptedDeliveryDate = null
      } else if (newPurchaseOrderDetails.type === 'new') {
        newPurchaseOrderDetails.purchaseOrder.exceptedDeliveryDate = undefined
        newPurchaseOrderDetails.purchaseOrder.invoiceDate = undefined
        newPurchaseOrderDetails.purchaseOrder.gstValue =
          settings.gSTPercentageInt
        newPurchaseOrderDetails.purchaseOrder.isGSTEnabled =
          settings.isEnableGST
      }

      if (newPurchaseOrderDetails.purchaseOrder) {
        const {
          isGSTEnabled,
          isGstInclusive,
        } = newPurchaseOrderDetails.purchaseOrder
        newPurchaseOrderDetails.purchaseOrder.IsGSTEnabled = isGSTEnabled
        newPurchaseOrderDetails.purchaseOrder.IsGSTInclusive = isGstInclusive
      }
    }
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
  handleSubmit: (values, { props }) => {},
})
class Index extends Component {
  state = {
    settingGSTEnable: false,
    settingGSTPercentage: 0,
    showReport: false,
    inclusiveGSTChecked: false,
  }

  static getDerivedStateFromProps (props, state) {
    const { clinicSettings } = props
    const { settings } = clinicSettings

    if (settings) {
      if (
        settings.isEnableGST !== state.settingGSTEnable &&
        settings.gSTPercentageInt !== state.settingGSTPercentage
      )
        return {
          ...state,
          settingGSTEnable: settings.isEnableGST,
          settingGSTPercentage: settings.gSTPercentageInt,
        }
    }
    return null
  }

  componentDidMount () {
    this.getPOdata()
  }

  getPOdata = (createdId) => {
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
    let dispatchType = 'purchaseOrderDetails/upsert'
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
            const { id } = r
            // dispatch({
            //   type: `formik/clean`,
            //   payload: 'purchaseOrderDetails',
            // })
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
            onConfirmDiscard: async () => {
              processedPayload = this.processSubmitPayload(false, statusCode)
              await submit()
              if (statusCode === 4) {
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
            4,
            'Are you sure want to cancel PO?',
            'Cancel PO',
          )
          break
        case poSubmitAction.FINALIZE:
          // dispatchType = 'purchaseOrderDetails/upsertWithStatusCode'
          processedPayload = this.processSubmitPayload(false, 2)
          break
        case poSubmitAction.COMPLETE:
          dispatchType = 'purchaseOrderDetails/upsertWithStatusCode'
          openConfirmationModal(
            6,
            'Are you sure want to complete PO?',
            'Complete PO',
          )
          break
        // case poSubmitAction.PRINT:
        //   this.toggleReport()
        //   break
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
      newPurchaseOrderStatusFK = 1
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
          unitOfMeasurement: x.uomString,
          [itemType.prop]: {
            // [itemType.itemFKName]: x[itemType.itemFKName],
            [itemType.itemFKName]: x.code,
            [itemType.itemCode]: x.codeString,
            [itemType.itemName]: x.nameString,
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
          unitOfMeasurement: x.uomString,
          [itemType.prop]: {
            [itemType.itemFKName]: x[itemType.itemFKName],
            [itemType.itemCode]: x.codeString,
            [itemType.itemName]: x.nameString,
          },
        }
      })
    } else {
      if (!isSaveAction) {
        newPurchaseOrderStatusFK = purchaseOrderStatusFK
      } else if (purchaseOrderStatusFK === 6) {
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
            unitOfMeasurement: x.uomString,
            [itemType.prop]: {
              [itemType.itemFKName]: x[itemType.itemFKName],
              [itemType.itemCode]: x.codeString,
              [itemType.itemName]: x.nameString,
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
    const { settingGSTEnable } = this.state
    const { values, setFieldValue } = this.props
    const { rows, purchaseOrderAdjustment, purchaseOrder } = values
    const { IsGSTEnabled, IsGSTInclusive, gstValue } = purchaseOrder || false
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
              settingGSTEnable,
              gstValue,
              IsGSTEnabled,
              IsGSTInclusive,
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
            item.itemLevelGST = item.tempSubTotal * (gstValue / 107)
          } else {
            item.itemLevelGST = item.tempSubTotal * (gstValue / 100)
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

  setInclusiveGSTChecked = () => {
    this.setState({ inclusiveGSTChecked: true })
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
    const { IsGSTEnabled, IsGSTInclusive, gstValue } = purchaseOrder || false
    const isWriteOff = po
      ? po.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false
    const isEditable = (poItem) => {
      if ((poItem && poStatus !== 1) || poStatus > 1) return false
      if (isWriteOff) return false
      return true
    }
    const currentGstValue = IsGSTEnabled ? gstValue : undefined
    return (
      // <AuthorizedContext.Provider
      //   value={{
      //     rights: poStatus !== 6 ? 'enable' : 'disable',
      //     // rights: 'disable',
      //   }}
      // >
      <React.Fragment>
        <AuthorizedContext.Provider
          value={{
            rights: isEditable() ? 'enable' : 'disable',
            // rights: 'disable',
          }}
        >
          <POForm
            isReadOnly={isInvoiceReadOnly(poStatus)}
            setFieldValue={setFieldValue}
            {...this.props}
          />

          {errors.rows && (
            <p className={classes.errorMsgStyle}>{errors.rows}</p>
          )}
          <POGrid
            calcPurchaseOrderSummary={this.calcPurchaseOrderSummary}
            isEditable={isEditable('poItem')}
            {...this.props}
          />
        </AuthorizedContext.Provider>
        <AuthorizedContext.Provider
          value={{
            rights: isEditable() ? 'enable' : 'disable',
            // rights: 'disable',
          }}
        >
          {/* <POSummary
            toggleInvoiceAdjustment={this.showInvoiceAdjustment}
            handleCalcInvoiceSummary={this.calcPurchaseOrderSummary}
            handleDeleteInvoiceAdjustment={this.handleDeleteInvoiceAdjustment}
            prefix='purchaseOrder.'
            adjustmentListName='purchaseOrderAdjustment'
            adjustmentList={purchaseOrderAdjustment}
            IsGSTEnabled={IsGSTEnabled}
            IsGSTInclusive={IsGSTInclusive}
            setFieldValue={setFieldValue}
            // {...this.props}
          /> */}
          <GridContainer>
            <GridItem xs={2} md={9} />
            <GridItem xs={10} md={3}>
              <AmountSummary
                rows={rows}
                adjustments={purchaseOrderAdjustment}
                config={{
                  isGSTInclusive: IsGSTInclusive,
                  totalField: 'totalPrice',
                  adjustedField: 'totalAfterAdjustments',
                  gstField: 'totalAfterGst',
                  gstAmtField: 'itemLevelGST',
                  gstValue: currentGstValue,
                }}
                onValueChanged={(v) => {
                  setFieldValue('purchaseOrderAdjustment', v.adjustments)
                  // setFieldValue(
                  //  'purchaseOrder.IsGSTEnabled',
                  //  v.summary.isEnableGST,
                  // )
                  setFieldValue(
                    'purchaseOrder.IsGSTInclusive',
                    v.summary.isGSTInclusive,
                  )
                  setFieldValue(
                    'purchaseOrder.gstAmount',
                    Math.round(v.summary.gst * 100) / 100,
                  )
                  setFieldValue('purchaseOrder.totalAmount', v.summary.total)
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {isPOStatusDraft(poStatus) && type === 'edit' ? (
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

            <ProgressButton
              color='info'
              icon={null}
              onClick={this.toggleReport}
              authority='none'
            >
              {formatMessage({
                id: 'inventory.pr.detail.print',
              })}
            </ProgressButton>
          </GridContainer>
        </AuthorizedContext.Provider>

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
      // </AuthorizedContext.Provider>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Index)
