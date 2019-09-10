import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'settingGeneral',
  config: {
    // queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        systemCurrency: 'SGD',
        currencyRounding: 'Up',
        roundingToTheClosest: '0.50',
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
