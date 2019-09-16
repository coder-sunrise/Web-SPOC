import { createFormViewModel } from 'medisys-model'
import router from 'umi/router'
import * as service from '../services'
import { sleep, getRemovedUrl } from '@/utils/utils'

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
        // console.log(pathname)

        if (pathname.indexOf('/reception/queue/patientdashboard') === 0) {
          dispatch({
            type: 'initState',
            payload: {
              queueID: Number(query.qid) || 0,
              showConsultation: Number(query.md2 === 'cons'),
              version: query.v,
              action: query.action,
              visitID: query.visit,
              status: query.status,
              consultationID: Number(query.cid),
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const {
          queueID,
          showConsultation,
          version,
          action,
          visitID,
          status,
        } = payload
        let {
          patientDashboard,
          visitRegistration,
          consultation,
        } = yield select((st) => st)

        if (
          [
            'resume',
            'edit',
          ].includes(action) &&
          visitID
        ) {
          if (
            (status === 'PAUSED' && action === 'resume') ||
            action !== 'resume'
          ) {
            yield put({
              type: `consultation/${action}`,
              payload: visitID,
            })
            yield take(`consultation/${action}/@@end`)
          }
          setTimeout(() => {
            router.push(
              getRemovedUrl([
                'action',
                'visit',
                'status',
              ]),
            )
          }, 1)
          return
        }
        // console.log(
        //   queueID,
        //   patientDashboard.queueID,
        //   version,
        //   patientDashboard.version,
        // )
        if (
          queueID &&
          (patientDashboard.queueID !== queueID ||
            version !== patientDashboard.version)
        ) {
          yield put({
            type: 'visitRegistration/fetchVisitInfo',
            payload: { id: queueID },
          })
          yield take('visitRegistration/fetchVisitInfo/@@end')

          visitRegistration = yield select((st) => st.visitRegistration)

          const { patientInfo, visitInfo } = visitRegistration
          yield put({
            type: 'patientHistory/updateState',
            payload: {
              patientID: patientInfo.id,
              queueID,
              visitInfo,
              version,
            },
          })
          yield put({
            type: 'patient/updateState',
            payload: {
              entity: patientInfo,
              version,
            },
          })
          yield put({
            type: 'updateState',
            payload: {
              queueID,
              version,
              visitInfo,
              patientInfo,
            },
          })
        }
        let { consultationID } = payload
        console.log(visitRegistration)
        if (
          visitRegistration &&
          visitRegistration.visitInfo &&
          visitRegistration.visitInfo.visit
        ) {
          consultationID =
            visitRegistration.visitInfo.visit.clinicalObjectRecordFK
          yield put({
            type: 'consultation/updateState',
            payload: {
              consultationID,
              visitID: visitRegistration.visitInfo.visit.id,
              queueID,
              entity: undefined,
            },
          })
          // console.log(
          //   showConsultation,
          //   !visitRegistration.visitInfo.visit.clinicalObjectRecordFK,
          // )
          if (showConsultation && !consultationID) {
            yield put({
              type: 'consultation/newConsultation',
              payload: visitRegistration.visitInfo.visit.id,
            })
            yield take('consultation/newConsultation/@@end')
          }
          // console.log(
          //   visitRegistration.visitInfo.visit.clinicalObjectRecordFK,
          //   !consultation.entity,
          // )

          if (
            showConsultation &&
            consultationID &&
            (!consultation.entity || version !== patientDashboard.version)
          ) {
            // console.log(
            //   showConsultation,
            //   consultationID,
            //   consultation.entity,
            //   version,
            //   patientDashboard.version,
            // )
            yield put({
              type: 'consultation/query',
              payload: consultationID,
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
