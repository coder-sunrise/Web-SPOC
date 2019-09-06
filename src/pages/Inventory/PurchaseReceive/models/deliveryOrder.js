import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'

export default createListViewModel({
  namespace: 'deliveryOrder',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        deliveryOrder_receivingItemList: [],
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
