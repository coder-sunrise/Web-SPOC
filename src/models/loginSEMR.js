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
    },
    subscriptions: {},
    effects: {
      *getToken ({ payload }, { call, put }) {
        const response = yield call(login, payload)

        return yield put({
          type: 'updateLoginStatus',
          payload: response,
        })
      },
    },
    reducers: {
      updateLoginStatus (state, { payload }) {
        const isInvalidLogin = payload.status !== 200
        if (!isInvalidLogin) {
          const { data } = payload
          sessionStorage.setItem('token', data.access_token)
        }

        return { ...state, isInvalidLogin }
      },
    },
  },
})
