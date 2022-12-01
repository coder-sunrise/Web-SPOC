import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import { getUniqueId } from '@/utils/utils'

let commitCount = 1300
export default createFormViewModel({
  namespace: 'consultationDocument',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      type: '5',
      defaultMedicalCertificate: () => {
        return {
          type: '5',
          mcDays: 1,
          mcReferenceNo: '-',
          mcStartEndDate: [moment().formatUTC(), moment()],
          mcIssueDate: moment(),
          unfitTypeFK: 1,
        }
      },
      defaultMemo: () => {
        return {
          type: '2',
          memoDate: moment(),
        }
      },
      defaultSpectacleOrderForm: () => {
        return {
          type: '2',
        }
      },
      defaultCertOfAttendance: () => {
        return {
          type: '6',
          issueDate: moment(),
          referenceNo: '-',
          attendanceEndTime: moment()
            .add(30, 'minutes')
            .format('HH:mm'),
        }
      },
      defaultReferralLetter: () => {
        return {
          type: '1',
          referralDate: moment(),
        }
      },
      defaultOthers: () => {
        return {
          type: '4',
          issueDate: moment(),
        }
      },
      default: {},
      rows: [],
    },
    effects: {
      *upsertRow({ payload }, { call, put }) {
        yield put({
          type: 'upsertRowState',
          payload,
        })
      },

      *deleteRow({ payload }, { select, put }) {
        const orders = yield select(st => st.orders)
        const consultationDocument = yield select(st => st.consultationDocument)
        const { rows } = consultationDocument
        const { rows: orderRows } = orders

        let newRows = rows

        const deleteRow = rows.find(o => o.uid === payload.id)
        if (deleteRow) {
          if (deleteRow.id) {
            newRows = rows.map(o => {
              if (!payload || o.uid === payload.id) o.isDeleted = true
              return o
            })
          } else {
            newRows = rows.filter(o => o.uid !== payload.id)
          }

          yield put({
            type: 'updateState',
            payload: { rows: newRows },
          })
        }
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
    },
  },
})
