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
      filterSearch: {
        isAllDateChecked: false,
        transactionDates: [
          moment().startOf('month').formatUTC(),
          moment().formatUTC(false),
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        //   if (pathname === '/inventory/pr') {
        //     dispatch({
        //       type: 'purchaseReceiveList/query',
        //       payload: {
        //         sorting: [
        //           { columnName: 'purchaseOrderNo', direction: 'asc' },
        //         ],
        //       },
        //     })
        //   }
      })
    },
    effects: {
      *batchWriteOff ({ payload }, { call }) {
        const r = yield call(service.upsert, payload)
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
