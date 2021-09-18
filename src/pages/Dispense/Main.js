import React, { Component } from 'react'
// common component
import { connect } from 'dva'
import { formatMessage } from 'umi'
import {
  withFormikExtend,
  notification,
  CommonModal,
  Button,
} from '@/components'
import { calculateAmount, navigateDirtyCheck, getUniqueId } from '@/utils/utils'
import Yup from '@/utils/yup'
import { VISIT_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import { openCautionAlertOnStartConsultation } from '@/pages/Widgets/Orders/utils'
import ViewPatientHistory from '@/pages/Consultation/ViewPatientHistory'
import AddOrder from './DispenseDetails/AddOrder'
import DispenseDetails from './DispenseDetails/WebSocketWrapper'

const calculateInvoiceAmounts = entity => {
  const obj = { ...entity }
  const output = calculateAmount(
    obj.invoice.invoiceItem,
    obj.invoice.invoiceAdjustment,
    {
      isGSTInclusive: obj.invoice.isGSTInclusive,
      totalField: 'totalAfterItemAdjustment',
      adjustedField: 'totalAfterOverallAdjustment',
      gstField: 'totalAfterGST',
      gstAmtField: 'gstAmount',
      gstValue: obj.invoice.gstValue,
    },
  )
  let invoiceSummary = {}
  if (output && output.summary) {
    const { summary } = output

    invoiceSummary = {
      invoiceTotal: summary.total,
      invoiceTotalAftAdj: summary.totalAfterAdj,
      invoiceTotalAftGST: summary.totalWithGST,
      outstandingBalance: summary.totalWithGST - obj.invoice.totalPayment,
      invoiceGSTAdjustment: summary.gstAdj,
      invoiceGSTAmt: Math.round(summary.gst * 100) / 100,
    }
  }

  return {
    ...obj,
    invoice: {
      ...obj.invoice,
      ...invoiceSummary,
    },
  }
}

const reloadDispense = (props, effect = 'query') => {
  const { dispatch, dispense, resetForm } = props

  dispatch({
    type: `dispense/${effect}`,
    payload: dispense.visitID,
  }).then(response => {
    if (response) {
      const result = calculateInvoiceAmounts(response)
      resetForm(result)
    }
  })
}

const ConvertBatchNoArrayToText = array => {
  if (array) {
    return array.map(o => {
      const item = { ...o }
      if (item.batchNo instanceof Array) {
        if (item.batchNo && item.batchNo.length > 0) {
          const [firstIndex] = item.batchNo
          item.batchNo = firstIndex
        }
      }
      return item
    })
  }

  return array
}

const constructPayload = values => {
  const _values = {
    ...values,
    prescription: ConvertBatchNoArrayToText(values.prescription),
    vaccination: ConvertBatchNoArrayToText(values.vaccination),
  }
  return _values
}

@withFormikExtend({
  authority: 'queue.dispense',
  enableReinitialize: true,
  notDirtyDuration: 3,
  mapPropsToValues: pops => {
    const { dispense = {}, codetable } = pops
    let obj = dispense.entity || dispense.default
    const {
      inventorymedication = [],
      inventoryconsumable = [],
      inventoryvaccination = [],
    } = codetable

    let orderItems = []
    const defaultItem = (item, groupName) => {
      return {
        ...item,
        dispenseGroupId: groupName,
        countNumber: 1,
        rowspan: 1, uid: getUniqueId(),
      }
    }

    const generateFromDrugmixture = item => {
      const drugMixtures = _.orderBy(
        item.prescriptionDrugMixture,
        ['sequence'],
        ['asc'],
      )
      drugMixtures.forEach(drugMixture => {
        const detaultDrugMixture = {
          ...defaultItem(item, `DrugMixture-${item.id}`),
          drugMixtureFK: drugMixture.id,
          inventoryMedicationFK: drugMixture.inventoryMedicationFK,
          code: drugMixture.drugCode,
          name: drugMixture.drugName,
          quantity: drugMixture.quantity,
          dispenseUOM: drugMixture.uomDisplayValue,
          isDispensedByPharmacy: drugMixture.isDispensedByPharmacy,
          drugMixtureName: item.name,
        }
        if (drugMixture.isDispensedByPharmacy) {
          orderItems.push({
            ...detaultDrugMixture,
          })
        } else {
          const inventoryItem = inventorymedication.find(
            drug => drug.id === drugMixture.inventoryMedicationFK,
          )
          const uomName = inventoryItem?.dispensingUOM?.name
          const inventoryItemStock = _.orderBy(
            (inventoryItem?.medicationStock || []).filter(
              s => s.isDefault || s.stock > 0,
            ),
            ['isDefault', 'expiryDate'],
            ['asc'],
          )
          let remainQty = drugMixture.quantity
          if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
            inventoryItemStock.forEach((itemStock, index) => {
              const {
                id,
                batchNo,
                expiryDate,
                stock,
                isDefault,
              } = itemStock
              if (remainQty > 0) {
                let dispenseQuantity = 0
                if (isDefault || remainQty <= stock) {
                  dispenseQuantity = remainQty
                  remainQty = -1
                } else {
                  dispenseQuantity = stock
                  remainQty = remainQty - stock
                }
                orderItems.push({
                  ...detaultDrugMixture,
                  dispenseQuantity: dispenseQuantity,
                  batchNo,
                  expiryDate,
                  stock,
                  stockFK: id,
                  uomDisplayValue: uomName,
                  isDefault,
                  countNumber: index === 0 ? 1 : 0,
                  rowspan: 0,
                })
              }
            })
            const firstItem = orderItems.find(
              i =>
                i.drugMixtureFK === drugMixture.id && i.countNumber === 1,
            )
            firstItem.rowspan = orderItems.filter(
              i => i.drugMixtureFK === drugMixture.id,
            ).length
          } else {
            orderItems.push({
              ...detaultDrugMixture,
            })
          }
        }
      })
    }

    const generateFromNormalMedication = item => {
      const groupName = 'NormalDispense'

      if (item.isDispensedByPharmacy) {
        orderItems.push(defaultItem(item, groupName))
      }
      else {
        const inventoryItem = inventorymedication.find(
          drug => drug.id === item.inventoryMedicationFK,
        )
        const uomName = inventoryItem?.dispensingUOM?.name
        const inventoryItemStock = _.orderBy(
          (inventoryItem?.medicationStock || []).filter(
            s => s.isDefault || s.stock > 0,
          ),
          ['isDefault', 'expiryDate'],
          ['asc'],
        )
        let remainQty = item.quantity
        if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
          inventoryItemStock.forEach((itemStock, index) => {
            const { id, batchNo, expiryDate, stock, isDefault } = itemStock
            if (remainQty > 0) {
              let dispenseQuantity = 0
              if (isDefault || remainQty <= stock) {
                dispenseQuantity = remainQty
                remainQty = -1
              } else {
                dispenseQuantity = stock
                remainQty = remainQty - stock
              }
              orderItems.push({
                ...defaultItem(item, groupName),
                dispenseQuantity: dispenseQuantity,
                batchNo,
                expiryDate,
                stock,
                stockFK: id,
                uomDisplayValue: uomName,
                isDefault,
                countNumber: index === 0 ? 1 : 0,
                rowspan: 0,
              })
            }
          })
          const firstItem = orderItems.find(
            i =>
              i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
              i.isDrugMixture === item.isDrugMixture &&
              i.id === item.id &&
              i.countNumber === 1,
          )
          firstItem.rowspan = orderItems.filter(
            i =>
              i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
              i.isDrugMixture === item.isDrugMixture &&
              i.id === item.id,
          ).length
        } else {
          orderItems.push(defaultItem(item, groupName))
        }
      }
    }

    const generateFromNormalConsumable = item => {
      const groupName = 'NormalDispense'
      if (item.isDispensedByPharmacy) {
        orderItems.push(defaultItem(item, groupName))
      }
      else {
        const inventoryItem = inventoryconsumable.find(
          consumable => consumable.id === item.inventoryConsumableFK,
        )
        const inventoryItemStock = _.orderBy(
          (inventoryItem?.consumableStock || []).filter(
            s => s.isDefault || s.stock > 0,
          ),
          ['isDefault', 'expiryDate'],
          ['asc'],
        )
        let remainQty = item.quantity
        if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
          inventoryItemStock.forEach((itemStock, index) => {
            const { id, batchNo, expiryDate, stock, isDefault } = itemStock
            if (remainQty > 0) {
              let dispenseQuantity = 0
              if (isDefault || remainQty <= stock) {
                dispenseQuantity = remainQty
                remainQty = -1
              } else {
                dispenseQuantity = stock
                remainQty = remainQty - stock
              }
              orderItems.push({
                ...defaultItem(item, groupName),
                dispenseQuantity: dispenseQuantity,
                batchNo,
                expiryDate,
                stock,
                stockFK: id,
                uomDisplayValue: inventoryItem?.uom?.name,
                isDefault,
                countNumber: index === 0 ? 1 : 0,
                rowspan: 0,
              })
            }
            const firstItem = orderItems.find(
              i =>
                i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                i.isDrugMixture === item.isDrugMixture &&
                i.id === item.id &&
                i.countNumber === 1,
            )
            firstItem.rowspan = orderItems.filter(
              i =>
                i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                i.isDrugMixture === item.isDrugMixture &&
                i.id === item.id,
            ).length
          })
        } else {
          orderItems.push(defaultItem(item, groupName))
        }
      }
    }

    const generateFromNormalVaccination = item => {
      const groupName = 'NormalDispense'
      const inventoryItem = inventoryvaccination.find(
        vaccination => vaccination.id === item.inventoryVaccinationFK,
      )
      const inventoryItemStock = _.orderBy(
        (inventoryItem?.consumableStock || []).filter(
          s => s.isDefault || s.stock >= item.quantity,
        ),
        ['isDefault', 'expiryDate'],
        ['asc'],
      )
      let remainQty = item.quantity
      if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {

        const { id, batchNo, expiryDate, stock, isDefault } = inventoryItemStock[0]
        orderItems.push({
          ...defaultItem(item, groupName),
          dispenseQuantity: item.quantity,
          batchNo,
          expiryDate,
          stock,
          stockFK: id,
          uomDisplayValue: inventoryItem?.uom?.name,
          isDefault,
          countNumber: index === 0 ? 1 : 0,
          rowspan: 0,
        })
      } else {
        orderItems.push(defaultItem(item, groupName))
      }
    }

    const sortOrderItems = [
      ...(obj.prescription || []).filter(
        item => item.type === 'Medication' && !item.isDrugMixture
      ),
      ...(obj.vaccination || []),
      ...(obj.consumable || []),
      ...(obj.prescription || []).filter(
        item => item.type === 'Medication' && item.isDrugMixture,
      ),
      ...(obj.prescription || []).filter(
        item => item.type === 'Open Prescription',
      ),
      ...(obj.externalPrescription || [])
    ]

    sortOrderItems.forEach(item => {
      if (item.type === 'Medication') {
        if (item.isDrugMixture) {
          generateFromDrugmixture(item)
        } else {
          generateFromNormalMedication(item)
        }
      }
      else if (item.type === 'Open Prescription' || item.type === 'Medication (Ext.)') {
        orderItems.push(defaultItem(item, 'NoNeedToDispense'))
      }
      else if (item.type === 'Vaccination') {
        generateFromNormalVaccination(item)
      }
      else {
        generateFromNormalConsumable(item)
      }
    })
    const defaultExpandedGroups = _.uniqBy(orderItems, 'dispenseGroupId').map(
      o => o.dispenseGroupId,
    )

    obj = { ...obj, dispenseItems: orderItems, defaultExpandedGroups }
    const result = calculateInvoiceAmounts(obj)
    return result
  },
  validationSchema: Yup.object().shape({
    prescription: Yup.array().of(
      Yup.object().shape({
        batchNo: Yup.string(),
        expiryDate: Yup.date(),
      }),
    ),
  }),
  handleSubmit: (values, { props, ...restProps }) => {
    const { dispatch, dispense } = props
    const vid = dispense.visitID
    const _values = constructPayload(values)

    dispatch({
      type: `dispense/save`,
      payload: {
        id: vid,
        values: _values,
      },
    }).then(o => {
      if (o) {
        notification.success({
          message: 'Dispense saved',
        })
        reloadDispense({
          ...props,
          ...restProps,
        })
      }
    })
  },
  displayName: 'DispensePage',
})

@connect(({ orders, formik, dispense }) => ({
  orders,
  formik,
  dispense,
}))
class Main extends Component {
  state = {
    showOrderModal: false,
    showDrugLabelSelection: false,
    selectedDrugs: [],
    showCautionAlert: false,
    isShowOrderUpdated: false,
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { prescription = [], packageItem = [] } = nextProps.values

    let drugList = []
    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(() => {
      return {
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  componentDidMount = async () => {
    const { dispatch, values, dispense } = this.props
    const {
      otherOrder = [],
      prescription = [],
      packageItem = [],
      visitPurposeFK,
    } = values
    dispatch({
      type: 'dispense/incrementLoadCount',
    })
    const isEmptyDispense = otherOrder.length === 0 && prescription.length === 0
    const noClinicalObjectRecord = !values.clinicalObjectRecordFK

    const accessRights = Authorized.check('queue.dispense.editorder')

    if (visitPurposeFK === VISIT_TYPE.RETAIL && isEmptyDispense) {
      this.setState(
        prevState => {
          return {
            showOrderModal: !prevState.showOrderModal,
            isFirstAddOrder: true,
          }
        },
        () => {
          this.openFirstTabAddOrder()
        },
      )
      return
    }

    if (
      accessRights &&
      accessRights.rights !== 'hidden' &&
      visitPurposeFK === VISIT_TYPE.BILL_FIRST &&
      isEmptyDispense &&
      noClinicalObjectRecord &&
      dispense.loadCount === 0
    ) {
      this.setState({ showCautionAlert: true })
      this.editOrder()
    }

    let drugList = []
    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(() => {
      return {
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  makePayment = async (voidPayment = false, voidReason = '') => {
    const { dispatch, dispense, values } = this.props
    const _values = constructPayload(values)
    const finalizeResponse = await dispatch({
      type: 'dispense/finalize',
      payload: {
        id: dispense.visitID,
        values: {
          ..._values,
          voidPayment,
          voidReason,
        },
      },
    })
    if (finalizeResponse === 204) {
      return true
    }
    return false
  }

  _editOrder = () => {
    const { dispatch, dispense, values, history } = this.props
    const { location } = history
    const { query } = location
    const { visitPurposeFK } = values
    const addOrderList = [VISIT_TYPE.RETAIL]
    const shouldShowAddOrderModal = addOrderList.includes(visitPurposeFK)

    if (shouldShowAddOrderModal) {
      this.handleOrderModal()
    }
    if (visitPurposeFK !== VISIT_TYPE.RETAIL) {
      dispatch({
        type: `consultation/editOrder`,
        payload: {
          id: values.id,
          queueID: query.qid,
          version: dispense.version,
        },
      }).then(o => {
        if (o) {
          dispatch({
            type: `dispense/updateState`,
            payload: {
              editingOrder: !shouldShowAddOrderModal,
            },
          })
          reloadDispense(this.props)

          if (this.state.showCautionAlert) {
            this.setState({ showCautionAlert: false })
            openCautionAlertOnStartConsultation(o)
          }
        }
      })
    }
  }

  editOrder = e => {
    const { values } = this.props
    const { visitPurposeFK } = values

    if (visitPurposeFK === VISIT_TYPE.RETAIL) {
      this._editOrder()
    } else {
      navigateDirtyCheck({
        onProceed: this._editOrder,
      })(e)
    }
  }

  openFirstTabAddOrder = () => {
    const { dispatch, values } = this.props
    if (this.state.showOrderModal) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          type: '1',
          visitPurposeFK: values.visitPurposeFK,
        },
      })
    } else {
      dispatch({
        type: 'orders/updateState',
        payload: {
          visitPurposeFK: values.visitPurposeFK,
        },
      })
    }
  }

  handleOrderModal = () => {
    this.props.dispatch({
      type: 'orders/reset',
    })

    this.setState(
      prevState => {
        return {
          showOrderModal: !prevState.showOrderModal,
          isFirstAddOrder: false,
        }
      },
      () => {
        this.openFirstTabAddOrder()
      },
    )
  }

  handleReloadClick = () => {
    reloadDispense(this.props, 'refresh')
  }

  showConfirmationBox = () => {
    const { dispatch, history } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: formatMessage({
          id: 'app.general.leave-without-save',
        }),
        onConfirmSave: () => {
          history.push({
            pathname: history.location.pathname,
            query: {
              ...history.location.query,
              isInitialLoading: false,
            },
          })
          this.handleOrderModal()
        },
      },
    })
  }

  handleCloseAddOrder = () => {
    const {
      dispatch,
      consultation,
      values,
      orders: { rows },
      formik,
    } = this.props
    const { visitPurposeFK } = values
    const newOrderRows = rows.filter(row => !row.id && !row.isDeleted)
    if (formik.OrderPage && !formik.OrderPage.dirty && newOrderRows.length > 0)
      this.showConfirmationBox()
    else if (visitPurposeFK === VISIT_TYPE.BILL_FIRST) {
      dispatch({
        type: 'consultation/discard',
        payload: {
          id: consultation.entity.id,
        },
      }).then(response => {
        dispatch({
          type: 'dispense/query',
          payload: {
            id: values.id,
            version: Date.now(),
          },
        })
        if (response) this.handleOrderModal()
      })
    } else {
      this.handleOrderModal()
    }
  }

  handleDrugLabelClick = () => {
    const { values } = this.props
    const { prescription = [], packageItem = [] } = values
    let drugList = []

    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(prevState => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  handleDrugLabelSelectionClose = () => {
    this.setState(prevState => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
      }
    })
  }

  handleDrugLabelSelected = (itemId, selected) => {
    this.setState(prevState => ({
      selectedDrugs: prevState.selectedDrugs.map(drug =>
        drug.id === itemId ? { ...drug, selected } : { ...drug },
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  handleDrugLabelNoChanged = (itemId, no) => {
    this.setState(prevState => ({
      selectedDrugs: prevState.selectedDrugs.map(drug =>
        drug.id === itemId ? { ...drug, no } : { ...drug },
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  showRefreshOrder = () => {
    const { dispense } = this.props
    const { shouldRefreshOrder } = dispense
    if (shouldRefreshOrder) {
      if (!this.state.isShowOrderUpdated) {
        this.props.dispatch({
          type: 'global/updateState',
          payload: {
            openAdjustment: false,
          },
        })
        this.setState({
          isShowOrderUpdated: true,
          showDrugLabelSelection: false,
        })
      }
    }
  }

  render () {
    const { classes, handleSubmit, values, dispense, codetable } = this.props
    return (
      <div className={classes.root}>
        <DispenseDetails
          {...this.props}
          onSaveClick={handleSubmit}
          onEditOrderClick={this.editOrder}
          onFinalizeClick={this.makePayment}
          onReloadClick={this.handleReloadClick}
          onDrugLabelClick={this.handleDrugLabelClick}
          showDrugLabelSelection={this.state.showDrugLabelSelection}
          onDrugLabelSelectionClose={this.handleDrugLabelSelectionClose}
          onDrugLabelSelected={this.handleDrugLabelSelected}
          onDrugLabelNoChanged={this.handleDrugLabelNoChanged}
          selectedDrugs={this.state.selectedDrugs}
        />
        <CommonModal
          title='Orders'
          open={this.state.showOrderModal && dispense.queryCodeTablesDone}
          onClose={this.handleCloseAddOrder}
          onConfirm={this.handleOrderModal}
          maxWidth='md'
          observe='OrderPage'
        >
          <AddOrder
            visitType={values.visitPurposeFK}
            isFirstLoad={this.state.isFirstAddOrder}
            onReloadClick={() => {
              reloadDispense(this.props)
            }}
            {...this.props}
          />
        </CommonModal>
        <ViewPatientHistory top='213px' />

        <CommonModal
          title='Orders Updated'
          maxWidth='sm'
          open={this.state.isShowOrderUpdated}
          showFooter={false}
        >
          <div
            style={{
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <div
              style={{
                marginTop: -20,
              }}
            >
              <h3>
                Orders has been updated by other user. Click OK to refresh
                orders.
              </h3>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button
                color='primary'
                icon={null}
                onClick={() => {
                  const { dispatch } = this.props
                  dispatch({
                    type: 'dispense/updateState',
                    payload: {
                      shouldRefreshOrder: false,
                    },
                  })
                  this.setState({ isShowOrderUpdated: false })
                  if (this.handleReloadClick) {
                    this.handleReloadClick()
                  }
                }}
              >
                ok
              </Button>
            </div>
          </div>
        </CommonModal>
        {this.showRefreshOrder()}
      </div>
    )
  }
}

export default Main
