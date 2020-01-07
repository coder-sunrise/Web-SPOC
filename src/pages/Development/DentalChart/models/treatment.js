import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services'
import { getUniqueId } from '@/utils/utils'
import { buttonConfigs } from '../variables'

export default createListViewModel({
  namespace: 'dentalChartTreatment',
  config: {},
  param: {
    service,
    state: {
      rows: [],
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *upsertRow ({ payload }, { select, call, put, delay }) {
        const upsert = yield put({
          type: 'upsertRowState',
          payload,
        })
      },
    },
    reducers: {
      upsertRowState (state, { payload }) {
        let newRow
        let { rows, type } = state
        if (payload.id) {
          rows = rows.map((row) => {
            const n =
              row.id === payload.id
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
            id: getUniqueId(),
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

      deleteRow (state, { payload }) {
        let { finalAdjustments, rows } = state
        let tempRows = [
          ...rows,
        ]
        if (payload) {
          tempRows.map((a, index) => {
            if (a.id === payload.id) {
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

        // const amount = calculateAmount(tempRows, finalAdjustments)
        // console.log(tempRows, finalAdjustments, amount)
        return {
          ...state,
          // ...amount,
          rows: tempRows,
          finalAdjustments,
        }
      },
    },
  },
})
