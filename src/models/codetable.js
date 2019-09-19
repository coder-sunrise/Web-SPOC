import { createListViewModel } from 'medisys-model'
import { getCodes } from '@/utils/codes'

let list = {}
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
      *fetchCodes ({ payload }, { select, call, put, delay, ...rest }) {
        let ctcode = payload
        if (typeof payload === 'object') ctcode = payload.code
        // const { code } = payload
        const codetableState = yield select((state) => state.codetable)

        if (ctcode !== undefined) {
          if (codetableState[ctcode] === undefined) {
            const response = yield call(getCodes, payload)
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
        return { ...state, [payload.code.toLowerCase()]: payload.data }
      },
    },
  },
})
