import { createListViewModel } from 'medisys-model'
import service from '@/services/prescriptionSet'
import { getUniqueId } from '@/utils/utils'

export default createListViewModel({
  namespace: 'prescriptionSet',
  config: {},
  param: {
    service,
    state: {
      default: {
        prescriptionSetItem: []
      },
      defaultPrescriptionSetItem: {
        prescriptionSetItemPrecaution: [
          {
            precaution: '',
            sequence: 0,
            uid: getUniqueId()
          },
        ],
        prescriptionSetItemInstruction: [
          {
            sequence: 0,
            stepdose: 'AND',
            unitPrice: 0,
            uid: getUniqueId()
          },
        ],
        prescriptionSetItemDrugMixture: [],
        isDrugMixture: false,
      }
    },
    subscriptions: ({ dispatch, history }) => { },
    effects: {
      *delete ({ payload }, { call, put, select, take }) {
        return yield call(service.delete, payload)
      },

      *upsertRow ({ payload }, { select, call, put, delay }) {
        const upsert = yield put({
          type: 'upsertRowState',
          payload,
        })
        if (upsert) {
          yield put({
            type: 'updateState',
            payload: {
              editPrescriptionSetItem: undefined,
            },
          })
        }
      },

      *deleteRow ({ payload }, { put, select }) {
        const prescriptionSet = yield select(st => st.prescriptionSet)
        const rows = prescriptionSet.prescriptionSetItems || []
        let tempRows = [...rows]
        if (payload) {
          const deleteRow = rows.find(o => o.uid === payload.uid)
          if (deleteRow) {
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
        }

        yield put({
          type: 'updateState',
          payload: {
            prescriptionSetItems: tempRows,
          },
        })
      },
    },
    reducers: {
      upsertRowState (state, { payload }) {
        let newRow
        let { prescriptionSetItems = [] } = state

        if (payload.uid) {
          prescriptionSetItems = prescriptionSetItems.map(row => {
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
            uid,
          }
          prescriptionSetItems.push(newRow)
        }
        return {
          ...state,
          prescriptionSetItems,
          editPrescriptionSetItem: newRow || prescriptionSetItems.find(r => r.uid === payload.uid),
        }
      },
    },
  },
})
