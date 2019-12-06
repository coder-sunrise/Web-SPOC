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
      outstandingBalance: summary.totalWithGST,
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
    // const prescription = values.prescription.map((o) => {
    //   return {
    //     ...o,
    //     batchNo: o.batchNo ? o.batchNo[0] : undefined,
    //   }
    // })
    values.prescription.forEach((o) => {
      if (o.batchNo instanceof Array) {
        if (o.batchNo && o.batchNo.length > 0) {
          const [
            firstIndex,
          ] = o.batchNo
          o.batchNo = firstIndex
        }
      }
    })
    dispatch({
      type: `dispense/save`,
      payload: {
        id: vid,
        values,
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
    const { dispatch, values } = this.props
    const { otherOrder, prescription } = values

    // dispatch({
    //   type: 'codetable/fetchCodes',
    //   payload: {
    //     code: 'inventorymedication',
    //     force: true,
    //     temp: true,
    //   },
    // })

    if (
      otherOrder &&
      prescription &&
      otherOrder.length === 0 &&
      prescription.length === 0
    ) {
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
  }

  makePayment = () => {
    const { dispatch, dispense, values } = this.props
    dispatch({
      type: 'dispense/finalize',
      payload: {
        id: dispense.visitID,
        values,
      },
    }).then((response) => {
      console.log({ response })
      if (response) {
        const parameters = {}
        router.push(getAppendUrl(parameters, '/reception/queue/billing'))
      }
    })
  }

  _editOrder = () => {
    const { dispatch, dispense, values } = this.props
    const { visitPurposeFK } = values.invoice
    if (visitPurposeFK === VISIT_TYPE.RETAIL) {
      this.handleOrderModal()
    } else {
      dispatch({
        type: `consultation/editOrder`,
        payload: {
          id: dispense.visitID,
          version: dispense.version,
        },
      }).then((o) => {
        if (o) {
          dispatch({
            type: `dispense/updateState`,
            payload: {
              editingOrder: true,
            },
          })
          reloadDispense(this.props)
        }
      })
    }
  }

  editOrder = (e) => {
    // const { handleSubmit } = this.props

    navigateDirtyCheck({
      onProceed: this._editOrder,
      // onConfirm: () => {
      //   handleSubmit()
      //   this._editOrder()
      // },
    })(e)
  }

  openFirstTabAddOrder = () => {
    if (this.state.showOrderModal) {
      this.props.dispatch({
        type: 'orders/updateState',
        payload: {
          type: '1',
          visitPurposeFK: 2,
        },
      })
    } else {
      this.props.dispatch({
        type: 'orders/updateState',
        payload: {
          visitPurposeFK: undefined,
        },
      })
    }
  }

  handleOrderModal = () => {
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

  render () {
    const { classes, handleSubmit } = this.props

    return (
      <div className={classes.root}>
        <DispenseDetails
          {...this.props}
          onSaveClick={handleSubmit}
          onEditOrderClick={this.editOrder}
          onFinalizeClick={this.makePayment}
          onReloadClick={() => {
            reloadDispense(this.props, 'refresh')
          }}
        />
        <CommonModal
          title='Orders'
          open={this.state.showOrderModal}
          onClose={this.handleOrderModal}
          maxWidth='md'
          observe='OrderPage'
        >
          <AddOrder
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
