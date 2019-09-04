import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
// import * as service from '../services'
import { getUniqueId } from '@/utils/utils'

export default createFormViewModel({
  namespace: 'consultationDocument',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      editType: '2',
      defaultMedicalCertificate: {
        type: '3',
        mcDays: 1,
        mcStartEndDate: [
          moment(),
          moment().add(1, 'days'),
        ],
        mcIssueDate: moment(),
        unfitTypeFK: 1,
      },
      defaultMemo: {
        type: '2',
        memoDate: moment(),
      },
      defaultCertOfAttendance: {
        type: '4',
        issueDate: moment(),
        attendanceStartTime: moment().format('HH:mm'),
        attendanceEndTime: moment().add(30, 'minutes').format('HH:mm'),
      },
      defaultReferralLetter: {
        type: '1',
        referralDate: moment(),
      },
      defaultVaccinationCertificate: {
        type: '6',
        certificateDate: moment(),
      },
      default: {},
      rows: [],
    },
    // subscriptions: ({ dispatch, history }) => {
    //   history.listen(async (loct, method) => {
    //     const { pathname, search, query = {} } = loct
    //   })
    // },
    effects: {},
    reducers: {
      upsertRow (state, { payload }) {
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
          rows: rows.filter((o) => o.uid !== payload.id),
        }
      },
    },
  },
})
