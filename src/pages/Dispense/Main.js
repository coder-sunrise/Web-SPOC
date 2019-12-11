import React, { Component } from 'react'
import router from 'umi/router'
// common component
import { withFormikExtend, notification, CommonModal } from '@/components'
// sub component
// import DispenseDetails from './DispenseDetails'
import DispenseDetails from './DispenseDetails/PrintDrugLabelWrapper'
// utils
import {
  calculateAmount,
  getAppendUrl,
  navigateDirtyCheck,
} from '@/utils/utils'
import Yup from '@/utils/yup'
import { VISIT_TYPE } from '@/utils/constants'
import AddOrder from './DispenseDetails/AddOrder'

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

const constructPayload = (values) => {
  const _values = {
    ...values,
    prescription: values.prescription.map((o) => {
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
    }),
  }
  // values.prescription.forEach()
  return _values
}

@withFormikExtend({
  authority: 'queue.dispense',
  enableReinitialize: true,
  notDirtyDuration: 3,
  mapPropsToValues: ({ dispense = {} }) => {
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
class Main extends Component {
  state = {
    showOrderModal: false,
  }

  componentDidMount () {
    const { dispatch, values, dispense } = this.props
    const { otherOrder = [], prescription = [], visitPurposeFK } = values
    dispatch({
      type: 'dispense/incrementLoadCount',
    })
    const isEmptyDispense = otherOrder.length === 0 && prescription.length === 0
    const noClinicalObjectRecord = !values.clinicalObjectRecordFK

    if (visitPurposeFK === VISIT_TYPE.RETAIL && isEmptyDispense) {
      this.setState(
        (prevState) => {
          return {
            showOrderModal: !prevState.showOrderModal,
          }
        },
        () => {
          this.openFirstTabAddOrder()
        },
      )
    }

    if (
      visitPurposeFK === VISIT_TYPE.BILL_FIRST &&
      isEmptyDispense &&
      noClinicalObjectRecord &&
      dispense.loadCount === 0
    ) {
      this.editOrder()
    }
  }

  makePayment = async () => {
    const { dispatch, dispense, values } = this.props
    const _values = constructPayload(values)
    // console.log({ _values })
    const finalizeResponse = await dispatch({
      type: 'dispense/finalize',
      payload: {
        id: dispense.visitID,
        values: _values,
      },
    })
    if (finalizeResponse) {
      await dispatch({
        type: 'dispense/query',
        payload: {
          id: dispense.visitID,
          version: Date.now(),
        },
      })
      router.push(getAppendUrl({}, '/reception/queue/billing'))
    }
  }

  _editOrder = () => {
    const { dispatch, dispense, values } = this.props
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

  handleCloseAddOrder = () => {
    const { dispatch, consultation, values } = this.props
    const { visitPurposeFK } = values

    if (visitPurposeFK === VISIT_TYPE.BILL_FIRST) {
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

  render () {
    const { classes, handleSubmit, values } = this.props

    return (
      <div className={classes.root}>
        <DispenseDetails
          {...this.props}
          onSaveClick={handleSubmit}
          onEditOrderClick={this.editOrder}
          onFinalizeClick={this.makePayment}
          onReloadClick={this.handleReloadClick}
        />
        <CommonModal
          title='Orders'
          open={this.state.showOrderModal}
          onClose={this.handleCloseAddOrder}
          onConfirm={this.handleOrderModal}
          maxWidth='md'
          observe='OrderPage'
        >
          <AddOrder
            visitType={values.visitPurposeFK}
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
