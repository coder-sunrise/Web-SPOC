import update from 'immutability-helper'
import { createListViewModel } from 'medisys-model'
import { getUniqueId } from '@/utils/utils'
import { fakeSubmitForm } from '@/services/api'
import service from '../OrderSet/services'

const namespace = 'orderSet'
export default createListViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentTab: 0,
      list: [],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      // *add ({ payload }, { put, select }) {
      //   let st = yield select((s) => s[namespace])
      //   if (payload.length) {
      //     yield put({
      //       type: 'updateState',
      //       payload: update(st, {
      //         entity: {
      //           items: {
      //             $unshift: payload.map((o) => {
      //               return {
      //                 Id: getUniqueId(),
      //                 ...o,
      //               }
      //             }),
      //           },
      //         },
      //       }),
      //     })
      //   }
      // },
      // *change ({ payload }, { put, select }) {
      //   let st = yield select((s) => s[namespace])
      //   let { items } = st.entity
      //   const newItems = items.map((row) => {
      //     const n = payload[row.Id] ? { ...row, ...payload[row.Id] } : row
      //     return n
      //   })
      //   yield put({
      //     type: 'updateState',
      //     payload: update(st, {
      //       entity: { items: { $set: newItems } },
      //     }),
      //   })
      // },
      // *delete ({ payload }, { put, select }) {
      //   let st = yield select((s) => s[namespace])
      //   let { items } = st.entity
      //   const newItems = items.filter(
      //     (row) => !payload.find((o) => o === row.Id),
      //   )
      //   yield put({
      //     type: 'updateState',
      //     payload: update(st, {
      //       entity: { items: { $set: newItems } },
      //     }),
      //   })
      // },
      // *submit ({ payload }, { call }) {
      //   // console.log(payload)
      //   return yield call(upsert, payload)
      // },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        // console.log('this is pack reducer', data)
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
              effectiveDates: [
                o.effectiveStartDate,
                o.effectiveEndDate,
              ],
            }
          }),
        }
      },
    },
  },
})
