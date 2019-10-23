import { createListViewModel } from 'medisys-model'
import moment from 'moment'
// import * as service from '../services'
import {
  getUniqueId,
  maxReducer,
  sumReducer,
  calculateAmount,
} from '@/utils/utils'

const sharedMedicationValue = {
  quantity: 1,
  corPrescriptionItemPrecaution: [
    {},
  ],
  corPrescriptionItemInstruction: [
    {
      usageMethodFK: 1,
      dosageFK: 1,
      prescribeUOMFK: 1,
      drugFrequencyFK: 1,
      dispenseUOMFK: 1,
      duration: 1,
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
    },

    reducers: {
      upsertRowState (state, { payload }) {
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
          rows.push({
            ...payload,
            uid: getUniqueId(),
          })
        }

        return {
          ...state,
          rows,
          type: undefined,
          entity: undefined,
          // totalAfterAdj: undefined,
        }
      },

      deleteRow (state, { payload }) {
        const { finalAdjustments, rows } = state
        const tempRows = [
          ...rows,
        ]
        console.log(payload)
        if (payload)
          tempRows.map((a, index) => {
            if (a.uid === payload.uid) {
              tempRows.splice(index, 1)
            }
            return a
          })

        const amount = calculateAmount(tempRows, finalAdjustments)

        return {
          ...state,
          ...amount,
          rows: rows.map((o) => {
            if (!payload || o.uid === payload.uid) o.isDeleted = true
            return o
          }),
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
