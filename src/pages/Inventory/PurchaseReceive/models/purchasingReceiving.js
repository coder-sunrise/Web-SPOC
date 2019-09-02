import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'purchasingReceiving',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload

        return {
          ...state,
          list: [
            {
              id: 1,
              poNo: 'PO/000001',
              poDate: moment(),
              expectedDeliveryDate: moment(),
              status: 'partially',
              total: 200,
              outstanding: 0,
              remarks: 'Will provide on 31 Jun 2018',
            },
            {
              id: 2,
              poNo: 'PO/000002',
              poDate: moment(),
              expectedDeliveryDate: moment(),
              status: 'final',
              total: 200,
              outstanding: 0,
              remarks: 'Completed',
            },
            {
              id: 3,
              poNo: 'PO/000003',
              poDate: moment(),
              expectedDeliveryDate: moment(),
              status: 'fully',
              total: 200,
              outstanding: 0,
              remarks: 'Need Another Orders',
            },
            {
              id: 4,
              poNo: 'PO/000004',
              poDate: moment(),
              expectedDeliveryDate: moment(),
              status: 'draft',
              total: 200,
              outstanding: 0,
              remarks: 'Need Another Orders',
            },
            {
              id: 5,
              poNo: 'PO/000004',
              poDate: moment(),
              expectedDeliveryDate: moment(),
              status: 'writeoff',
              total: 200,
              outstanding: 12,
              remarks: 'Need Another Orders',
            },
          ],
        }
      },
    },
  },
})
