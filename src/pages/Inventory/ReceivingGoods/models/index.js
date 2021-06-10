import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'receivingGoodsList',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      list: [],
      filterSearch: {
        isAllDateChecked: false,
        transactionDates: [
          moment()
            .startOf('month')
            .formatUTC(),
          moment()
            .endOf('day')
            .formatUTC(false),
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *batchWriteOff({ payload }, { call }) {
        const r = yield call(service.writeOffReceivingGoods, payload)
        return r
      },
    },
    reducers: {
      queryDone(state, { payload }) {
        const { data } = payload
        return {
          ...state,
          list: data.data,
        }
      },
    },
  },
})
