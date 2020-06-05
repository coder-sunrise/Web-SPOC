import { createListViewModel } from 'medisys-model'
import { notification } from '@/components'
import * as service from '../services'

export default createListViewModel({
  namespace: 'patientNurseNotes',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        // const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      // *removeRow ({ payload }, { call, put }) {
      //   const result = yield call(service.remove, payload)
      //   if (result === 204) {
      //     notification.success({ message: 'Deleted' })
      //   }
      // },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
    },
  },
})
