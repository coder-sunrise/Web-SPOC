import { createListViewModel } from 'medisys-model'
import { getCodes } from '@/utils/codes'

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
            console.log({ response })
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
