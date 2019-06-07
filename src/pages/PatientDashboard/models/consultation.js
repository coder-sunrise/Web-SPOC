import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'consultation',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      selectedWidgets: [
        '1',
      ],
    },
    subscriptions: ({ dispatch, history }) => {
      // history.listen(async (loct, method) => {
      //   const { pathname, search, query = {} } = loct
      // })
    },
    effects: {
      // *fetchList ({ payload }, { call, put }) {
      //   const response = yield call(service.queryList)
      //   console.log(response)
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       list: Array.isArray(response) ? response : [],
      //     },
      //   })
      // },
      // *querySingle ({ payload }, { call, put }) {
      //   const response = yield call(service.query, payload)
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       entity: response.data,
      //     },
      //   })
      //   return response.data
      // },
      // *submit ({ payload }, { call }) {
      //   // console.log(payload)
      //   return yield call(service.upsert, payload)
      // },
    },
    reducers: {},
  },
})
