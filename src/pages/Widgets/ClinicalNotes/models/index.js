import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'

export default createFormViewModel({
  namespace: 'clinicalnotes',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      test: "hello",
      default: {
        clinicalNotes: 'Test notes',
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
