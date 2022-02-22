import { notification } from '@/components'
import { createFormViewModel } from 'medisys-model'
import service from '../../../services'
import { getUserPreference, saveUserPreference } from '@/services/user'

export default createFormViewModel({
  namespace: 'medicalCheckupReportingDetails',
  config: { queryOnLoad: false },
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async loct => {
        const { query = {}, pathname } = loct
        if (
          pathname === '/medicalcheckup/worklist/reportingdetails' &&
          Number(query.mcid)
        ) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              visitID: Number(query.vid),
              pid: Number(query.pid),
              mcid: Number(query.mcid),
              qid: Number(query.qid),
            },
          })
        }
      })
    },
    effects: {
      *initState({ payload }, { all, put, select, take }) {
        const { version, visitID, pid, mcid, qid } = payload
        const patientState = yield select(st => st.patient)

        yield put({
          type: 'updateState',
          payload: {
            visitID,
            patientID: pid,
            medicalCheckupWorkitemId: mcid,
          },
        })

        if (pid && (!patientState.entity || patientState.entity.id !== pid)) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
            },
          })
          yield take('patient/query/@@end')
        }

        if (qid)
          yield put({
            type: 'visitRegistration/query',
            payload: { id: payload.qid, version: payload.v },
          })

        yield put({
          type: 'query',
          payload: {
            id: mcid,
            version,
          },
        })
        yield take('query/@@end')
      },
      *queryIndividualCommentHistory({ payload }, { call, put }) {
        const response = yield call(
          service.queryIndividualCommentHistory,
          payload,
        )
        return response
      },
      *querySummaryCommentHistory({ payload }, { call, put }) {
        const response = yield call(service.querySummaryCommentHistory, payload)
        return response
      },
    },
    reducers: {},
  },
})
