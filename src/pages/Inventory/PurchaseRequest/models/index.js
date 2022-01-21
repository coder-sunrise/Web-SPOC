import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'purchaseRequestList',
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
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {

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
