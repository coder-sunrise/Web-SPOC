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
        // const { pathname, search, query = {} } = loct
        // if (
        //   pathname.indexOf('/reception/queue/patientdashboard') === 0 ||
        //   query.md === 'pt'
        // ) {
        //   dispatch({
        //     type: 'initState',
        //     payload: {
        //       queueID: Number(query.qid) || 0,
        //       version: Number(query.v) || undefined,
        //       visitID: query.visit,
        //       patientID: Number(query.pid) || 0,
        //     },
        //   })
        // }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        let { queueID, version, patientID } = payload

        if (!patientID) {
          yield put({
            type: 'visitRegistration/query',
            payload: { id: queueID, version },
          })
          yield take('visitRegistration/query/@@end')
          const visitRegistration = yield select((st) => st.visitRegistration)
          const { visit } = visitRegistration.entity
          if (!visit) return
          patientID = visit.patientProfileFK
          yield
        }

        // yield put({
        //   type: 'patient/query',
        //   payload: { id: patientID, version },
        // })
        // yield take('patient/query/@@end')

        yield put({
          type: 'query',
          payload: {
            patientProfileFK: patientID,
            sorting: [
              {
                columnName: 'VisitDate',
                direction: 'desc',
              },
            ],
            version,
          },
        })

        // yield put({
        //   type: 'patientHistory/queryOne',
        //   payload: o.id,
        // })
        // console.log("****")
        // console.log(test)

        yield put({
          type: 'updateState',
          payload: {
            queueID,
          },
        })
      },
      *queryDone ({ payload }, { call, put, select, take }) {
        console.log(payload)

        if (payload.data.data.length > 0) {
          yield put({
            type: 'queryOne',
            payload: payload.data.data[0].id,
          })
        }
      },
    },
    reducers: {
      querySingleDone (st, { payload }) {
        const { data } = payload
        console.log("++++")
        console.log(payload)
        console.log(st.list)
        let sortedPatientHistory = st.list
          ? st.list.filter((o) => o.coHistory.length >= 1)
          : ''
        return {
          ...st,
          selected: sortedPatientHistory.length > 0 ? sortedPatientHistory[0]  : '',
          selectedSubRow: sortedPatientHistory.length > 0 ? sortedPatientHistory[0].coHistory[0]  : '',
        }
      },
    },
  },
})
