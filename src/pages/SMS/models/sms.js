import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'

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
      *querySMSHistory ({ payload, smsType }, { call, put }) {
        const response = yield call(service.querySMSHistory, payload, smsType)
        if (response) {
          yield put({
            type: 'getSMSHistory',
            payload: response.data,
          })
          return response
        }
        return false
      },

      *sendSms ({ payload }, { call, put }) {
        const response = yield call(service.upsert, payload)
        if (response === 204) {
          notification.success({ message: 'SMS Sent' })
          return true
        }
        return false
      },
    },
    reducers: {
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
