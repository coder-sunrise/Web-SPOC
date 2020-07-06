import update from 'immutability-helper'
import { createListViewModel } from 'medisys-model'
import { getUniqueId } from '@/utils/utils'
import { fakeSubmitForm } from '@/services/api'
import * as service from '../Medication/services'

const namespace = 'medication'
export default createListViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      namespace,
      currentTab: 0,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
        // if (pathname === '/inventory/master/medication' && !query.uid) {
        //   dispatch({
        //     type: 'updateState',
        //     payload: {
        //       currentTab: Number(query.t) || 0,
        //     },
        //   })
        // }

        // if (
        //   pathname === '/inventory/master' &&
        //   (!search || search === '?t=0')
        // ) {
        //   dispatch({
        //     type: 'medication/query',
        //   })
        // }
      })
    },
    effects: {
      *export (_, { call }) {
        const result = yield call(service.export)
        return result
      },

      *import ({ payload }, { call }) {
        const result = yield call(service.import, { content: payload.content })
        if (result === false) return false
        return result
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
              effectiveDates: [
                o.effectiveStartDate,
                o.effectiveEndDate,
              ],
              dispensingUOM: o.dispensingUOM ? o.dispensingUOM.id : null,
              favouriteSupplier: o.favouriteSupplier
                ? o.favouriteSupplier.id
                : null,
            }
          }),
        }
      },
    },
  },
})
