import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import { routerRedux } from 'dva/router'
import { stringify } from 'qs'
import Cookies from 'universal-cookie'
import * as service from '../services/login'
import { reloadAuthorized } from '@/utils/Authorized'
import { setAuthority } from '@/utils/authority'

const { login } = service

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
        // const { status } = response
        // console.log({ status })
        // reloadAuthorized()

        return yield put({
          type: 'updateLoginStatus',
          payload: { ...response },
        })

        // if (response.status === 200) {
        //   yield put(router.push('reception/queue'))
        // }
      },
      *logout (_, { select, put }) {
        const routing = yield select((st) => st.routing)
        const states = yield select((st) => st)

        yield put({
          type: 'global/updateState',
          payload: {
            showSessionTimeout: false,
          },
        })
        localStorage.removeItem('token')
        reloadAuthorized()

        const redirect =
          routing.location.pathname !== '/login'
            ? routing.location.pathname
            : ''

        if (routing.location.pathname === '/login') {
          yield put(routerRedux.push({ pathname: '/login' }))
        } else {
          yield put(
            routerRedux.push({
              pathname: '/login',
              search: stringify({
                redirect,
              }),
            }),
          )
        }
        yield put({
          type: 'user/reset',
        })
        return true
      },
    },
    reducers: {
      updateLoginStatus (state, { payload }) {
        const isInvalidLogin = payload.access_token === undefined
        if (!isInvalidLogin) {
          const {
            access_token: accessToken,
            currentAuthority = [
              'tester',
              // 'editor',
            ],
          } = payload
          setAuthority(currentAuthority)
          localStorage.setItem('token', accessToken)
          localStorage.setItem('_lastLogin', moment().toDate())
        }

        return { ...state, isInvalidLogin }
      },
    },
  },
})
