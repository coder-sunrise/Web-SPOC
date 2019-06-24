import { createFormViewModel } from 'medisys-model'
import * as service from '@/services/patient'

export default createFormViewModel({
  namespace: 'patient',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentComponent: 'dmgp',
      default: {
        patientAccountNo: '',
        patientEmergencyContact: [],
        patientAllergy: [],
        patientMedicalAlert: [],
        // dob: new Date(),
        contact: {
          contactAddress: [
            {
              // Id: getUniqueGUID(),
              countryFk: '00000000-0000-0000-0000-000000000203',
              line1: '',
              line2: '',
            },
          ],
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
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        // console.log(pathname)
        // console.log(loct, method)
        // console.log(query)
        if (query.md === 'pt' && query.cmt) {
          dispatch({
            type: 'updateState',
            payload: {
              currentComponent: query.cmt,
              currentId: query.pid,
            },
          })
          // if (query.pid) {
          //   dispatch({
          //     type: 'query',
          //     payload: {
          //       id: query.pid,
          //     },
          //   })
          // }
        }
        if (query.new || pathname === '/patientdb/new') {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: undefined,
              entity: null,
            },
          })
        }
      })
    },
    effects: {
      *fetchList ({ payload }, { call, put }) {
        const response = yield call(service.queryList)
        console.log(response)
        yield put({
          type: 'updateState',
          payload: {
            list: Array.isArray(response) ? response : [],
          },
        })
      },
      // *querySingle ({ payload }, { call, put }) {
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
