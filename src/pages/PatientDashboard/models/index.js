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

        if (pathname.indexOf('/reception/queue/patientdashboard') === 0) {
          dispatch({
            type: 'initState',
            payload: {
              queueID: Number(query.qid) || 0,
              version: Number(query.v) || undefined,
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const { queueID, version } = payload
        console.log(queueID)
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
