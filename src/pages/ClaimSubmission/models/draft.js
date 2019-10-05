import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { FakeDataClaimSubmissionCHAS } from '../variables'

export default createListViewModel({
  namespace: 'claimSubmissionDraft',
  config: {},
  param: {
    service,
    state: {
      fixedFilter: {
        status: 'InProgress',
      },
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data,
        }
      },

      // fakeQueryDone (st, { payload }) {
      //   return {
      //     ...st,
      //     list: FakeDataClaimSubmissionCHAS(),
      //   }
      // },
    },
  },
})
