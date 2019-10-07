import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'settingClinicService',
  config: { queryOnLoad: false },
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment(),
          moment('2099-12-31'),
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
    effects: {},
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
            }
          }),
        }
      },
      querySingleDone (st, { payload }) {
        const { data } = payload
        console.log('single', data)
        return {
          ...st,
          entity: data,
        }
      },
    },
  },
})
