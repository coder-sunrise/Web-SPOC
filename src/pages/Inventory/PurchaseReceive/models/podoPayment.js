import { createFormViewModel } from 'medisys-model'
import * as service from '../services'
import moment from 'moment'
import { fakePodoPaymentData } from '../variables'

const InitialPurchaseOrder = {
  purchaseOrderNo: 'PO/000001',
  purchaseOrderDate: '',
  purchaseOrderStatus: 'Draft',
  totalAmount: 0,
  outstandingAmount: 0,
}

export default createFormViewModel({
  namespace: 'podoPayment',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      purchaseOrderDetails: { ...InitialPurchaseOrder },
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
        }
      })
    },
    effects: {
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

        return {
          ...state,
          purchaseOrderDetails: {
            purchaseOrderNo,
            purchaseOrderDate,
            totalAmount,
            purchaseOrderStatus,
            outstandingAmount: totalAmount,
          },
          purchaseOrderPayment,
        }
      },
    },
  },
})
