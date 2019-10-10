import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'claimSubmissionApproved',
  config: {},
  param: {
    service,
    state: {
      fixedFilter: {
        status: 'Approved',
      },
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *getApprovedStatus ({ payload }, { put, call }) {
        const response = yield call(service.getStatus, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data,
        }
      },
    },
  },
})
