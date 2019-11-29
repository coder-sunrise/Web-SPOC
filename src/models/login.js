import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import { routerRedux } from 'dva/router'
import { stringify } from 'qs'
import Cookies from 'universal-cookie'
import * as service from '../services/login'
import { reloadAuthorized } from '@/utils/Authorized'
import { setAuthority } from '@/utils/authority'

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
      *getToken ({ credentialPayload }, { call, put }) {
        const response = yield call(login, credentialPayload)
        return yield put({
          type: 'updateLoginStatus',
          payload: { ...response },
        })
      },
      *refreshToken (_, { call, put }) {
        const response = yield call(refresh)
        if (response) {
          yield put({
            type: 'updateLoginStatus',
            payload: { ...response },
          })
        }
      },
      *logout (_, { select, put }) {
        const routing = yield select((st) => st.routing)

        yield put({
          type: 'global/reset',
        })
        localStorage.removeItem('token')
        sessionStorage.clear()
        reloadAuthorized()

        yield put(routerRedux.push({ pathname: '/user/login' }))

        // const redirect =
        //   routing.location.pathname !== '/login'
        //     ? routing.location.pathname + routing.location.search
        //     : ''

        // if (routing.location.pathname === '/login') {
        //   yield put(routerRedux.push({ pathname: '/login' }))
        // } else {
        //   yield put(
        //     routerRedux.push({
        //       pathname: '/login',
        //       search: stringify({
        //         redirect,
        //       }),
        //     }),
        //   )
        // }
        // yield put({
        //   type: 'user/reset',
        // })
        yield put({ type: 'RESET_APP_STATE' })

        // do not remove this line
        console.log('logout log')
        return true
      },
    },
    reducers: {
      updateLoginStatus (state, { payload }) {
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
