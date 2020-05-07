import { createListViewModel } from 'medisys-model'

import * as service from '../services/systemMessage.js'

export default createListViewModel({
  namespace: 'systemMessage',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      // *queryList ({ payload }, { call, put }) {
      //   const response = yield call(service.queryList, payload)
      //   yield put({
      //     type: 'querySuccess',
      //     payload: {
      //       filter: payload,
      //       ...response,
      //     },
      //   })
      //   return response
      // },

      *read ({ payload }, { call, put }) {
        const response = yield call(service.upsertRead, payload)
        if (response) {
          yield put({
            type: 'queryOneDone',
            payload: response,
          })
          return true
        }
        return null
      },

      *dismiss ({ payload }, { call, put }) {
        const response = yield call(service.upsertDismiss, payload)
        if (response) {
          // const res = yield call(service.query, payload)
          yield put({
            type: 'queryOneDone',
            payload: response,
          })
          return true
        }
        return false
      },
    },
    reducers: {
      querySystemMessageListDone (st, { payload }) {
        const { data } = payload
        console.log(st)
        return {
          ...st,
          systemMessageList: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: {
            list: data.data.map((o) => {
              return {
                ...o,
              }
            }),
          },
        }
      },

      queryOneDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: payload,
        }
      },

      // updateBizSessionList (state, { payload }) {
      //   const { data } = payload
      //   return {
      //     ...state,
      //     bizSessionList: data.map((x) => {
      //       return {
      //         value: x.id,
      //         name: x.sessionNo,
      //       }
      //     }),
      //   }
      // },
    },
  },
})
