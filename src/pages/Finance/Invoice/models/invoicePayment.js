import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services/invoicePayment'
import { notification } from '@/components'

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
        if (
          pathname.indexOf('/finance/invoice/details') === 0 ||
          pathname.indexOf('/claim-submission/chas/invoice/details') === 0
        ) {
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
        const { status } = response
        if (status === '200') {
          notification.success({
            message: 'Saved',
          })
          return true
        }
        return false
      },
      *submitAddPayment ({ payload }, { call, put, select }) {
        const userState = yield select((state) => state.user.data)
        const bizSessionState = yield select(
          (state) => state.invoicePayment.currentBizSessionInfo,
        )
        console.log({ payload, bizSessionState })
        const { invoicePaymentList, invoicePayerFK } = payload
        let addPaymentPayload = {}
        // let invoicePaymentMode = []
        const {
          cashReceived,
          cashReturned,
          cashRounding,
          totalAmtPaid,
          invoicePaymentMode,
        } = invoicePaymentList

        // invoicePaymentMode = invoicePaymentMode.concat(
        //   paymentModes.map((x) => {
        //     const pMode = paymentMode.filter(
        //       (y) => x.paymentModeFK === y.paymentModeFK,
        //     )[0]
        //     return {
        //       ...x,
        //       [pMode.objName]: [
        //         { ...x },
        //       ],
        //     }
        //   }),
        // )

        addPaymentPayload = [
          {
            totalAmtPaid,
            cashReceived,
            cashReturned,
            paymentReceivedDate: moment().formatUTC(false),
            paymentReceivedByUserFK: userState.id,
            paymentReceivedBizSessionFK: bizSessionState.id,
            paymentCreatedBizSessionFK: bizSessionState.id,
            invoicePayerFK,
            invoicePaymentMode,
          },
        ]

        const response = yield call(service.addPayment, addPaymentPayload)
        const { status } = response

        if (parseInt(status, 10) === 200) {
          notification.success({
            message: 'Payment added',
          })
          return true
        }

        return false
      },
      *submitVoidPayment ({ payload }, { call }) {
        const response = yield call(service.voidPayment, payload)
        const { status } = response

        if (status === '200') {
          notification.success({
            message: 'Saved',
          })
          return true
        }

        return false
      },
      *submitVoidWriteOff ({ payload }, { call }) {
        const response = yield call(service.voidWriteOff, payload)
        const { status } = response

        if (status === '200') {
          notification.success({
            message: 'Saved',
          })
          return true
        }

        return false
      },
      *submitVoidCreditNote ({ payload }, { call }) {
        const response = yield call(service.voidCreditNote, payload)
        const { status } = response

        if (status === '200') {
          notification.success({
            message: 'Saved',
          })
          return true
        }

        return false
      },
    },
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload
        let paymentResult
        if (data) {
          paymentResult = data.map((payment) => {
            let paymentTxnList = []
            const {
              invoicePayment,
              invoicePayerWriteOff,
              creditNote,
              statementInvoice,
            } = payment

            // Payment
            paymentTxnList = (paymentTxnList || []).concat(
              (invoicePayment || []).map((z) => {
                return {
                  ...z,
                  // id: z.id,
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
                  ...z,
                  // id: z.id,
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
                  ...z,
                  // id: z.id,
                  type: 'Credit Note',
                  itemID: z.creditNoteNo,
                  date: z.generatedDate,
                  amount: z.totalAftGST,
                  reason: z.remark,
                  isCancelled: z.isCancelled,
                }
              }),
            )

            // Statement Invoice
            paymentTxnList = (paymentTxnList || []).concat(
              (statementInvoice || [])
                .filter((x) => x.adminCharge > 0)
                .map((z) => {
                  return {
                    ...z,
                    // id: z.id,
                    type: 'Admin Charge',
                    itemID: z.statementNo,
                    date: z.statementDate,
                    amount: z.adminCharge,
                    reason: '',
                    isCancelled: undefined,
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
    },
  },
})
