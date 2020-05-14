import { createFormViewModel } from 'medisys-model'
import { getUniqueId } from '@/utils/utils'

export default createFormViewModel({
  namespace: 'forms',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      defaultLCForm: {
        type: '1',
        typeName: 'Letter of Certification',
        statusFK: 1,
        formData: {
          caseType: '2',
          procuderes: [],
          otherDiagnosis: [],
          surgicalCharges: [],
          nonSurgicalCharges: [],
          others: '',
        },
      },
      default: {},
      rows: [],
    },
    effects: {
      *upsertRow ({ payload }, { call, put }) {
        yield put({
          type: 'upsertRowState',
          payload,
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
        }
      },

      deleteRow (state, { payload }) {
        const { rows } = state

        return {
          ...state,
          rows: rows.map((o) => {
            if (!payload || o.uid === payload.id) o.isDeleted = true
            return o
          }),
        }
      },

      voidRow (state, { payload }) {
        const { rows } = state
        return {
          ...state,
          rows: rows.map((o) => {
            if (payload && o.uid === payload.id) {
              o.voidReason = payload.voidReason
              o.statusFK = payload.statusFK
            }
            return o
          }),
        }
      },
    },
  },
})
