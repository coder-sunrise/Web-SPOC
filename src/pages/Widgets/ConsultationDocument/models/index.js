import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'

export default createFormViewModel({
  namespace: 'consultationDocument',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        type: '1',
        from: 'Dr Johhy',
        referenceNo: 'MC203918-29',
      },
    },
    // subscriptions: ({ dispatch, history }) => {
    //   history.listen(async (loct, method) => {
    //     const { pathname, search, query = {} } = loct
    //   })
    // },
    effects: {},
    reducers: {},
  },
})
