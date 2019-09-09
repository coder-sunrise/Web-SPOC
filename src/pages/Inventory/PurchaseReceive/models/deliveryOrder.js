import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'deliveryOrder',
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
              doNo: 'PO/000001',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Will provide on 31 Jun 2018',
            },
            {
              id: 2,
              doNo: 'PO/000002',
              doDate: moment(),
              total: 50,
              outstanding: 0,
              remarks: 'Completed',
            },
            {
              id: 3,
              doNo: 'PO/000003',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Need Another Orders',
            },
            {
              id: 4,
              doNo: 'PO/000004',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Need Another Orders',
            },
            {
              id: 5,
              doNo: 'PO/000004',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Need Another Orders',
            },
          ],
        }
      },
    },
  },
})
