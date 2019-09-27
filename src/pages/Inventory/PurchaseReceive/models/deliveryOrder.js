import { createFormViewModel } from 'medisys-model'
import * as service from '../services/deliveryOrder'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import { fakeDOQueryDoneData, isPOStatusFinalized } from '../variables'
import _ from 'lodash'

const InitialPurchaseOrder = {
  purchaseOrder: {
    poNo: 'PO/000001',
    poDate: moment(),
    status: 'Draft',
  },
  purchaseOrderItem: [],
  purchaseOrderOutstandingItem: [],
}

export default createFormViewModel({
  namespace: 'deliveryOrderDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      purchaseOrderDetails: { ...InitialPurchaseOrder },
      list: [],
      default: {
        deliveryOrderNo: '',
        deliveryOrderDate: moment(),
        remark: '',
        rows: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/inventory/pr/pdodetails') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              type: query.type,
              id: Number(query.id),
            },
          })
        }
      })
    },

    effects: {
      *queryDeliveryOrder ({ payload }, { call, put }) {
        // Call API to query delivery order listing
        let data = fakeDOQueryDoneData

        return yield put({
          type: 'setDeliveryOrder',
          payload: { data },
        })
      },

      *getOutstandingPOItem ({ payload }, { call, put }) {
        const { rows, purchaseOrder } = payload
        const { purchaseOrderStatusFK } = purchaseOrder
        let outstandingItem = []

        // If PO status = Finalized, filter outstanding PO items
        if (isPOStatusFinalized(purchaseOrderStatusFK)) {
          const tempList = rows.filter(
            (x) => x.totalQuantity - x.quantityReceived > 0,
          )
          if (!_.isEmpty(tempList)) {
            outstandingItem = tempList.map((x) => {
              return {
                ...x,
                orderQuantity: x.orderQuantity,
                totalBonusReceived: x.bonusReceived,
                currentReceivingQty: x.orderQuantity - x.quantityReceived,
                currentReceivingBonusQty: x.bonusQuantity - x.bonusReceived,
              }
            })
          }
        }

        return yield put({
          type: 'setOutstandingPOItem',
          payload: { outstandingItem, rows, purchaseOrder },
        })
      },

      *addNewDeliveryOrder ({ payload }, { call, put }) {
        // Call API to query DeliveryOrder#

        return yield put({
          type: 'setAddNewDeliveryOrder',
          payload: {
            deliveryOrderNo: 'DO/000999',
          },
        })
      },
    },

    reducers: {
      setAddNewDeliveryOrder (state, { payload }) {
        const { deliveryOrderNo } = payload
        const { purchaseOrderDetails } = state
        const {
          purchaseOrder,
          purchaseOrderOutstandingItem,
        } = purchaseOrderDetails
        return {
          ...state,
          entity: {
            purchaseOrderFK: purchaseOrder.id,
            deliveryOrderNo,
            deliveryOrderDate: moment(),
            remark: '',
            rows: purchaseOrderOutstandingItem,
          },
        }
      },

      setDeliveryOrder (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          list: data,
        }
      },

      setOutstandingPOItem (state, { payload }) {
        const { outstandingItem, rows, purchaseOrder } = payload
        const { deliveryOrder } = purchaseOrder
        return {
          ...state,
          list: deliveryOrder,
          purchaseOrderDetails: {
            purchaseOrder: { ...purchaseOrder },
            purchaseOrderItem: rows,
            purchaseOrderOutstandingItem: outstandingItem,
          },
        }
      },

      upsertRow (state, { payload }) {
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
          const itemFK = podoOrderType.filter(
            (x) => x.value === payload.type,
          )[0].itemFKName
          rows.push({
            ...payload,
            [itemFK]: payload.itemFK,
            name: payload.itemFK,
            uom: payload.itemFK,
            uid: getUniqueId(),
            isDeleted: false,
          })
        }

        return {
          ...state,
          entity: {
            ...state.entity,
            rows,
          },
        }
      },

      deleteRow (state, { payload }) {
        const { rows } = state.entity
        return {
          ...state,
          entity: {
            ...state.entity,
            // rows: rows.map((o) => {
            //   if (o.uid === payload) o.isDeleted = true
            //   return o
            // }),
            rows: rows.filter((x) => x.uid !== payload),
          },
        }
      },
    },
  },
})
