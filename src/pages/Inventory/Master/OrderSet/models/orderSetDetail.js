import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

const { upsert } = service

export default createFormViewModel({
  namespace: 'orderSetDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentId: '',
      default: {
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        isOrderable: true,
        serviceOrderSetItem: [],
        consumableOrderSetItem: [],
        isActive: true,
      },
      // entity: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(loct => {
        const { query = {} } = loct
        if (query.uid) {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: query.uid,
            },
          })
        }
      })
      // dispatch({
      //   type: 'serviceCenterList',
      //   payload: {
      //     pagesize: 99999,
      //   },
      // })
    },
    effects: {
      *submit({ payload }, { call }) {
        return yield call(upsert, payload)
      },

      // *serviceCenterList ({ payload }, { call, put }) {
      //   const response = yield call(queryServiceCenter, payload)
      //   yield put({
      //     type: 'getServiceCenterList',
      //     payload: response.status == '200' ? response.data : {},
      //   })
      // },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: {
            ...data,
            effectiveDates: [data.effectiveStartDate, data.effectiveEndDate],
          },
        }
      },

      // getServiceCenterList (state, { payload }) {
      //   const { data } = payload
      //   return {
      //     ...state,
      //     ctServiceCenter: data.map((x) => {
      //       return {
      //         value: x.id,
      //         name: x.name,
      //       }
      //     }),
      //   }
      // },
    },
  },
})
