import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services/deliveryOrder'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import { fakeDOQueryDoneData, isPOStatusFinalized } from '../variables'

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
      data: undefined,
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
        const response = yield call(service.queryById, payload)

        if (response.status === '200') {
          const { data } = response
          if (data.deliveryOrderItem) {
            data.deliveryOrderItem = data.deliveryOrderItem.map((x) => ({
              ...x,
              maxCurrentReceivingQty: x.orderQty - x.totalQtyReceived,
              maxCurrentReceivingBonusQty:
                x.bonusQuantity - x.totalBonusReceived,
            }))
          }
          return yield put({
            type: 'setDeliveryOrder',
            payload: { data },
          })
        }

        return false
      },
      *getOutstandingPOItem ({ payload }, { call, put }) {
        const { rows, purchaseOrder } = payload
        let outstandingItem = []
        const tempList = rows.filter(
          (x) =>
            x.totalQuantity - x.quantityReceived - x.bonusReceived > 0 &&
            !x.isDeleted,
        )
        if (!_.isEmpty(tempList)) {
          outstandingItem = tempList.map((x) => {
            return {
              ...x,
              orderQuantity: x.orderQuantity,
              totalBonusReceived: x.bonusReceived,
              // currentReceivingQty: x.orderQuantity - x.totalQtyReceived,
              // currentReceivingBonusQty: x.bonusQty - x.bonusReceived,
              currentReceivingQty: x.orderQuantity - x.quantityReceived,
              currentReceivingBonusQty: x.bonusQuantity - x.bonusReceived,
              maxCurrentReceivingQty: x.orderQuantity - x.quantityReceived,
              maxCurrentReceivingBonusQty: x.bonusQuantity - x.bonusReceived,
            }
          })
        }

        return yield put({
          type: 'setOutstandingPOItem',
          payload: { outstandingItem, rows, purchaseOrder },
        })
      },

      *addNewDeliveryOrder ({ payload }, { call, put }) {
        // Call API to query DeliveryOrder#
        const runningNumberResponse = yield call(service.queryRunningNumber, {
          prefix: 'DO',
        })
        const { data: doRunningNumber } = runningNumberResponse

        return yield put({
          type: 'setAddNewDeliveryOrder',
          payload: {
            deliveryOrderNo: doRunningNumber,
          },
        })
      },

      *getStockDetails ({ payload }, { call }) {
        const result = yield call(service.queryStockDetails, payload)
        return result
        // yield put({ type: 'saveStockDetails', payload: result })
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
        const { deliveryOrderItem } = data

        const itemRows = deliveryOrderItem.map((x) => {
          return {
            ...x,
            uid: getUniqueId(),
            type: x.inventoryTypeFK,
            code: x.inventoryItemFK,
            name: x.inventoryItemFK,
            uom: x.inventoryItemFK,
            orderQuantity: x.orderQty,
            quantityReceived: x.totalQtyReceived,
            bonusQuantity: x.bonusQty,
            currentReceivingQty: x.recevingQuantity,
            currentReceivingBonusQty: x.bonusQuantity,
            // expiryDate: null,
          }
        })
        return {
          ...state,
          entity: {
            ...data,
            rows: itemRows || [],
          },
        }
      },

      setOutstandingPOItem (state, { payload }) {
        const { outstandingItem, rows, purchaseOrder } = payload
        const { deliveryOrder } = purchaseOrder
        let newDeliveryOrder = deliveryOrder.map((x) => {
          let totalQty = 0
          x.deliveryOrderItem.map((y) => {
            totalQty += y.recevingQuantity + y.bonusQuantity
          })

          return {
            ...x,
            totalQty,
          }
        })

        return {
          ...state,
          list: newDeliveryOrder,
          purchaseOrderDetails: {
            purchaseOrder: { ...purchaseOrder },
            purchaseOrderItem: rows,
            purchaseOrderOutstandingItem: outstandingItem,
          },
        }
      },

      upsertRow (state, { payload }) {
        let { rows } = state.entity
        const { gridRows } = payload
        if (payload.uid) {
          rows = gridRows.map((o) => {
            let itemFK
            const item = podoOrderType.filter((x) => x.value === o.type)
            if (item.length > 0) {
              const { itemFKName } = item[0]
              itemFK = itemFKName
            }
            return {
              ...o,
              [itemFK]: o.itemFK,
            }
          })
          // rows = rows.map((row) => {
          //   const n =
          //     row.uid === payload.uid
          //       ? {
          //           ...row,
          //           ...payload,
          //         }
          //       : row
          //   return n
          // })
        } else {
          // const itemFK = podoOrderType.filter(
          //   (x) => x.value === payload.type,
          // )[0].itemFKName
          let itemFK
          const item = podoOrderType.filter((x) => x.value === payload.type)
          if (item.length > 0) {
            const { itemFKName } = item[0]
            itemFK = itemFKName
          }
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
        // rows.find((v) => v.uid === payload).isDeleted = true
        const deletedRow = rows.find((v) => v.uid === payload)
        if (deletedRow) deletedRow.isDeleted = true

        // let newRows = rows.filter((v) => v.uid !== payload)

        return { ...state, entity: { ...state.entity, rows } }
      },
    },
  },
})
