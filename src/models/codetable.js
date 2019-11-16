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
        console.time('fetchAllCachedCodetable')
        const response = yield call(getAllCodes)
        // console.log(response)
        // if (response) {
        //   const ct = response.reduce((allCodetable, codetable) => {
        //     // skip snomeddiagnosis codetable in development mode
        //     // if (
        //     //   codetable.code === 'codetable/ctsnomeddiagnosis' &&
        //     //   process.env.NODE_ENV === 'development'
        //     // ) {
        //     //   return {
        //     //     ...allCodetable,
        //     //     // [codetable.code.toLowerCase()]: codetable.data,
        //     //   }
        //     // }

        //     return {
        //       ...allCodetable,
        //       [codetable.code.toLowerCase()]: codetable.data,
        //     }
        //   }, {})
        yield put({
          type: 'updateState',
          payload: response,
        })
        console.timeEnd('fetchAllCachedCodetable')
      },

      *refreshCodes ({ payload }, { call, put }) {
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
    },
    reducers: {
      saveCodetable (state, { payload }) {
        return { ...state, [payload.code.toLowerCase()]: payload.data }
      },
    },
  },
})
