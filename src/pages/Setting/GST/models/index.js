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
    effects: {
      *addAfter1Second (action, { call, put }) {
        console.log('effect')
        yield call(service.query)
        yield put({ type: 'add' })
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        console.log('payload', payload)

        const settingValue = data.map((o, i) => {
          switch (i) {
            case 0: {
              return { enableGst: o.settingValue }
            }
            case 1: {
              return { gstRegNum: o.settingValue }
            }
            case 2: {
              return { gstRate: o.settingValue }
            }
            default: {
              return { ...st }
            }
          }
        })

        return settingValue
      },
    },
  },
})
