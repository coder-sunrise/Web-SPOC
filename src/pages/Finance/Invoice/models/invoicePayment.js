import { createFormViewModel } from 'medisys-model'
import * as service from '../services/invoicePayment'
import moment from 'moment'
import { InvoicePayerType } from '@/utils/codes'
import { fakeInvoicePaymentData } from '../sampleData'

const paymentMode = [
  { type: 'Cash', objName: 'depositPayment', paymentModeFK: 1 },
  { type: 'NETS', objName: 'netsPayment', paymentModeFK: 2 },
  {
    type: 'Credit Card',
    objName: 'creditCardPayment',
    paymentModeFK: 3,
  },
  { type: 'Cheque', objName: 'chequePayment', paymentModeFK: 4 },
  { type: 'Giro', objName: 'giroPayment', paymentModeFK: 5 },
]

export default createFormViewModel({
  namespace: 'invoicePayment',
  config: {},
  param: {
    service,
    state: {
      default: {
        paymentTxnList: [
          { patientPaymentTxn: [] },
          { coPayerPaymentTxn: [] },
          { govCoPayerPaymentTxn: [] },
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/finance/invoice/details') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: Number(query.id),
              // currentTab: 2,
            },
          })
        }
      })
    },
    effects: {
      *submitWriteOff ({ payload }, { call, put }) {
        const response = yield call(service.writeOff, payload)
        yield put({
          type: 'writeOffResult',
          payload: {
            // TBD
            response,
          },
        })
      },
      *submitVoidPayment ({ payload }, { call, put }) {
        const response = yield call(service.writeOff, payload)
        yield put({
          type: 'voidPaymentResult',
          payload: {
            // TBD
            response,
          },
        })
      },
      *submitAddPayment ({ payload }, { call, put }) {
        const { paymentData } = payload

        let addPaymentPayload = {}
        let invoicePaymentMode = []

        invoicePaymentMode = invoicePaymentMode.concat(
          paymentData.map((x, index) => {
            const pMode = paymentMode.filter((y) => x.type === y.type)[0]
            return {
              // ...x,
              paymentModeFK: pMode.paymentModeFK,
              paymentMode: pMode.type,
              amt: x.amount,
              // cashRounding
              sequence: index + 1,
              remark: x.remarks,
              [pMode.objName]: [
                { ...x },
              ],
            }
          }),
        )

        addPaymentPayload = {
          // invoicePayerFK
          invoicePaymentMode,
        }

        const response = yield call(service.addPayment, addPaymentPayload)

        yield put({
          type: 'addPaymentResult',
          response,
        })
      },
    },
    reducers: {
      // queryDone (state, { payload }) {
      //   // TBD
      //   console.log('queryDone', payload)
      //   return {
      //     ...state,
      //   }
      // },

      addPaymentResult (state, { payload }) {
        // TBD
        return {
          ...state,
        }
      },

      writeOffResult (state, { payload }) {
        // TBD
        return {
          ...state,
        }
      },

      voidPaymentResult (state, { payload }) {
        // TBD
        return {
          ...state,
        }
      },

      fakeQueryDone (state, { payload }) {
        const {
          invoicePayment,
          invoicePayerWriteOff,
          creditNote,
        } = fakeInvoicePaymentData
        let paymentTxnList = []

        InvoicePayerType.map((x) => {
          // Payment
          paymentTxnList[x.listName] = (paymentTxnList[x.listName] || [])
            .concat(
              (invoicePayment || [])
                .filter((y) => y.invoicePayerFK === x.invoicePayerFK)
                .map((z) => {
                  return {
                    id: z.id,
                    type: 'Payment',
                    itemID: z.receiptNo,
                    date: moment(z.paymentReceivedDate).format('DD MMM YYYY'),
                    amount: z.totalAmtPaid,
                    isCancelled: z.isCancelled,
                  }
                }),
            )

          // Write-Off
          paymentTxnList[x.listName] = (paymentTxnList[x.listName] || [])
            .concat(
              (invoicePayerWriteOff || [])
                .filter((y) => y.invoicePayerFK === x.invoicePayerFK)
                .map((z) => {
                  return {
                    id: z.id,
                    type: 'Write Off',
                    itemID: z.writeOffCode,
                    date: moment(z.writeOffDate).format('DD MMM YYYY'),
                    amount: z.writeOffAmount,
                    reason: z.writeOffReason,
                    isCancelled: z.isCancelled,
                  }
                }),
            )

          // Credit Note
          paymentTxnList[x.listName] = (paymentTxnList[x.listName] || [])
            .concat(
              (creditNote || [])
                .filter((y) => y.invoicePayerFK === x.invoicePayerFK)
                .map((z) => {
                  return {
                    id: z.id,
                    type: 'Credit Note',
                    itemID: z.creditNoteNo,
                    date: moment(z.generatedDate).format('DD MMM YYYY'),
                    amount: z.totalAftGST,
                    reason: z.remark,
                    isCancelled: z.isCancelled,
                  }
                }),
            )
          return null
        })

        return {
          ...state,
          entity: {
            ...fakeInvoicePaymentData,
            paymentTxnList,
          },
        }
      },
    },
  },
})
