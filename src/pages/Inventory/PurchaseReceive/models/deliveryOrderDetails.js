import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'deliveryOrderDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
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
