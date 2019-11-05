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
        let hasFilter = false
        if (typeof payload === 'object') {
          ctcode = payload.code
          hasFilter = payload.filter !== undefined
        }
        const codetableState = yield select((state) => state.codetable)

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
