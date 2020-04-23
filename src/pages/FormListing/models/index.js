import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'formListing',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
      showModal: false,
      list: [
        {
          typeName: 'sdfsdfdsfs',
          statusFK: 3,
        },
      ],
    },

    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *update ({ payload }, { call, put }) {
        const response = yield call(service.update, payload)
        return response
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },

      queryOneDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },
    },
  },
})
