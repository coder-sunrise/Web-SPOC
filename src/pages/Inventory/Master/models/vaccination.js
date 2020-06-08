import update from 'immutability-helper'
import { createListViewModel } from 'medisys-model'
import { getUniqueId } from '@/utils/utils'
import { fakeSubmitForm } from '@/services/api'
import * as service from '../Vaccination/services'

const namespace = 'vaccination'
export default createListViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentTab: 0,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
        // if (pathname === '/inventory/master/vaccination' && !query.uid) {
        //   dispatch({
        //     type: 'updateState',
        //     payload: {
        //       currentTab: Number(query.t) || 0,
        //     },
        //   })
        // }

        // if (pathname === '/inventory/master' && search === '?t=2') {
        //   dispatch({
        //     type: 'vaccination/query',
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
