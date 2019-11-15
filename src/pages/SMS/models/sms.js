import { createListViewModel } from 'medisys-model'
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
      *querySMSHistory ({ payload, smsType }, { call, put }) {
        const response = yield call(service.querySMSHistory, payload, smsType)
        return response
        if (response) {
          yield put({
            type: 'getSMSHistory',
            payload: response.data,
          })
        }
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
