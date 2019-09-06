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
      queryDone (state, { payload }) {
        const { data } = payload

        return {
          ...state,
          list: [
            {
              id: 1,
              patientName: 'Ali Bin Abu',
              accountNo: 'S1234567890',
              balance: 9999,
              lastTxnDate: moment(),
            },
            {
              id: 2,
              patientName: 'Abu Bin Ali',
              accountNo: 'S1234567890',
              balance: 8888,
              lastTxnDate: moment(),
            },
            {
              id: 3,

              patientName: 'Ali Bin Abu',
              accountNo: 'S1234567890',
              balance: 7777,
              lastTxnDate: moment(),
            },
            {
              id: 4,
              patientName: 'Abu Bin Ali',
              accountNo: 'S1234567890',
              balance: 6666,
              lastTxnDate: moment(),
            },
            {
              id: 5,
              patientName: 'Ali Bin Abu',
              accountNo: 'S1234567890',
              balance: 0,
              lastTxnDate: moment(),
            },
            {
              id: 6,
              patientName: 'Abu Bin Ali',
              accountNo: 'S1234567890',
              balance: 0,
              lastTxnDate: moment(),
            },
          ],
          // list: data.data.map((o) => {
          //   return {
          //     ...o,
          //   }
          // }),
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
