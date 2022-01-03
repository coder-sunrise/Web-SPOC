import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'collectSpecimen',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *getVisitLabWorkitems({ payload }, { call, put }) {
        const r = yield call(service.queryVisitLabWorkitems, payload)
        const { status, data } = r

        if (status === '200') {
          if (data) {
            const visitLabWorkitems = data
            return visitLabWorkitems
          }
          return null
        }
      },
    },
    reducers: {},
  },
})
