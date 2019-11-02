import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'sms',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    // subscriptions: ({ dispatch, history }) => {
    //   history.listen(async (loct, method) => {
    //     const { pathname, search, query = {} } = loct
    //   })
    // },
    effects: {
      *querySMSData ({ payload, smsType }, { call, put }) {
        const response = yield call(service.querySMSData, payload, smsType)
        if (response) {
          yield put({
            type: 'getSMSData',
            payload: response.data,
          })
        }
      },
      *querySMSHistory ({ payload, smsType }, { call, put }) {
        const response = yield call(service.querySMSHistory, payload, smsType)
        if (response) {
          yield put({
            type: 'getSMSHistory',
            payload: response.data,
          })
        }
      },
    },
    reducers: {
      getSMSData (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
      getSMSHistory (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          smsHistory: data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
    },
  },
})
