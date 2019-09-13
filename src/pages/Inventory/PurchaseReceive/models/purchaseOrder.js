import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'

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
        rows: [],
        purchaseOrderMedicationItem: [
          {
            id: 1,
            inventoryMedicationFK: 35,
            uom: '',
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 25.0,
            unitPrice: 25.0,
          },
        ],
        purchaseOrderVaccinationItem: [
          {
            id: 1,
            inventoryVaccinationFK: 10,
            uom: '',
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 40.0,
            unitPrice: 40.0,
          },
        ],
        purchaseOrderConsumableItem: [
          {
            id: 1,
            inventoryConsumableFK: 8,
            uom: '',
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 48.0,
            unitPrice: 48.0,
          },
          {
            id: 2,
            inventoryConsumableFK: 10,
            uom: '',
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 50.0,
            unitPrice: 50.0,
          },
        ],
        purchaseOrderAdjustment: [
          {
            adjRemark: 'Adj 001',
            adjType: 'ExactAmount',
            adjValue: -24,
            sequence: 1,
          },
          {
            adjRemark: 'Adj 002',
            adjType: 'Percentage',
            adjValue: 10,
            sequence: 2,
          },
        ],
      },
    },
    // subscriptions: ({ dispatch, history }) => {
    //   history.listen(async (loct, method) => {
    //     const { pathname, search, query = {} } = loct
    //   })
    // },
    effects: {},
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload
        console.log('queryDone')
        return {
          ...state,
          list: [],
        }
      },

      fakeQueryDone (state, { payload }) {
        console.log('fakeQueryDone', state)
        //const data = payload
        const data = state.default

        let itemRows = []
        podoOrderType.forEach((x) => {
          itemRows = itemRows.concat(
            (data[x.prop] || []).map((y) => {
              const d = {
                uid: getUniqueId(),
                type: x.value,
                itemFK: y[x.itemFKName],
                ...y,
              }
              return x.convert ? x.convert(d) : d
            }),
          )
        })

        return {
          ...state,
          entity: {
            ...state.default,
            rows: itemRows,
          },
        }
      },
    },
  },
})
