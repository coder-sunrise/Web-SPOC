import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'formListing',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      defaultLCForm: {
        type: '1',
        typeName: 'Letter of Certification',
        statusFK: 1,
        dataContent: {},
      },
      default: {},
      showModal: false,
      list: [
        {
          typeName: 'sdfsdfdsfs',
          type: '1',
          statusFK: 2,
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
        const response = yield call(service.upsert, payload)
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
