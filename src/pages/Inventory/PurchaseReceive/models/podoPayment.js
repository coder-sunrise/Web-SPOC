import { createFormViewModel } from 'medisys-model'
import * as service from '../services'
import moment from 'moment'
import { fakePodoPaymentData } from '../variables'

const InitialPurchaseOrder = {
  poNo: 'PO/000001',
  poDate: moment(),
  status: 'Draft',
  invoiceTotal: 0,
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
      paymentList: [],
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
        // Call API to query delivery order listing
        let data = fakePodoPaymentData

        return yield put({
          type: 'setPodoPayment',
          payload: { data },
        })
      },
    },
    reducers: {
      setPodoPayment (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          paymentList: data,
        }
      },
      setPurchaseOrderDetails (state, { payload }) {
        const { purchaseOrder } = payload
        return {
          ...state,
          purchaseOrderDetails: { ...purchaseOrder, outstandingAmount: 10.99 },
        }
      },
    },
  },
})
