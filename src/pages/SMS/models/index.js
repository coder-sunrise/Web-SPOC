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
            type: 'queryDone',
            payload: response.data,
          })
        }
      },
    },
    reducers: {
      queryOneDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },
      queryDone (st, { payload }) {
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
    },
  },
})
