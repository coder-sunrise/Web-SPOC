import { createListViewModel } from 'medisys-model'
import service from '../LabTrackingDetails/services'

export default createListViewModel({
  namespace: 'labTrackingDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        description: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *writeOff({ payload }, { call }) {
        const response = yield call(service.writeOff, payload)
        return response
      },
      *export({ payload }, { call }) {
        const result = yield call(service.export, payload)
        return result
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data,
        }
      },
    },
  },
})
