import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'settingRoom',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      querySingleDone (st, { payload }) {
        const { data } = payload
        data.effectiveDates = [
          data.effectiveStartDate,
          data.effectiveEndDate,
        ]
        return {
          ...st,
          entity: data,
        }
      },
    },
  },
})
