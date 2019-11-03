import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '@/pages/Inventory/InventoryAdjustment/services'

import { getUniqueId, maxReducer, calculateAmount } from '@/utils/utils'

const sharedMedicationValue = {
  quantity: 0,
  corPrescriptionItemPrecaution: [
    {
      precaution: '',
      sequence: 0,
    },
  ],
  corPrescriptionItemInstruction: [
    {
      // usageMethodFK: 1,
      // dosageFK: 1,
      // prescribeUOMFK: 1,
      // drugFrequencyFK: 1,
      // dispenseUOMFK: 1,
      // duration: 1,
      sequence: 0,
      stepdose: 'AND',
    },
  ],
}
export default createListViewModel({
  namespace: 'orders',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      // type: '1',
      rows: [],
      finalAdjustments: [],
      summary: {},
      defaultMedication: {
        ...sharedMedicationValue,
      },
      defaultService: {},
      defaultVaccination: {
        vaccinationGivenDate: moment(),
        quantity: 1,
      },
      defaultConsumable: { quantity: 1 },
      defaultPackage: {
        packageItems: [],
      },
      // default: {
      //   corPrescriptionItemPrecaution: [
      //     {
      //       action: '1',
      //       count: 1,
      //       unit: '1',
      //       frequency: '1',
      //       day: 1,
      //       // precaution: '1',
      //       operator: '1',
      //     },
      //   ],
      //   descriptions: [
      //     {
      //       action: '1',
      //       count: 1,
      //       unit: '1',
      //       frequency: '1',
      //       day: 1,
      //       precaution: '1',
      //       operator: '1',
      //     },
      //   ],
      //   quantity: 1,
      //   total: 20,
      //   totalAfterAdj: 18,
      // },
    },
    subscriptions: ({ dispatch, history }) => {
      // history.listen(async (loct, method) => {
      //   const { pathname, search, query = {} } = loct
      // })
    },
    effects: {
      *upsertRow ({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'upsertRowState',
          payload,
        })
        yield put({
          type: 'calculateAmount',
        })
      },
      *upsertRows ({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'upsertRowsState',
          payload,
        })
        yield put({
          type: 'calculateAmount',
        })
      },
      *addFinalAdjustment ({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'addFinalAdjustmentState',
          payload,
        })

        yield put({
          type: 'calculateAmount',
        })
      },

      *deleteFinalAdjustment ({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'deleteFinalAdjustmentState',
          payload,
        })

        yield put({
          type: 'calculateAmount',
        })
      },

      *getStockDetails ({ payload }, { call, put }) {
        const result = yield call(service.queryStockDetails, payload)
        return result
        // yield put({ type: 'saveStockDetails', payload: result })
      },
    },

    reducers: {
      upsertRowState (state, { payload }) {
        let newRow
        let { rows } = state
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
          newRow = {
            ...payload,
            uid: getUniqueId(),
          }
          rows.push(newRow)
        }
        return {
          ...state,
          rows,
          entity: newRow,
          // totalAfterAdj: undefined,
        }
      },

      upsertRowsState (state, { payload }) {
        let { rows } = state
        for (let index = 0; index < payload.length; index++) {
          rows.push({
            ...payload[index],
            uid: getUniqueId(),
          })
        }
        return {
          ...state,
          rows,
          type: state.type === '6' ? undefined : state.type,
          entity: undefined,
          // totalAfterAdj: undefined,
        }
      },

      deleteRow (state, { payload }) {
        let { finalAdjustments, rows } = state
        let tempRows = [
          ...rows,
        ]
        if (payload) {
          tempRows.map((a, index) => {
            if (a.uid === payload.uid) {
              a.isDeleted = true
            }
            return a
          })
        } else {
          tempRows = tempRows.map((o) => ({
            ...o,
            isDeleted: true,
          }))
          finalAdjustments = finalAdjustments.map((o) => ({
            ...o,
            isDeleted: true,
          }))
        }

        const amount = calculateAmount(tempRows, finalAdjustments)
        // console.log(tempRows, finalAdjustments, amount)
        return {
          ...state,
          ...amount,
          rows: tempRows,
          finalAdjustments,
        }
      },

      // used by each order component
      adjustAmount (state, { payload }) {
        // console.log(payload)
        return {
          ...state,
          entity: {
            ...state.entity,
            ...payload,
            totalAfterItemAdjustment: payload.finalAmount,
          },
        }
      },

      calculateAmount (state, { payload }) {
        let { finalAdjustments, rows } = state
        const amount = calculateAmount(rows, finalAdjustments)
        // console.log(amount)
        return {
          ...state,
          ...amount,
        }
      },

      // used by calc total amount
      addFinalAdjustmentState (state, { payload }) {
        let { finalAdjustments, rows } = state
        if (payload.uid) {
          finalAdjustments = finalAdjustments.map((row) => {
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
              finalAdjustments.map((o) => o.sequence).reduce(maxReducer, 0) + 1,
          })
        }
        return {
          ...state,
          finalAdjustments,
        }
      },

      deleteFinalAdjustmentState (state, { payload }) {
        const { finalAdjustments } = state

        return {
          ...state,
          finalAdjustments: finalAdjustments.map((o) => {
            if (o.uid === payload.uid) o.isDeleted = true
            return o
          }),
        }
      },
    },
  },
})
