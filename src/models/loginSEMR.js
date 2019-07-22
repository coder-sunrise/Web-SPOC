import { createFormViewModel } from 'medisys-model'
import router from 'umi/router'
import moment from 'moment'
import Cookies from 'universal-cookie'
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
        // const { status } = response
        // console.log({ status })
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

          const cookies = new Cookies()
          cookies.set('_lastLogin', new Date(), {
            expires: new Date(9999, 11, 31),
          })
        }
        return { ...state, isInvalidLogin }
      },
    },
  },
})
