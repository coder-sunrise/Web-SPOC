import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
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
        days: 1,
        fromto: [
          moment(),
          moment(),
        ],
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
