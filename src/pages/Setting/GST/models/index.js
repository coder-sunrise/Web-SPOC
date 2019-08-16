import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'settingGst',
  config: {
    // queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        enableGst: true,
        gstRegNum: 'M91234567X',
        gstRate: 0.05,
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
