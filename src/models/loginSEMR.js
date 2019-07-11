import { createFormViewModel } from 'medisys-model'
import router from 'umi/router'
import * as service from '../services/loginSEMR'

const { login } = service

export default createFormViewModel({
  namespace: 'loginSEMR',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      isInvalidLogin: false,
      userInfo: {},
    },
    subscriptions: {},
    effects: {
      *getToken ({ credentialPayload }, { call, put }) {
        const response = yield call(login, credentialPayload)

        return yield put({
          type: 'updateLoginStatus',
          payload: { ...response },
        })

        // if (response.status === 200) {
        //   yield put(router.push('reception/queue'))
        // }
      },
    },
    reducers: {
      updateLoginStatus (state, { payload }) {
        const isInvalidLogin = payload.status !== 200
        if (!isInvalidLogin) {
          const { data, application } = payload
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('application', application)
        }
        return { ...state, isInvalidLogin }
      },
    },
  },
})
