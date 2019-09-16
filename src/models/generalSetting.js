import { createFormViewModel } from 'medisys-model'
import * as service from '../services/generalSetting'

export default createFormViewModel({
  namespace: 'generalSetting',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history, searchField }) => {
      history.listen((loct) => {
        const { pathname } = loct
        if (pathname === '/setting') {
          dispatch({
            type: 'getGeneralSetting',
            payload: {
              pagesize: 99999,
            },
          })
        }
      })
    },

    effects: {
      *getGeneralSetting (_, { call, put }) {
        const response = yield call(service.query)

        yield put({
          type: 'save',
          payload: response,
        })
      },
    },
    reducers: {
      save (state, { payload }) {
        const { data } = payload
        const setting = {}
        data.forEach((p) => {
          setting[p.settingKey] = p.settingValue
        })
        return {
          setting,
        }
      },
    },
  },
})
