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
      *logout (_, { put }) {
        console.log('logout')
        // yield put({
        //   type: 'changeLoginStatus',
        //   payload: {
        //     status: false,
        //     currentAuthority: 'guest',
        //   },
        // })
        yield put({
          type: 'global/updateState',
          payload: {
            showSessionTimeout: false,
          },
        })
        localStorage.removeItem('token')
        reloadAuthorized()
        yield put(
          routerRedux.push({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        )
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
          // const cookies = new Cookies()
          // console.log('set last login cookie')
          // cookies.set('_lastLogin', moment().toDate(), {
          //   expires: new Date(9999, 11, 31),
          // })
        }
        // reloadAuthorized()
        return { ...state, isInvalidLogin }
      },
    },
  },
})
