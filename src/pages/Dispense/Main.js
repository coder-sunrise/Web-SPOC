import React, { Component } from 'react'
import router from 'umi/router'
// common component
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { withFormikExtend, notification, CommonModal } from '@/components'
// sub component
// import DispenseDetails from './DispenseDetails'
// import DispenseDetails from './DispenseDetails/PrintDrugLabelWrapper'
// utils
import { calculateAmount, navigateDirtyCheck } from '@/utils/utils'
import Yup from '@/utils/yup'
import { VISIT_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import { openCautionAlertOnStartConsultation } from '@/pages/Widgets/Orders/utils'
import DrugLabelSelection from './DispenseDetails/DrugLabelSelection'
import AddOrder from './DispenseDetails/AddOrder'
import DispenseDetails from './DispenseDetails/WebSocketWrapper'

const calculateInvoiceAmounts = (entity) => {
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
    // payload: visitRegistration.entity.visit.id,
    payload: dispense.visitID,
  }).then((response) => {
    if (response) {
      const result = calculateInvoiceAmounts(response)
      resetForm(result)
    }
  })
}

const ConvertBatchNoArrayToText = (array) => {
  if (array) {
    return array.map((o) => {
      const item = { ...o }
      if (item.batchNo instanceof Array) {
        if (item.batchNo && item.batchNo.length > 0) {
          const [
            firstIndex,
          ] = item.batchNo
          item.batchNo = firstIndex
        }
      }
      return item
    })
  }

  return array
}

const constructPayload = (values) => {
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
  mapPropsToValues: (pops) => {
    const { dispense = {} } = pops
    const obj = dispense.entity || dispense.default
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
    }).then((o) => {
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
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { prescription = [] } = nextProps.values
    this.setState(() => {
      return {
        selectedDrugs: prescription.map((x) => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  componentDidMount = async () => {
    const { dispatch, values, dispense } = this.props
    const { otherOrder = [], prescription = [], visitPurposeFK } = values
    dispatch({
      type: 'dispense/incrementLoadCount',
    })
    const isEmptyDispense = otherOrder.length === 0 && prescription.length === 0
    const noClinicalObjectRecord = !values.clinicalObjectRecordFK

    const accessRights = Authorized.check('queue.dispense.editorder')

    if (visitPurposeFK === VISIT_TYPE.RETAIL && isEmptyDispense) {
      this.setState(
        (prevState) => {
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

    this.setState(() => {
      return {
        selectedDrugs: prescription.map((x) => {
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
    const addOrderList = [
      VISIT_TYPE.RETAIL,
    ]
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
      }).then((o) => {
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

  editOrder = (e) => {
    const { values } = this.props
    const { visitPurposeFK } = values

    if (visitPurposeFK === VISIT_TYPE.RETAIL) {
      this._editOrder()
    } else {
      navigateDirtyCheck({
        onProceed: this._editOrder,
        // onConfirm: () => {
        //   handleSubmit()
        //   this._editOrder()
        // },
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
      (prevState) => {
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
    const newOrderRows = rows.filter((row) => !row.id && !row.isDeleted)
    if (formik.OrderPage && !formik.OrderPage.dirty && newOrderRows.length > 0)
      this.showConfirmationBox()
    else if (visitPurposeFK === VISIT_TYPE.BILL_FIRST) {
      dispatch({
        type: 'consultation/discard',
        payload: {
          id: consultation.entity.id,
        },
      }).then((response) => {
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
    const { prescription = [] } = values
    this.setState((prevState) => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
        selectedDrugs: prescription.map((x) => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  handleDrugLabelSelectionClose = () => {
    this.setState((prevState) => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
      }
    })
  }

  handleDrugLabelSelected = (itemId, selected) => {
    this.setState((prevState) => ({
      selectedDrugs: prevState.selectedDrugs.map(
        (drug) => (drug.id === itemId ? { ...drug, selected } : { ...drug }),
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  handleDrugLabelNoChanged = (itemId, no) => {
    this.setState((prevState) => ({
      selectedDrugs: prevState.selectedDrugs.map(
        (drug) => (drug.id === itemId ? { ...drug, no } : { ...drug }),
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
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
          />
        </CommonModal>
      </div>
    )
  }
}

export default Main
