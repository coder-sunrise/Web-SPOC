import { createListViewModel } from 'medisys-model'
// import * as service from '../services'

export default createListViewModel({
  namespace: 'orders',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        type: '1',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {},
  },
})
