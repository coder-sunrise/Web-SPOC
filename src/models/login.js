import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import { history } from 'umi'
// services
import * as service from '@/services/login'
// utils
import { reloadAuthorized } from '@/utils/Authorized'

const { login, refresh } = service

export default createFormViewModel({
  namespace: 'login',
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
      *getToken({ credentialPayload }, { call, put }) {
        const response = yield call(login, credentialPayload)
        return yield put({
          type: 'updateLoginStatus',
          payload: { ...response },
        })
      },
      *refreshToken(_, { call, put }) {
        const response = yield call(refresh)
        if (response) {
          yield put({
            type: 'updateLoginStatus',
            payload: { ...response },
          })
        }
      },
      *logout(_, { put }) {
        yield put({
          type: 'global/reset',
        })
        localStorage.removeItem('token')
        sessionStorage.clear()
        reloadAuthorized()
        
        // yield put({ type: 'RESET_APP_STATE' })
        if (!localStorage.getItem('aadUserAccount')) {
          history.push('/user/login')
          window.location.reload(true)
        }

        return true
      },
    },
    reducers: {
      updateLoginStatus(state, { payload }) {
        const isInvalidLogin = payload.access_token === undefined
        if (!isInvalidLogin) {
          const {
            access_token: accessToken,
            refresh_token: refreshToken,
          } = payload

          localStorage.setItem('token', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          localStorage.setItem('_lastLogin', moment().toDate())
        }

        return { ...state, isInvalidLogin }
      },
    },
  },
})
