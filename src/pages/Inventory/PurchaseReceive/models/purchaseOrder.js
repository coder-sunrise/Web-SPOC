import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'

export default createListViewModel({
  namespace: 'purchaseOrder',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        purchaseOrder: {
          poNo: 'PO/000001',
          poDate: moment(),
          status: 'Draft',
          shippingAddress:
            '24 Raffles Place, Clifford Centre, #07-02A, Singapore 048621',
          gstEnabled: false,
          gstIncluded: false,
          invoiceGST: 0,
          invoiceTotal: 0,
        },
        purchaseOrderItems: [
          {
            id: 1,
            code: 35,
            isNew: true,
            orderQty: 1,
            totalPrice: 25.0,
            unitPrice: 25.0,
            uom: 'Box',
          },
          {
            id: 2,
            code: 35,
            isNew: true,
            orderQty: 1,
            totalPrice: 40.0,
            unitPrice: 40.0,
            uom: 'Box',
          },
          {
            id: 3,
            code: 35,
            isNew: true,
            orderQty: 1,
            totalPrice: 48.0,
            unitPrice: 48.0,
            uom: 'Box',
          },
          {
            id: 4,
            code: 35,
            isNew: true,
            orderQty: 1,
            totalPrice: 50.0,
            unitPrice: 50.0,
            uom: 'Box',
          },
        ],
        adjustmentList: [
          {
            adjTitle: 'Adj 001',
            isPercentage: false,
            adjAmount: -24,
          },
          {
            adjTitle: 'Adj 002',
            isPercentage: true,
            adjPercentage: 10.0,
            adjAmount: 0,
          },
          // {
          //   adjTitle: 'Adj003',
          //   adjAmount: 2,
          // },
        ],
      },
    },
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
          list: [],
        }
      },
    },
  },
})
