import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { notification } from '@/components'

export default createListViewModel({
  namespace: 'claimSubmissionApproved',
  config: {},
  param: {
    service,
    state: {
      fixedFilter: {
        status: 'Approved',
      },
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        dispatch({
          type: 'getCurrentBizSession',
        })
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
      *getApprovedStatus ({ payload }, { put, call }) {
        const response = yield call(service.getStatus, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
      },
      *submitAddPayment ({ payload }, { call, put, select }) {
        const userState = yield select((state) => state.user.data)
        const bizSessionState = yield select(
          (state) => state.invoicePayment.currentBizSessionInfo,
        )

        let addPaymentPayload = {}

        addPaymentPayload = {
          totalAmtPaid,
          cashReceived,
          cashReturned,
          paymentReceivedDate: moment().formatUTC(false),
          paymentReceivedByUserFK: userState.id,
          paymentReceivedBizSessionFK: bizSessionState.id,
          paymentCreatedBizSessionFK: bizSessionState.id,
          invoicePayerFK,
          invoicePaymentMode,
        }

        const response = yield call(service.addPayment, addPaymentPayload)
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
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data,
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
