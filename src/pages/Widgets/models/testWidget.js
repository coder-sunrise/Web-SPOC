import { createListViewModel } from 'medisys-model'

export default createListViewModel({
  namespace: 'testWidget',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {},
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
