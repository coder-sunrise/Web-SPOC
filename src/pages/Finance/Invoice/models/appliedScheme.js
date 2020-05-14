import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import { INVOICE_VIEW_MODE } from '@/utils/constants'
import * as service from '../services'
import {
  queryInvoicePayerByIdAndInvoiceVersionNo,
  saveAppliedScheme,
} from '../services/appliedScheme'
// utils

const defaultFilterValues = {
  invoiceStartDate: moment().add(-1, 'month').formatUTC(),
  invoiceEndDate: moment()
    .set({ hour: 23, minute: 59, second: 59 })
    .formatUTC(false),
}

export default createFormViewModel({
  namespace: 'appliedSchemes',
  config: {},
  param: {
    service,
    state: {
      default: {
        payments: [],
        invoice: {
          invoiceNo: '',
          invoiceRemark: '',
          totalAftAdj: 0,
          gstValue: 0,
          gstAmount: 0,
          totalAftGst: 0,
          invoiceItems: [],
        },
        invoicePayer: [],
        applicableSchemes: [],
        claimableSchemes: [],
        invoicePayment: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *fetchInvoicePayers ({ payload }, { call, put }) {
        const result = yield call(
          queryInvoicePayerByIdAndInvoiceVersionNo,
          payload,
        )
        const { status, data } = result
        if (status === '200')
          yield put({
            type: 'mapPaymentsToPayers',
            payload: data,
          })
      },
      *saveAppliedScheme ({ payload }, { call, put }) {
        const response = yield call(saveAppliedScheme, payload)
        if (response) {
          console.log({ response })
          yield put({
            type: 'invoiceDetail/updateState',
            payload: {
              mode: INVOICE_VIEW_MODE.DEFAULT,
            },
          })
        }
      },
    },
    reducers: {
      mapPaymentsToPayers (state, { payload }) {
        const { invoicePayment, invoicePayer } = payload
        const invoicePayerFkInPayments = invoicePayment.map(
          (payment) => payment.invoicePayerFK,
        )
        const mappedInvoicePayer = invoicePayer.map((payer) => ({
          ...payer,
          hasPayments: invoicePayerFkInPayments.includes(payer.id),
        }))
        return {
          ...state,
          entity: { ...payload, invoicePayer: mappedInvoicePayer },
        }
      },
    },
  },
})
