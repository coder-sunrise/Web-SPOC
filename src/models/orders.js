import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import service from '@/pages/Inventory/InventoryAdjustment/services'

import { getUniqueId, maxReducer, calculateAmount } from '@/utils/utils'

const initialState = {
  rows: [],
  finalAdjustments: [],
  summary: {},
  defaultService: {
    editServiceId: undefined,
    isEdit: false,
    serviceItems: [],
    selectCategory: 'All',
    selectTag: 'All',
    filterService: '',
    isMinus: true,
    isExactAmount: true,
  },
  defaultConsumable: {
    quantity: 1,
    unitPrice: 0,
    isMinus: true,
    adjValue: 0,
    isExactAmount: true,
  },
  defaultOrderSet: {
    orderSetItems: [],
  },
}
export default createListViewModel({
  namespace: 'orders',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: { ...initialState },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {})
    },
    effects: {
      *upsertRow({ payload }, { select, call, put, delay }) {
        const upsert = yield put({
          type: 'upsertRowState',
          payload,
        })
        const orders = yield select(st => st.orders)
        const consultationDocument = yield select(st => st.consultationDocument)
        const { rows } = consultationDocument

        yield put({
          type: 'calculateAmount',
        })

        if (upsert) {
          yield put({
            type: 'updateState',
            payload: {
              entity: undefined,
            },
          })
        }
      },
      *upsertRows({ payload }, { select, call, put, delay }) {
        const orders = yield select(st => st.orders)
        const { rows } = orders
        const neworders = [
          ...rows,
          ...payload.map(v => {
            const uid = getUniqueId()
            return {
              ...v,
              uid,
            }
          }),
        ]

        yield put({
          type: 'updateState',
          payload: {
            rows: neworders,
          },
        })

        yield put({
          type: 'calculateAmount',
        })

        yield put({
          type: 'updateState',
          payload: {
            entity: undefined,
          },
        })
      },
      *addFinalAdjustment({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'addFinalAdjustmentState',
          payload,
        })

        yield put({
          type: 'calculateAmount',
        })
      },

      *editFinalAdjustment({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'editFinalAdjustmentState',
          payload,
        })

        yield put({
          type: 'calculateAmount',
        })
      },

      *deleteFinalAdjustment({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'deleteFinalAdjustmentState',
          payload,
        })

        yield put({
          type: 'calculateAmount',
        })
      },

      *getStockDetails({ payload }, { call, put }) {
        const result = yield call(service.queryStockDetails, payload)
        return result
      },

      *deleteRow({ payload }, { put, select }) {
        const orders = yield select(st => st.orders)
        const consultationDocument = yield select(st => st.consultationDocument)
        let { finalAdjustments, rows, isGSTInclusive, gstValue } = orders
        const { rows: documentRows } = consultationDocument
        let tempRows = [...rows]
        if (payload) {
          const deleteRow = rows.find(o => o.uid === payload.uid)
          if (deleteRow) {
            // delete order
            if (deleteRow.id > 0) {
              tempRows = rows.map(o => {
                if (!payload || o.uid === payload.uid) {
                  o.isDeleted = true
                }
                return o
              })
            } else {
              tempRows = rows.filter(o => o.uid !== payload.uid)
            }
          }
        } else {
          tempRows = tempRows.map(o => ({
            ...o,
            isDeleted: true,
          }))
          finalAdjustments = finalAdjustments.map(o => ({
            ...o,
            isDeleted: true,
          }))
        }

        const amount = calculateAmount(tempRows, finalAdjustments, {
          isGSTInclusive,
          gstValue,
        })

        yield put({
          type: 'updateState',
          payload: {
            ...amount,
            rows: tempRows,
            finalAdjustments,
          },
        })
      },

      *updatePriority({ payload }, { put, select }) {
        const orders = yield select(st => st.orders)
        const { rows = [] } = orders
        const { uid, priority } = payload
        let tempRows = [...rows]
        tempRows = tempRows.map(o => ({
          ...o,
          priority: o.uid === uid ? priority : o.priority,
        }))
        yield put({
          type: 'updateState',
          payload: {
            rows: tempRows,
          },
        })
      },
    },

    reducers: {
      reset() {
        return { ...initialState }
      },
      upsertRowState(state, { payload }) {
        let newRow
        let { rows, type } = state
        if (payload.type) {
          type = payload.type
        }
        if (payload.uid) {
          rows = rows.map(row => {
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
          const uid = getUniqueId()
          newRow = {
            ...payload,
            type,
            uid,
          }
          rows.push(newRow)
        }
        return {
          ...state,
          rows,
          entity: newRow || rows.find(r => r.uid === payload.uid),
        }
      },

      // used by each order component
      adjustAmount(state, { payload }) {
        return {
          ...state,
          entity: {
            ...state.entity,
            ...payload,
            totalAfterItemAdjustment: payload.finalAmount,
          },
        }
      },

      calculateAmount(state, { payload = {} }) {
        let { finalAdjustments, rows, isGSTInclusive, gstValue } = state
        const amount = calculateAmount(rows, finalAdjustments, {
          isGSTInclusive,
          gstValue,
        })
        return {
          ...state,
          ...amount,
        }
      },

      // used by calc total amount
      addFinalAdjustmentState(state, { payload }) {
        let { finalAdjustments, rows } = state
        if (payload.uid) {
          finalAdjustments = finalAdjustments.map(row => {
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
          finalAdjustments.push({
            ...payload,
            uid: getUniqueId(),
            sequence:
              finalAdjustments.map(o => o.sequence).reduce(maxReducer, 0) + 1,
          })
        }
        return {
          ...state,
          finalAdjustments,
        }
      },

      // used by calc total amount
      editFinalAdjustmentState(state, { payload }) {
        let { finalAdjustments, rows } = state
        if (payload.uid) {
          finalAdjustments = finalAdjustments.map(row => {
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
          finalAdjustments.push({
            ...payload,
            uid: getUniqueId(),
            sequence:
              finalAdjustments.map(o => o.sequence).reduce(maxReducer, 0) + 1,
          })
        }
        return {
          ...state,
          finalAdjustments,
        }
      },

      deleteFinalAdjustmentState(state, { payload }) {
        const { finalAdjustments } = state

        return {
          ...state,
          finalAdjustments: finalAdjustments.map(o => {
            if (o.uid === payload.uid) o.isDeleted = true
            return o
          }),
        }
      },
    },
  },
})
