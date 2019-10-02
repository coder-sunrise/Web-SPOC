import { createListViewModel } from 'medisys-model'
import { FakeDataInvoiceClaimCount, FakeDataQueryById } from '../variables'
import * as service from '../services'

export default createListViewModel({
  namespace: 'claimSubmission',
  config: {},
  param: {
    service,
    state: {
      default: {},
      invoiceClaimCount: [],
      entity: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *getClaimCount (_, { call, put }) {
        // const response = yield call(service.queryBadgeCount)
        // const { data } = response
        return yield put({
          type: 'setClaimCount',
          // payload: { data },
          payload: {},
        })
      },
      *queryById ({ payload }, { call, put }) {
        // const response = yield call(service.queryById, payload.id)
        // const { data } = response
        return yield put({
          type: 'setQueryClaimResult',
          // payload: { data },
          payload: {},
        })
      },
    },
    reducers: {
      setClaimCount (state, { payload }) {
        return {
          ...state,
          // invoiceClaimCount: payload,
          invoiceClaimCount: FakeDataInvoiceClaimCount,
        }
      },
      setQueryClaimResult (state, { payload }) {
        return {
          ...state,
          entity: FakeDataQueryById(),
        }
      },
    },
  },
})
