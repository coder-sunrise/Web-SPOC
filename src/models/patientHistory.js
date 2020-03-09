import { createListViewModel } from 'medisys-model'
import * as service from '../services/patientHistory'
import { VISIT_TYPE } from '@/utils/constants'

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
        let { queueID, version, patientID, mode } = payload

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
            'neql_VisitStatusFKNavigation.Status': 'WAITING',
          },
        })
        yield take('query/@@end')

        if (mode === 'split') {
          const st = yield select((s) => s.patientHistory)

          const { list = [] } = st
          const filteredList = list.filter(
            (o) =>
              o.coHistory.length >= 1 || o.visitPurposeFK === VISIT_TYPE.RETAIL,
          )

          if (filteredList.length > 0) {
            if (
              filteredList[0].visitPurposeFK === VISIT_TYPE.RETAIL
              // && filteredList[0].coHistory.length > 0
            ) {
              yield put({
                type: 'updateState',
                payload: {
                  defaultItem: filteredList[0],
                },
              })
              yield put({
                type: 'queryRetailHistory',
                payload: {
                  id: filteredList[0].invoiceFK,
                },
              })
            } else {
              yield put({
                type: 'queryOne',
                payload: filteredList[0].coHistory[0].id,
              })
            }
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            queueID,
            patientID,
          },
        })
      },

      *queryRetailHistory ({ payload }, { call, put }) {
        const response = yield call(service.queryRetailHistory, payload)

        if (response.status === '200') {
          yield put({
            type: 'getRetailHistory',
            payload: response,
          })
          return response
        }
        return false
      },
    },
    reducers: {
      queryOneDone (st, { payload }) {
        // const { data } = payload

        let sortedPatientHistory = st.list
          ? st.list.filter((o) => o.coHistory.length >= 1)
          : []

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
      getRetailHistory (st, { payload }) {
        const { data } = payload
        const { defaultItem } = st
        return {
          ...st,
          entity: data,
          selected: defaultItem,
          selectedSubRow: defaultItem,
        }
      },
    },
  },
})
