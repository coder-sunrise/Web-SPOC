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
      defaultForm: {
        type: '2',
        typeName: 'From',
        statusFK: 1,
        formName: 'From',
        formData: { content: null, signature: [] },
      },
      default: {},
      rows: [],
    },
    effects: {
      *upsertRow({ payload }, { put }) {
        yield put({
          type: 'upsertRowState',
          payload,
        })
      },
    },
    reducers: {
      upsertRowState(state, { payload }) {
        let { rows } = state
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

      deleteRow(state, { payload }) {
        const { rows } = state

        return {
          ...state,
          rows: rows.map(o => {
            if (!payload || o.uid === payload.id) o.isDeleted = true
            return o
          }),
        }
      },

      voidRow(state, { payload }) {
        const { rows } = state
        return {
          ...state,
          rows: rows.map(o => {
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
