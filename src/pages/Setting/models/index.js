import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'systemSetting',
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
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
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
