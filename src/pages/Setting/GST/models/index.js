import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'settingGst',
  config: {
    // queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        enableGst: false,
        gstRegNum: 'M91234567X',
        gstRate: 0.0,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},

    //  getActiveSession = async () => {
    //     const criteria = [
    //       {
    //         prop: 'IsClinicSessionClosed',
    //         val: false,
    //         opr: 'eql',
    //       },
    //     ]

    //     // const sort = [
    //     //   { sortby: 'sessionno', order: 'asc' },
    //     // ]

    //     const response = await request('/api/bizsession', {
    //       method: 'GET',
    //       data: stringify({ criteria }),
    //     })
    //     console.log('response', response)

    //     return response
    //   }
    // *getActiveSessiongetSessionInfo (_, { call, put }) {
    //   const response = yield call(service.getActiveSession)
    //   const { status, data } = response
    //   console.log('response', response)

    //   console.log('data', data)
    //   // data = null when get session failed

    //   if (data && data.totalRecords === 1) {
    //     const { data: sessionData } = data

    //     yield put({
    //       type: 'fetchQueueListing',
    //       sessionID: sessionData[0].id,
    //     })

    //     yield put({
    //       type: 'toggleError',
    //       error: { hasError: false, message: '' },
    //     })

    //     return yield put({
    //       type: 'updateSessionInfo',
    //       payload: { ...sessionData[0] },
    //     })
    //   }
    //   if (status >= 400)
    //     return yield put({
    //       type: 'toggleError',
    //       error: {
    //         hasError: true,
    //         message:
    //           'Failed to get session info. Please contact system Administrator',
    //       },
    //     })
    //   return true
    // },
    // },
    reducers: {
      // toggleError (state, { error = {} }) {
      //   return { ...state, error: { ...error } }
      // },
      // updateSessionInfo (state, { payload }) {
      //   return { ...state, sessionInfo: { ...payload } }
      // },
      // updatePatientList (state, { payload }) {
      //   return {
      //     ...state,
      //     patientList: [
      //       ...payload,
      //     ],
      //   }
      // },
      // updateQueueListing (state, { queueListing }) {
      //   return {
      //     ...state,
      //     queueListing,
      //   }
      // },
      // showError (state, { payload }) {
      //   return { ...state, errorMessage: payload }
      // },
      // updateFilter (state, { status }) {
      //   return { ...state, currentFilter: status }
      // },
    },
  },
})
