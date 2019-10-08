import { createFormViewModel } from 'medisys-model'
import * as service from '../services/podoPayment'

export default createFormViewModel({
  namespace: 'podoPayment',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      purchaseOrderPayment: [],
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/inventory/pr/pdodetails') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              type: query.type,
              id: Number(query.id),
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
      *queryPodoPayment ({ payload }, { call, put }) {
        return yield put({
          type: 'setPodoPayment',
          payload: { ...payload },
        })
      },
    },
    reducers: {
      setPodoPayment (state, { payload }) {
        const { purchaseOrder } = payload
        const {
          purchaseOrderPayment,
          purchaseOrderNo,
          purchaseOrderDate,
          totalAmount,
          purchaseOrderStatus,
        } = purchaseOrder

        let newPurchaseOrderPayment
        if (purchaseOrderPayment.length >= 1) {
          newPurchaseOrderPayment = purchaseOrderPayment.map((x) => {
            return {
              ...x.clinicPaymentDto,
              ...x,
            }
          })
        }

        return {
          ...state,
          purchaseOrderDetails: {
            purchaseOrderNo,
            purchaseOrderDate,
            totalAmount,
            purchaseOrderStatus,
            outstandingAmount: totalAmount,
          },
          purchaseOrderPayment: newPurchaseOrderPayment || [],
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
