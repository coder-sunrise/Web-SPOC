import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'purchaseOrderPayment',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        poNo: 'PO/000001',
        purchaseOrderDate: moment(),
        invoiceAmount: 100,
        outstandingAmount: 50,
        payment_list: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone(state, { payload }) {
        const { data } = payload

        return {
          ...state,
          list: [],
        }
      },
    },
  },
})
