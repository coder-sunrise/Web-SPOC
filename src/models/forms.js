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
          caseType: 'DaySurgery',
          procuderes: [],
          surgicalCharges: [],
          nonSurgicalCharges: [],
          others: null,
          signatureThumbnail: null,
          principalDiagnosisFK: null,
          principalDiagnosisCode: null,
          principalDiagnosisName: null,
          secondDiagnosisAFK: null,
          secondDiagnosisACode: null,
          secondDiagnosisAName: null,
          secondDiagnosisBFK: null,
          secondDiagnosisBCode: null,
          secondDiagnosisBName: null,
          otherDiagnosis: [],
        },
      },
      defaultConsentForm: {
        type: '2',
        typeName: 'Consent Form',
        statusFK: 1,
        formName: 'Consent Form',
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
