import { createFormViewModel } from 'medisys-model'
import { notification } from '@/components'
import service from '../services/invoicePayment'

const InitialSessionInfo = {
  isClinicSessionClosed: true,
  id: '',
  // sessionNo: `${moment().format('YYMMDD')}-01`,
  sessionNo: 'N/A',
  sessionNoPrefix: '',
  sessionStartDate: '',
  sessionCloseDate: '',
}

const initialState = {
  default: {},
  currentBizSessionInfo: { ...InitialSessionInfo },
}

export default createFormViewModel({
  namespace: 'invoicePayment',
  config: {},
  param: {
    service,
    state: { ...initialState },
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
      *getCurrentBizSession(_, { put, call }) {
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
        } else {
          yield put({
            type: 'setCurrentBizSession',
            payload: InitialSessionInfo,
          })
        }
      },
      *submitWriteOff({ payload }, { call, put }) {
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
      *submitAddPayment({ payload }, { call, put, select }) {
        const userState = yield select(state => state.user.data)
        const bizSessionState = yield select(
          state => state.invoicePayment.currentBizSessionInfo,
        )
        const { invoicePaymentList, invoicePayerFK } = payload
        let addPaymentPayload = {}
        // let invoicePaymentMode = []
        const {
          cashReceived,
          cashReturned,
          cashRounding,
          totalAmtPaid,
          invoicePaymentMode,
          paymentReceivedDate,
          paymentReceivedBizSessionFK,
          invoicePayment_InvoicePayerInfo = [],
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
            paymentReceivedDate,
            paymentReceivedByUserFK: userState.id,
            paymentReceivedBizSessionFK,
            paymentCreatedBizSessionFK: paymentReceivedBizSessionFK,
            invoicePayerFK,
            invoicePaymentMode,
            invoicePayment_InvoicePayerInfo,
          },
        ]

        const response = yield call(service.addPayment, addPaymentPayload)
        if (response) {
          notification.success({
            message: 'Payment added',
          })
          return true
        }

        return false
      },
      *submitVoidPayment({ payload }, { call }) {
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
      *submitVoidWriteOff({ payload }, { call }) {
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
      *submitVoidCreditNote({ payload }, { call }) {
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

      *getTransferData({ payload }, { put, call }) {
        const { id } = payload
        const response = yield call(service.getTransfer, id)

        const { data, status } = response
        if (status === '200') {
          yield put({
            type: 'setTransferData',
            payload: data,
          })
          return data
        }
        return false
      },

      *submitTransfer({ payload }, { call }) {
        const response = yield call(service.postTransfer, payload)

        if (response) {
          notification.success({
            message: 'Transferred',
          })
          return true
        }
        return false
      },

      *submitVoidInvoicePayerDeposit({ payload }, { call }) {
        const response = yield call(service.voidInvoicePayerDeposit, payload)
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
      reset() {
        return { ...initialState }
      },
      queryDone(state, { payload }) {
        const { data } = payload
        let paymentResult
        if (data) {
          paymentResult = data.map(payment => {
            let paymentTxnList = []
            const {
              invoicePayment,
              invoicePayerWriteOff,
              creditNote,
              statementInvoice,
              patientDepositTransaction,
            } = payment

            // Payment
            paymentTxnList = (paymentTxnList || []).concat(
              (invoicePayment || []).map(z => {
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
              (invoicePayerWriteOff || []).map(z => {
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
              (creditNote || []).map(z => {
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

            // Invoice PayerDepposit
            paymentTxnList = (paymentTxnList || []).concat(
              (patientDepositTransaction || []).map(z => {
                return {
                  ...z,
                  type: 'Deposit',
                  itemID: z.depositTransactionNo,
                  date: z.transactionDate,
                  reason: z.remarks,
                }
              }),
            )

            // Statement Corporate Charges
            paymentTxnList = (paymentTxnList || []).concat(
              (statementInvoice || [])
                .filter(x => x.adminCharge > 0)
                .map(z => {
                  return {
                    ...z,
                    // id: z.id,
                    type: 'Corporate Charges',
                    itemID: z.statementNo,
                    date: z.statementDate,
                    amount: z.adminCharge,
                    reason: '',
                    isCancelled: undefined,
                  }
                }),
            )

            // Statement Adjustment
            paymentTxnList = (paymentTxnList || []).concat(
              (statementInvoice || [])
                .filter(x => x.statementAdjustment && x.statementAdjustment > 0)
                .map(z => {
                  return {
                    ...z,
                    // id: z.id,
                    type: 'Statement Adjustment',
                    itemID: z.statementNo,
                    date: z.statementDate,
                    amount: z.statementAdjustment,
                    reason: '',
                    isCancelled: undefined,
                  }
                }),
            )

            return { ...payment, paymentTxnList }
          })

          return {
            ...state,
            entity: [...paymentResult],
            currentId: paymentResult[0].invoiceFK,
          }
        }

        return {
          ...state,
        }
      },

      setCurrentBizSession(state, { payload }) {
        return {
          ...state,
          currentBizSessionInfo: {
            ...payload,
          },
        }
      },

      setTransferData(state, { payload }) {
        return {
          ...state,
          transfer: {
            ...payload,
          },
        }
      },
    },
  },
})
