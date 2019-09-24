import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'patientHistory',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        if (pathname.indexOf('/reception/queue/patientdashboard') === 0) {
          dispatch({
            type: 'initState',
            payload: {
              queueID: Number(query.qid) || 0,
              version: Number(query.v) || undefined,
              visitID: query.visit,
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const { queueID, version } = payload

        yield put({
          type: 'visitRegistration/query',
          payload: { id: queueID, version },
        })
        yield take('visitRegistration/query/@@end')
        const visitRegistration = yield select((st) => st.visitRegistration)
        const { visit } = visitRegistration.entity
        if (!visit) return

        yield put({
          type: 'patient/query',
          payload: { id: visit.patientProfileFK, version },
        })
        yield take('patient/query/@@end')

        yield put({
          type: 'query',
          payload: {
            patientProfileFK: visit.patientProfileFK,
            sorting: [
              {
                columnName: 'VisitDate',
                direction: 'desc',
              },
            ],
            version,
          },
        })
        yield put({
          type: 'updateState',
          payload: {
            queueID,
          },
        })
      },
    },
    reducers: {},
  },
})
