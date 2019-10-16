import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'


export default createListViewModel({
  namespace: 'patientAttachment',
  config: {
    
  },
  param: {
    service,
    state: {
      default:{test: '123'},
    },
    // subscriptions: ({ dispatch, history }) => {
    //   history.listen(async (loct, method) => {
    //     const { pathname, search, query = {} } = loct
    //   })
    // },
    effects: {
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
