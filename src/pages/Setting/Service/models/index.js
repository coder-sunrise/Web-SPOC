import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'settingClinicService',
  config: {},
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        ctServiceCenter_ServiceNavigation: [],
        description: '',
        isAutoOrder: false,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
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
          // filter: {},
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
      queryOneDone (st, { payload }) {
        const { data } = payload
        // console.log('single', data)
        return {
          ...st,
          entity: data,
        }
      },
    },
  },
})
