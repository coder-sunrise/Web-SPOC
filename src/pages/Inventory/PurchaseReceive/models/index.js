import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'purchaseReceiveList',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      list: [],
      default: {
        purchaseOrderNo: '',
        transactionDates: [
          // moment().format('YYYY-MM-01'),
          // moment(),
        ],
        // allDate: false,
      },
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *batchWriteOff ({ payload }, { call }) {
        const r = yield call(service.upsertWithStatusCode, payload)
        return r
      },
    },
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          list: data.data,
        }
      },
    },
  },
})
