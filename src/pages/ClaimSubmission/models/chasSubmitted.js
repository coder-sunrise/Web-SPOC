import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'chasClaimSubmissionSubmitted',
  config: {},
  param: {
    service,
    state: {
      fixedFilter: {
        status: 'Submitted',
        schemeCode: 'CHAS',
      },
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *getSubmittedStatus({ payload }, { put, call }) {
        const response = yield call(service.getStatus, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data,
        }
      },
    },
  },
})
