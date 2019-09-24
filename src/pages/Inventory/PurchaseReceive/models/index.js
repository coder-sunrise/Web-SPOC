import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'purchaseReceiveList',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      list: [],
      default: {
        filter: {
          transactionDates: [
            moment().format('YYYY-MM-01'),
            moment(),
          ],
          allDate: false,
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          ...state.default,
          list: data,
        }
      },
      // fakeQueryDone (state) {
      //   return {
      //     ...state,
      //     list: [
      //       {
      //         id: 1,
      //         poNo: 'PO/000001',
      //         poDate: moment(),
      //         supplier: 'ABC Co',
      //         expectedDeliveryDate: moment(),
      //         poStatus: 'Draft',
      //         total: 200,
      //         outstanding: 0,
      //         invoiceStatus: '',
      //         remarks: 'Will provide on 31 Jun 2018',
      //       },
      //       {
      //         id: 2,
      //         poNo: 'PO/000002',
      //         poDate: moment(),
      //         supplier: 'ABC Co',
      //         expectedDeliveryDate: moment(),
      //         poStatus: 'Partially Received',
      //         total: 200,
      //         outstanding: 0,
      //         invoiceStatus: 'Outstanding',
      //         remarks: 'Completed',
      //       },
      //       {
      //         id: 3,
      //         poNo: 'PO/000003',
      //         poDate: moment(),
      //         supplier: 'ABC Co',
      //         expectedDeliveryDate: moment(),
      //         poStatus: 'Finalized',
      //         total: 200,
      //         outstanding: 0,
      //         invoiceStatus: 'Outstanding',
      //         remarks: 'Need Another Orders',
      //       },
      //       {
      //         id: 4,
      //         poNo: 'PO/000004',
      //         poDate: moment(),
      //         supplier: 'ABC Co',
      //         expectedDeliveryDate: moment(),
      //         poStatus: 'Cancelled',
      //         total: 200,
      //         outstanding: 0,
      //         invoiceStatus: '',
      //         remarks: 'Need Another Orders',
      //       },
      //       {
      //         id: 5,
      //         poNo: 'PO/000005',
      //         poDate: moment(),
      //         supplier: 'ABC Co',
      //         expectedDeliveryDate: moment(),
      //         poStatus: 'Fulfilled',
      //         total: 200,
      //         outstanding: 12,
      //         invoiceStatus: 'Paid',
      //         remarks: 'Need Another Orders',
      //       },
      //       {
      //         id: 6,
      //         poNo: 'PO/000006',
      //         poDate: moment(),
      //         supplier: 'ABC Co',
      //         expectedDeliveryDate: moment(),
      //         poStatus: 'Fulfilled',
      //         total: 200,
      //         outstanding: 12,
      //         invoiceStatus: 'Write-Off',
      //         remarks: 'Need Another Orders',
      //       },
      //     ],
      //   }
      // },
    },
  },
})
