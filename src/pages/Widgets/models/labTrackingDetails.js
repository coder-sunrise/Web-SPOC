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
    effects: {},
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
