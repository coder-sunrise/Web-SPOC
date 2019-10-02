import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'deposit',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        balance: 0,
        patientDepositTransaction: {
          transactionDate: moment(),
          amount: 0,
        },
      },
    },

    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *bizSessionList ({ payload }, { call, put }) {
        const response = yield call(service.queryBizSession, payload)
        yield put({
          type: 'updateBizSessionList',
          payload: response.status === '200' ? response.data : {},
        })
      },

      *updateDeposit ({ payload }, { call, put }) {
        const response = yield call(service.upsertDeposit, payload)
        return response
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },

      querySingleDone (st, { payload }) {
        const { data } = payload
        console.log('single', payload)
        return {
          ...st,
          entity: data,
        }
      },

      updateBizSessionList (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          bizSessionList: data.map((x) => {
            return {
              value: x.id,
              name: x.sessionNo,
            }
          }),
        }
      },
    },
  },
})
