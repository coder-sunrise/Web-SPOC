import { createListViewModel } from 'medisys-model'
import service from '../Consumable/services'

const namespace = 'consumable'
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
        // if (pathname === '/inventory/master/consumable' && !query.uid) {
        //   dispatch({
        //     type: 'updateState',
        //     payload: {
        //       currentTab: Number(query.t) || 0,
        //     },
        //   })
        // }

        // if (pathname === '/inventory/master' && search === '?t=1') {
        //   dispatch({
        //     type: 'consumable/query',
        //   })
        // }
      })
    },
    effects: {
      // *fetchConsumableList (_, { call, put }) {
      //   const response = yield call(service.queryList)
      //   yield put({
      //     type: 'save',
      //     payload: response,
      //   })
      // },
      *export(_, { call }) {
        const result = yield call(service.export)
        return result
      },

      *import({ payload }, { call }) {
        const result = yield call(service.import, {
          content: payload.content,
          isOverwrite: payload.importOverwrite,
        })
        if (result === false) return false
        return result
      },
    },
    reducers: {
      // save (st, { payload }) {
      //   const { data } = payload
      //   return {
      //     ...st,
      //     list: data.data.map((o) => {
      //       return {
      //         ...o,
      //         effectiveDates: [
      //           o.effectiveStartDate,
      //           o.effectiveEndDate,
      //         ],
      //         uom: o.uom ? o.uom.id : null,
      //         favouriteSupplier: o.favouriteSupplier
      //           ? o.favouriteSupplier.id
      //           : null,
      //       }
      //     }),
      //   }
      // },
      queryDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
              uom: o.uom ? o.uom.id : null,
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
