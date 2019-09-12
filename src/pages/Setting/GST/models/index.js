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
        enableGst: false,
        gstRegNum: 'M91234567X',
        gstRate: 0.0,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        const settingValue = data.map((o, i) => {
          return {
            [o.settingKey]: o.settingValue,
          }
        })

        return {
          entity: settingValue,
        }
      },
    },
  },
})
