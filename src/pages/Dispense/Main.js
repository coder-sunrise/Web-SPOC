import React, { Component } from 'react'
import router from 'umi/router'
// common component
import { withFormikExtend, notification } from '@/components'
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

const reloadDispense = (props, effect = 'query') => {
  const { dispatch, dispense, resetForm } = props

  dispatch({
    type: `dispense/${effect}`,
    // payload: visitRegistration.entity.visit.id,
    payload: dispense.visitID,
  }).then((o) => {
    resetForm(o)
    // dispatch({
    //   type: `formik/clean`,
    //   payload: 'DispensePage',
    // })
  })
}
@withFormikExtend({
  authority: 'queue.dispense',
  enableReinitialize: true,
  notDirtyDuration: 3,
  mapPropsToValues: ({ dispense = {} }) => {
    const obj = dispense.entity || dispense.default
    const output = calculateAmount(
      obj.invoice.invoiceItem,
      obj.invoice.invoiceAdjustment,
      {
        isGSTInclusive: obj.invoice.isGSTInclusive,
        totalField: 'totalAfterItemAdjustment',
        adjustedField: 'totalAfterOverallAdjustment',
        gstField: 'totalAfterGST',
        gstAmtField: 'gstAmount',
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
    const _values = {
      ...obj,
      invoice: {
        ...obj.invoice,
        ...invoiceSummary,
        // invoiceTotal,
        // invoiceTotalAftAdj: invoiceTotal,
        // invoiceGSTAmt,
        // invoiceTotalAftGST,
        // outstandingBalance,
      },
    }
    return _values
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
  componentDidMount () {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventorymedication',
        force: true,
        temp: true,
      },
    })
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
      if (response) {
        const parameters = {}
        router.push(getAppendUrl(parameters, '/reception/queue/billing'))
      }
    })
  }

  _editOrder = () => {
    const { dispatch, dispense } = this.props

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

  editOrder = (e) => {
    const { handleSubmit } = this.props

    navigateDirtyCheck({
      onProceed: this._editOrder,
      onConfirm: () => {
        handleSubmit()
        this._editOrder()
      },
    })(e)
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
      </div>
    )
  }
}

export default Main
