import { createListViewModel } from 'medisys-model'
import * as service from '../services/sddDetailService'

export default createListViewModel({
  namespace: 'sddDetail',
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
      queryDone (st, { payload }) {
        const { data } = payload
        console.log('datasdd', data)
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
    },
  },
})
