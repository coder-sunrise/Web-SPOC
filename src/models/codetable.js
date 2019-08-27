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
        const { code } = payload
        const codetableState = yield select((state) => state.codetable)
        if (code !== undefined) {
          if (codetableState[code] === undefined) {
            const response = yield call(getCodes, payload)
            if (response.length > 0) {
              // list = { ...list, [lowerCaseCode]: response }
              return yield put({
                type: 'saveCodetable',
                code,
                data: response,
              })
            }
          }
        }
        return false
      },
    },
    reducers: {
      saveCodetable (state, { code, data }) {
        return { ...state, [code]: data }
      },
    },
  },
})
