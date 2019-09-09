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
        adjustmentList: [
          {
            id: 1,
            adjTitle: 'Adj001',
            adjAmount: 10,
            isDeleted: false,
          },
          {
            id: 2,
            adjTitle: 'Adj002',
            adjAmount: 5,
            isDeleted: false,
          },
          {
            id: 3,
            adjTitle: 'Adj003',
            adjAmount: 2,
            isDeleted: false,
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
