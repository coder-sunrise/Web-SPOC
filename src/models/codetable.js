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
      hasFilterProps: [],
    },
    subscriptions: {},
    effects: {
      *fetchAllCachedCodetable (_, { call, put }) {
        console.time('fetchAllCachedCodetable')
        const response = yield call(getAllCodes)
        console.log(response)
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
        // console.log(ct)
        console.timeEnd('fetchAllCachedCodetable')
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
        // console.log(payload)

        let ctcode
        let hasFilter = false
        if (typeof payload === 'object') {
          ctcode = payload.code.toLowerCase()
          hasFilter = payload.filter !== undefined
        } else {
          ctcode = payload.toLowerCase()
        }
        const codetableState = yield select((state) => state.codetable)
        // console.log(codetableState)
        // if (hasFilter) {
        //   yield put({
        //     type: 'addToHasFilterList',
        //     payload: {
        //       code: ctcode,
        //     },
        //   })
        // } else {
        //   const filteredBefore = codetableState.hasFilterProps.includes(ctcode)
        //   if (filteredBefore) {
        //     payload.force = true
        //     yield put({
        //       type: 'removeFromFilterList',
        //       payload: {
        //         code: ctcode,
        //       },
        //     })
        //   }
        // }
        // console.log(
        //   ctcode,
        //   codetableState[ctcode] === undefined,
        //   payload.force,
        //   hasFilter,
        // )
        if (ctcode !== undefined) {
          if (
            codetableState[ctcode] === undefined ||
            payload.force ||
            hasFilter
          ) {
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
      removeFromFilterList (state, { payload }) {
        return {
          ...state,
          hasFilterProps: state.hasFilterProps.filter(
            (code) => payload.code !== code,
          ),
        }
      },
      addToHasFilterList (state, { payload }) {
        return {
          ...state,
          hasFilterProps: [
            ...state.hasFilterProps,
            payload.code,
          ],
        }
      },
      saveCodetable (state, { payload }) {
        return { ...state, [payload.code.toLowerCase()]: payload.data }
      },
    },
  },
})
