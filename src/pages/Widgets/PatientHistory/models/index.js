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
      pageMode: '',
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        dispatch({
          type: 'updateState',
          payload: {
            pageMode:
              pathname.indexOf('/reception/queue/patientdashboard') === 0
                ? 'split'
                : 'integrated',
          },
        })
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
            patientID,
          },
        })
      },
      *queryDone ({ payload }, { call, put, select, take }) {
        const pageMode = yield select((state) => state.patientHistory.pageMode)
        let sortedList = payload.data.data
          ? payload.data.data.filter((o) => o.coHistory.length >= 1)
          : ''
        // console.log('queryDone', this.mode)
        if (pageMode === 'split' && sortedList.length > 0) {
          yield put({
            type: 'queryOne',
            payload: sortedList[0].coHistory[0].id,
          })
        }
      },
    },
    reducers: {
      queryOneDone (st, { payload }) {
        // const { data } = payload

        let sortedPatientHistory = st.list
          ? st.list.filter((o) => o.coHistory.length >= 1)
          : ''

        return {
          ...st,
          selected:
            sortedPatientHistory.length > 0 ? sortedPatientHistory[0] : '',
          selectedSubRow:
            sortedPatientHistory.length > 0
              ? sortedPatientHistory[0].coHistory[0]
              : '',
        }
      },
    },
  },
})
