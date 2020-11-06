import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '@/pages/Inventory/InventoryAdjustment/services'

import { getUniqueId, maxReducer, calculateAmount } from '@/utils/utils'

const sharedMedicationValue = {
  // quantity: 0,
  isMinus: true,
  adjValue: 0,
  isExactAmount: true,
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
      unitPrice: 0,
    },
  ],
  corPrescriptionItemDrugMixture: [],
  isDrugMixture: false,
  isClaimable: true,
}
const initialState = {
  rows: [],
  finalAdjustments: [],
  summary: {},
  defaultMedication: {
    ...sharedMedicationValue,
  },
  defaultService: {
    unitPrice: 0,
    isMinus: true,
    adjValue: 0,
    isExactAmount: true,
  },
  defaultVaccination: {
    vaccinationGivenDate: moment(),
    quantity: 1,
    unitPrice: 0,
    isMinus: true,
    adjValue: 0,
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
  defaultTreatment: {},
  corPackage: [],
  defaultPackage: {
    packageItems: [],
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
      // history.listen(async (loct, method) => {
      //   const { pathname, search, query = {} } = loct
      // })
    },
    effects: {
      *upsertRow ({ payload }, { select, call, put, delay }) {
        const upsert = yield put({
          type: 'upsertRowState',
          payload,
        })
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
          // yield put({
          //   type: 'global/incrementCommitCount',
          // })
        }
      },
      *upsertRows ({ payload }, { select, call, put, delay }) {
        const upsert = yield put({
          type: 'upsertRowsState',
          payload,
        })
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

      *addPackage ({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'addPackageState',
          payload,
        })
      },

      *deletePackageItem ({ payload }, { select, call, put, delay }) {
        yield put({
          type: 'deletePackageItemState',
          payload,
        })
      },
    },

    reducers: {
      reset () {
        // console.log('order reset')
        return { ...initialState }
      },
      upsertRowState (state, { payload }) {
        let newRow
        let { rows, type } = state
        if (payload.type) {
          type = payload.type
        }
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
            type,
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
          entity: { uid: getUniqueId(), orderSetItems: [] },
          // totalAfterAdj: undefined,
        }
      },

      deleteRow (state, { payload }) {
        let { finalAdjustments, rows, isGSTInclusive, gstValue } = state
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

        const amount = calculateAmount(tempRows, finalAdjustments, {
          isGSTInclusive,
          gstValue,
        })
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

      calculateAmount (state, { payload = {} }) {
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

      addPackageState (state, { payload }) {
        let { corPackage } = state
        corPackage.push({
          ...payload,
          uid: getUniqueId(),
        })
        return {
          ...state,
          corPackage,
        }
      },

      deletePackageItemState (state, { payload }) {
        let { corPackage, rows } = state
        
        const activePackageItems = rows.filter(item => item.packageGlobalId === payload.packageGlobalId && item.isDeleted === false)
        const toBeUpdatedPackage = corPackage.find(p => p.packageGlobalId === payload.packageGlobalId)
        if (toBeUpdatedPackage) {
          if (activePackageItems.length === 0) {          
            toBeUpdatedPackage.isDeleted = true
          }
          else {
            toBeUpdatedPackage.totalPrice = _.sumBy(activePackageItems, 'totalAfterItemAdjustment') || 0
          }
        }
        
        return {
          ...state,
          corPackage,
        }
      },
    },
  },
})
