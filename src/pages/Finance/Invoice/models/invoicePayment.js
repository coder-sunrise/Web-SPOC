import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services/invoicePayment'
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
      default: {},
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
          dispatch({
            type: 'getCurrentBizSession',
          })
        }
      })
    },
    effects: {
      *getCurrentBizSession (_, { put, call }) {
        const bizSessionPayload = {
          IsClinicSessionClosed: false,
        }
        const response = yield call(service.getBizSession, bizSessionPayload)

        const { data } = response
        // data = null when get session failed
        if (data && data.totalRecords === 1) {
          const { data: sessionData } = data

          yield put({
            type: 'setCurrentBizSession',
            payload: { ...sessionData[0] },
          })
          return true
        }
        return false
      },
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
      *submitAddPayment ({ payload }, { call, put, select }) {
        const userState = yield select((state) => state.user.data)
        const bizSessionState = yield select(
          (state) => state.invoicePayment.currentBizSessionInfo,
        )
        const { paymentData, invoicePayerFK } = payload
        let addPaymentPayload = {}
        let invoicePaymentMode = []

        invoicePaymentMode = invoicePaymentMode.concat(
          paymentData.map((x, index) => {
            delete x.id
            const pMode = paymentMode.filter((y) => x.type === y.type)[0]
            return {
              paymentModeFK: pMode.paymentModeFK,
              paymentMode: pMode.type,
              amt: x.amount,
              sequence: index + 1,
              remark: x.remarks,
              [pMode.objName]: [
                { ...x },
              ],
            }
          }),
        )

        addPaymentPayload = {
          paymentReceivedByUserFK: userState.id,
          paymentReceivedBizSessionFK: bizSessionState.id,
          paymentCreatedBizSessionFK: bizSessionState.id,
          invoicePayerFK,
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
      queryDone (state, { payload }) {
        const { data } = payload
        let paymentResult
        if (data) {
          paymentResult = data.map((payment) => {
            let paymentTxnList = []
            const { invoicePayment, invoicePayerWriteOff, creditNote } = payment

            // Payment
            paymentTxnList = (paymentTxnList || []).concat(
              (invoicePayment || []).map((z) => {
                return {
                  id: z.id,
                  type: 'Payment',
                  itemID: z.receiptNo,
                  date: z.paymentReceivedDate,
                  amount: z.totalAmtPaid,
                  isCancelled: z.isCancelled,
                }
              }),
            )

            // Write-Off
            paymentTxnList = (paymentTxnList || []).concat(
              (invoicePayerWriteOff || []).map((z) => {
                return {
                  id: z.id,
                  type: 'Write Off',
                  itemID: z.writeOffCode,
                  date: z.writeOffDate,
                  amount: z.writeOffAmount,
                  reason: z.writeOffReason,
                  isCancelled: z.isCancelled,
                }
              }),
            )

            // Credit Note
            paymentTxnList = (paymentTxnList || []).concat(
              (creditNote || []).map((z) => {
                return {
                  id: z.id,
                  type: 'Credit Note',
                  itemID: z.creditNoteNo,
                  date: z.generatedDate,
                  amount: z.totalAftGST,
                  reason: z.remark,
                  isCancelled: z.isCancelled,
                }
              }),
            )

            return { ...payment, paymentTxnList }
          })
          return {
            ...state,
            entity: [
              ...paymentResult,
            ],
          }
        }

        return {
          ...state,
        }
      },

      setCurrentBizSession (state, { payload }) {
        return {
          ...state,
          currentBizSessionInfo: {
            ...payload,
          },
        }
      },

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
