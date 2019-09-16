import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import { isPOStatusFinalized } from '../variables'
import _ from 'lodash'

export default createListViewModel({
  namespace: 'deliveryOrder',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      purchaseOrder: {
        poStatus: '',
        purchaseOrderOutstandingItem: []
      },
      deliveryOrderDate: moment(),
      deliveryOrder_receivingItemList: [],
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone(state, { payload }) {
        const { data } = payload

        return {
          ...state,
          list: [],
        }
      },

      mapPurchaseOrder(state, { payload }) {
        const { entity } = payload
        const { purchaseOrder, rows } = entity
        const { status } = purchaseOrder
        let outstandingItem = []

        // If PO status = Finalized, filter outstanding PO items
        if (isPOStatusFinalized(status)) {
          const tempList = rows.filter((x) => x.totalQty - x.quantityReceived > 0)
          if (!_.isEmpty(tempList)) {
            outstandingItem = tempList.map((x) => {
              return {
                ...x,
                totalBonusReceived: x.bonusQty,
                currentReceivingQty: 0,
                currentReceivingBonusQty: 0,
              }
            })
          }

        }

        return {
          ...state,
          list: [],
          purchaseOrder: {
            poStatus: status,
            purchaseOrderOutstandingItem: outstandingItem
          }
        }
      },

      upsertRow(state, { payload }) {
        let { rows } = state.entity
        if (payload.uid) {
          rows = rows.map((row) => {
            const n =
              row.uid === payload.uid
                ? {
                  ...row,
                  ...payload,
                }
                : row
            return n
          })
        } else {
          const itemFK = podoOrderType.filter((x) => x.value === payload.type)[0].itemFKName
          rows.push({
            ...payload,
            [itemFK]: payload.itemFK,
            name: payload.itemFK,
            uid: getUniqueId(),
          })
        }

        return {
          ...state,
          entity: {
            ...state.entity,
            rows: rows,
          },
        }
      },

      deleteRow(state, { payload }) {
        const { rows } = state.entity
        console.log('deleteRow', rows.filter((x) => x.uid !== payload))

        return {
          ...state,
          entity: {
            ...state.entity,
            // rows: rows.map((o) => {
            //   if (o.uid === payload) o.isDeleted = true
            //   return o
            // }),
            rows: rows.filter((x) => x.uid !== payload)
          }
        }
      },
    },
  },
})
