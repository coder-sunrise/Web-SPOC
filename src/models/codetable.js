import { createListViewModel } from 'medisys-model'
import { getCodes, getAllCodes } from '@/utils/codes'

export default createListViewModel({
  namespace: 'codetable',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      tenantCodes: {}, // prepare for future use
    },
    subscriptions: {},
    effects: {
      *fetchAllCachedCodetable (_, { call, put }) {
        const response = yield call(getAllCodes)
        if (response) {
          yield put({
            type: 'updateState',
            payload: response.reduce((allCodetable, codetable) => {
              // skip snomeddiagnosis codetable in development mode
              // if (
              //   codetable.code === 'codetable/ctsnomeddiagnosis' &&
              //   process.env.NODE_ENV === 'development'
              // ) {
              //   return {
              //     ...allCodetable,
              //     // [codetable.code.toLowerCase()]: codetable.data,
              //   }
              // }

              return {
                ...allCodetable,
                [codetable.code.toLowerCase()]: codetable.data,
              }
            }, {}),
          })
        }
      },
      *refreshCodes ({ payload }, { call, put }) {
        const { code } = payload
        const response = yield call(getCodes, { ...payload, refresh: true })
        if (response.length > 0) {
          yield put({
            type: 'saveCodetable',
            payload: {
              code,
              data: response,
            },
          })
          return response
        }
        return []
      },
      *fetchCodes ({ payload }, { select, call, put }) {
        let ctcode = payload
        if (typeof payload === 'object') ctcode = payload.code

        const codetableState = yield select((state) => state.codetable)

        if (ctcode !== undefined) {
          if (codetableState[ctcode] === undefined || payload.force) {
            const response = yield call(getCodes, payload)
            // console.log({ ctcode, response })
            if (response.length > 0) {
              // list = { ...list, [lowerCaseCode]: response }
              yield put({
                type: 'saveCodetable',
                payload: {
                  code: ctcode,
                  data: response,
                },
              })
              return response
            }
          } else {
            return codetableState[ctcode]
          }
        }
        return []
      },
    },
    reducers: {
      saveCodetable (state, { payload }) {
        // console.log({ payload })
        return { ...state, [payload.code.toLowerCase()]: payload.data }
      },
    },
  },
})
