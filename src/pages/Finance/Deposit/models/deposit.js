import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { queryBizSession } from '../services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'deposit',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *bizSessionList ({ payload }, { call, put }) {
        const response = yield call(queryBizSession, payload)
        yield put({
          type: 'updateBizSessionList',
          payload: response.status == '200' ? response.data : {},
        })
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

      updateBizSessionList (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          bizSessionList: data.map((x) => {
            return {
              value: x.sessionNo,
              name: x.sessionNo,
            }
          }),
        }
      },
    },
  },
})
