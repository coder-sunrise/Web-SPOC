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
      *fetchCodes ({ code }, { select, call, put, delay, ...rest }) {
        const codetableState = yield select((state) => state.codetable)
        if (code !== undefined) {
          const lowerCaseCode = code.toLowerCase()
          if (codetableState[lowerCaseCode] === undefined) {
            const response = yield call(getCodes, lowerCaseCode)
            if (response.length > 0) {
              // list = { ...list, [lowerCaseCode]: response }
              return yield put({
                type: 'saveCodetable',
                code: lowerCaseCode,
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
