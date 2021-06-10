import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'claimSubmission',
  config: {},
  param: {
    service,
    state: {
      default: {},
      invoiceClaimCount: [],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *getClaimCount({ payload }, { put, call }) {
        const response = yield call(service.queryBadgeCount, payload)
        const { data } = response
        return yield put({
          type: 'setClaimCount',
          payload: data || [],
        })
      },
      *queryById({ payload }, { call, put }) {
        const response = yield call(service.queryById, payload)
        const { data } = response

        if (response.status === '200' && data !== null) {
          yield put({
            type: 'setQueryById',
            payload: {
              ...data,
            },
          })
          return data
        }
        return false
      },
    },
    reducers: {
      setClaimCount(state, { payload }) {
        return {
          ...state,
          invoiceClaimCount: payload,
        }
      },
      setQueryById(state, { payload }) {
        return {
          ...state,
          entity: {
            ...payload,
            // visitDate: moment(payload.visitDate).format(dateFormatLongWithTime),
            // patientDob: moment(payload.patientDob).format(dateFormatLong),
          },
        }
      },
    },
  },
})
