import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import service from '@/services/deposit'

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
      *bizSessionList({ payload }, { call, put }) {
        const response = yield call(service.queryBizSession, payload)
        yield put({
          type: 'updateBizSessionList',
          payload: response.status === '200' ? response.data : {},
        })
      },

      *updateDeposit({ payload }, { call, put }) {
        const response = yield call(service.upsertDeposit, payload)
        return response
      },

      *getPatientDeposit({ payload }, { call, put }) {
        const response = yield call(service.getPatientDeposit, payload)
        return response
      },
      *deleteTransaction({ payload }, { call, put }) {
        const result = yield call(service.deleteTransaction, payload)
        if (result === 204) {
          notification.success({ message: 'Deleted' })
        }
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
            }
          }),
        }
      },

      queryOneDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },

      updateBizSessionList(state, { payload }) {
        const { data } = payload
        return {
          ...state,
          bizSessionList: data.map(x => {
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
