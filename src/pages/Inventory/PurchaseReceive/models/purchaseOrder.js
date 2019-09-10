import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'purchaseOrder',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        purchaseOrder: {
          poNo: 'PO/000001',
          poDate: moment(),
          status: 'Draft',
          shippingAddress:
            '24 Raffles Place, Clifford Centre, #07-02A, Singapore 048621',
        },
        purchaseOrderItems: [],
        adjustmentList: [
          {
            adjTitle: 'Adj001',
            adjAmount: 10,
          },
          {
            adjTitle: 'Adj002',
            adjAmount: 5,
          },
          {
            adjTitle: 'Adj003',
            adjAmount: 2,
          },
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload

        return {
          ...state,
          list: [],
        }
      },
    },
  },
})
