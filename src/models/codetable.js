import { createListViewModel } from 'medisys-model'
import { getCodes, getAllCodes } from '@/utils/codes'
import { subscribeNotification } from '@/utils/realtime'

export default createListViewModel({
  namespace: 'codetable',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      tenantCodes: {}, // prepare for future use
      hasFilterProps: [],
    },
    subscriptions: ({ dispatch }) => {
      subscribeNotification('CodetableUpdated', {
        callback: ({ code }) => {
          console.log(code, 'rete')
          if (code === 'clinicianprofile') {
            window.g_app._store.dispatch({
              type: 'codetable/refreshCodes',
              payload: {
                code: 'doctorprofile',
                filter: { 'clinicianProfile.isActive': true },
              },
            })
          }

          window.g_app._store.dispatch({
            type: 'codetable/refreshCodes',
            payload: { code },
          })
        },
      })
    },
    effects: {
      *fetchAllCachedCodetable (_, { call, put }) {
        const response = yield call(getAllCodes)
        yield put({
          type: 'updateState',
          payload: response,
        })
      },
      *refreshCodes ({ payload }, { call, put }) {
        // console.log('refreshCodes')
        const { code } = payload
        const response = yield call(getCodes, { ...payload, refresh: true })
        yield put({
          type: 'saveCodetable',
          payload: {
            force: true,
            code,
            data: response,
          },
        })
        return response
      },
      *fetchCodes ({ payload }, { select, call, put }) {
        let ctcode
        if (typeof payload === 'object') {
          ctcode = payload.code.toLowerCase()
        } else {
          ctcode = payload.toLowerCase()
        }
        const codetableState = yield select((state) => state.codetable)

        if (ctcode !== undefined) {
          if (codetableState[ctcode] === undefined || payload.force) {
            const response = yield call(getCodes, payload)
            if (response.length > 0) {
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
      *batchFetch ({ payload }, { all, call, put }) {
        const { codes } = payload
        console.time('batch fetch')
        const responses = yield all(
          codes.map((code) => put({ type: 'fetchCodes', payload: { code } })),
        )
        console.timeEnd('batch fetch')
        return responses
      },
    },
    reducers: {
      saveCodetable (state, { payload }) {
        return { ...state, [payload.code.toLowerCase()]: payload.data }
      },
    },
  },
})
