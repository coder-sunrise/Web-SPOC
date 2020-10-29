import { createListViewModel } from 'medisys-model'
import { notification } from '@/components'
import * as service from '../services'

export default createListViewModel({
  namespace: 'patientAttachment',
  config: {},
  param: {
    service,
    state: {
      default: { test: '123' },
    },
    // subscriptions: ({ dispatch, history }) => {
    //   history.listen(async (loct, method) => {
    //     const { pathname, search, query = {} } = loct
    //   })
    // },
    effects: {
      *queryOne ({ payload }, { select, call, put }) {
        const response = yield call(service.queryDone, payload)

        if (response && response.status === '200') {
          return response.data
        }
        return null
      },
      *removeRow ({ payload }, { call, put }) {
        const result = yield call(service.remove, payload)
        if (result === 204) {
          notification.success({ message: 'Deleted' })
        }
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
            }
          }),
        }
      },
    },
  },
})
