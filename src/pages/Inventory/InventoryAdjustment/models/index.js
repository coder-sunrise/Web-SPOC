import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'inventoryAdjustment',
  config: {},
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        // effectiveDates: [
        //   moment(),
        //   moment('2099-12-31'),
        // ],
        inventoryAdjustmentStatusFK: 1,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *generateRunningNo ({ payload }, { call, put }) {
        return yield call(service.getRunningNo)
      },

      *getStockDetails ({ payload }, { call, put }) {
        const result = yield call(service.queryStockDetails, payload)
        return result
        // yield put({ type: 'saveStockDetails', payload: result })
      },

      *removeRow ({ payload }, { call, put }) {
        const result = yield call(service.remove, payload)
        console.log('reuslt', result)
        // yield put({ type: 'saveStockDetails', payload: result })
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: {
            list: data.data.map((o) => {
              return {
                ...o,
              }
            }),
          },
        }
      },

      querySingleDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },

      // saveStockDetails (st, { payload }) {
      //   const { data } = payload
      //   console.log(data)
      //   return {
      //     ...st,
      //     stockDetails: data.map((o) => {
      //       return {
      //         ...o,
      //       }
      //     }),
      //   }
      // },
    },
  },
})
