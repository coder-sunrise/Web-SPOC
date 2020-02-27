import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services/deliveryOrder'
import { podoOrderType, groupByFKFunc } from '@/utils/codes'
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
          (x) => x.orderQuantity - x.quantityReceived > 0 && !x.isDeleted,
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
              // currentReceivingBonusQty: x.bonusQuantity - x.bonusReceived,
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
        // const runningNumberResponse = yield call(service.queryRunningNumber, {
        //   prefix: 'DO',
        // })
        // const { data: doRunningNumber } = runningNumberResponse

        return yield put({
          type: 'setAddNewDeliveryOrder',
        })
      },
    },

    reducers: {
      setAddNewDeliveryOrder (state, { payload }) {
        // const { deliveryOrderNo } = payload
        const {
          purchaseOrderDetails,
          MedicationItemList = [],
          ConsumableItemList = [],
          VaccinationItemList = [],
        } = state
        const {
          purchaseOrder,
          purchaseOrderOutstandingItem,
        } = purchaseOrderDetails

        const newOSItem = purchaseOrderOutstandingItem.map((o) => {
          if (MedicationItemList.length > 0 && o.type === 1) {
            const m = MedicationItemList.find(
              (f) =>
                f.inventoryMedicationFK === o.inventoryMedicationFK &&
                f.stock &&
                f.stock.length > 0,
            )
            const defaultStock = m.stock.find((s) => s.isDefault === true)
            const batchNo = defaultStock.batchNo || o.batchNo
            return {
              ...o,
              id: undefined,
              batchNo,
            }
          }
          if (ConsumableItemList.length > 0 && o.type === 2) {
            const m = ConsumableItemList.find(
              (f) =>
                f.inventoryConsumableFK === o.inventoryConsumableFK &&
                f.stock &&
                f.stock.length > 0,
            )
            const defaultStock = m.stock.find((s) => s.isDefault === true)
            const batchNo = defaultStock.batchNo || o.batchNo
            return {
              ...o,
              id: undefined,
              batchNo,
            }
          }
          if (VaccinationItemList.length > 0 && o.type === 3) {
            const m = VaccinationItemList.find(
              (f) =>
                f.inventoryVaccinationFK === o.inventoryVaccinationFK &&
                f.stock &&
                f.stock.length > 0,
            )
            const defaultStock = m.stock.find((s) => s.isDefault === true)
            const batchNo = defaultStock.batchNo || o.batchNo
            return {
              ...o,
              id: undefined,
              batchNo,
            }
          }

          return o
        })

        return {
          ...state,
          entity: {
            purchaseOrderFK: purchaseOrder.id,
            // deliveryOrderNo,
            deliveryOrderDate: moment(),
            remark: '',
            rows: newOSItem,
          },
        }
      },

      setDeliveryOrder (state, { payload }) {
        const { purchaseOrderDetails } = state
        const { purchaseOrderItem } = purchaseOrderDetails
        const { data } = payload
        const { deliveryOrderItem } = data

        const itemRows = deliveryOrderItem.map((x) => {
          const inventoryType = podoOrderType.find(
            (o) => o.value === x.inventoryTypeFK,
          )
          return {
            ...x,
            uid: getUniqueId(),
            [inventoryType.itemFKName]: x.inventoryItemFK,
            itemFK: x.inventoryItemFK,
            type: x.inventoryTypeFK,
            code: x.inventoryItemFK,
            name: x.inventoryItemFK,
            uom: x.inventoryItemFK,
            orderQuantity: x.orderQty,
            quantityReceived: x.totalQtyReceived,
            bonusQuantity: x.bonusQty,
            currentReceivingQty: x.recevingQuantity,
            currentReceivingBonusQty: x.bonusQuantity,
            maxCurrentReceivingQty: x.recevingQuantity,
            maxCurrentReceivingBonusQty: x.bonusQuantity,
            batchNo: [
              x.batchNo,
            ],
            // expiryDate: null,
          }
        })

        const itemRowsGroupByItemFK = groupByFKFunc(itemRows)

        const newPurchaseOrderItem = purchaseOrderItem.map((o) => {
          const currentItem = itemRowsGroupByItemFK.find(
            (i) => i.itemFK === o.itemFK,
          )
          let quantityReceivedFromOtherDOs = 0
          if (currentItem) {
            quantityReceivedFromOtherDOs =
              o.quantityReceived - currentItem.totalCurrentReceivingQty
          }
          return {
            ...o,
            quantityReceivedFromOtherDOs,
          }
        })

        return {
          ...state,
          purchaseOrderDetails: {
            ...purchaseOrderDetails,
            purchaseOrderItem: newPurchaseOrderItem,
          },
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
        const { gridRows, gridRow, remark } = payload
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
              // [itemFK]: o.inventoryItemFK,
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
        } else if (gridRow) {
          // const itemFK = podoOrderType.filter(
          //   (x) => x.value === payload.type,
          // )[0].itemFKName
          let itemFK
          const item = podoOrderType.filter((x) => x.value === gridRow.type)
          if (item.length > 0) {
            const { itemFKName } = item[0]
            itemFK = itemFKName
          }
          rows.push({
            ...gridRow,
            [itemFK]: gridRow.itemFK,
            name: gridRow.itemFK,
            uom: gridRow.itemFK,
            uid: getUniqueId(),
            isDeleted: false,
          })
        }
        return {
          ...state,
          entity: {
            ...state.entity,
            rows,
            remark,
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

      reset (state, { payload }) {
        return {
          ...state,
          entity: {
            ...state.entity,
            rows: [],
          },
        }
      },
    },
  },
})
