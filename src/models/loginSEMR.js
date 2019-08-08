import { createFormViewModel } from 'medisys-model'
import router from 'umi/router'
import moment from 'moment'
import Cookies from 'universal-cookie'
import * as service from '../services/loginSEMR'
import { reloadAuthorized } from '@/utils/Authorized'
import { setAuthority } from '@/utils/authority'

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
        reloadAuthorized()

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
          const cookies = new Cookies()
          cookies.set('_lastLogin', new Date(), {
            expires: new Date(9999, 11, 31),
          })
        }
        // reloadAuthorized()
        return { ...state, isInvalidLogin }
      },
    },
  },
})
