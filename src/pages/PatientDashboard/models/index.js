import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'patientDashboard',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentComponent: '1',
      default: {
        patientAccountNo: '',
        // dob: new Date(),
        contact: {
          contactAddress: [
            {
              countryFK: '00000000-0000-0000-0000-000000000203',
            },
          ],
          contactEmailAddress: {
            emailAddress: '',
          },
          mobileContactNumber: {
            number: '',
          },
          homeContactNumber: {
            number: '',
          },
          officeContactNumber: {
            number: '',
          },
          faxContactNumber: {
            number: '',
          },
          contactWebsite: {
            website: '',
          },
        },
        patientEmergencyContact: [],
      },
    },
    subscriptions: ({ dispatch, history, ...restProps }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/reception/queue/patientdashboard') === 0) {
          dispatch({
            type: 'initState',
            payload: {
              queueID: Number(query.qid) || 0,
              showConsultation: Number(query.md === 'cons'),
              version: query.v,
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const { queueID, showConsultation, version } = payload
        let {
          patientDashboard,
          visitRegistration,
          consultation,
        } = yield select((st) => st)
        if (
          patientDashboard.queueID !== queueID ||
          version !== patientDashboard.version
        ) {
          yield put({
            type: 'visitRegistration/fetchVisitInfo',
            payload: { id: queueID },
          })
          yield take('visitRegistration/fetchVisitInfo/@@end')

          visitRegistration = yield select((st) => st.visitRegistration)

          const { patientInfo } = visitRegistration
          yield put({
            type: 'patientHistory/updateState',
            payload: {
              patientID: patientInfo.id,
            },
          })
          yield put({
            type: 'updateState',
            payload: {
              queueID,
              version,
            },
          })
        }
        console.log(visitRegistration)
        if (visitRegistration) {
          yield put({
            type: 'consultation/updateState',
            payload: {
              consultationID:
                visitRegistration.visitInfo.visit.clinicalObjectRecordFK,
              visitID: visitRegistration.visitInfo.visit.id,
              queueID,
              entity: undefined,
            },
          })
          console.log(
            showConsultation,
            !visitRegistration.visitInfo.visit.clinicalObjectRecordFK,
          )
          if (
            showConsultation &&
            !visitRegistration.visitInfo.visit.clinicalObjectRecordFK
          ) {
            yield put({
              type: 'consultation/newConsultation',
              payload: visitRegistration.visitInfo.visit.id,
            })
            yield take('consultation/newConsultation/@@end')
          }
          console.log(
            visitRegistration.visitInfo.visit.clinicalObjectRecordFK,
            !consultation.entity,
          )

          if (
            showConsultation &&
            visitRegistration.visitInfo.visit.clinicalObjectRecordFK &&
            !consultation.entity
          ) {
            yield put({
              type: 'consultation/query',
              payload: visitRegistration.visitInfo.visit.clinicalObjectRecordFK,
            })
            yield take('consultation/query/@@end')
          }
        }
      },
      // *queryOne ({ payload }, { call, put }) {
      //   const response = yield call(service.query, payload)
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       entity: response.data,
      //     },
      //   })
      //   return response.data
      // },
      // *submit ({ payload }, { call }) {
      //   // console.log(payload)
      //   return yield call(service.upsert, payload)
      // },
    },
    reducers: {},
  },
})
