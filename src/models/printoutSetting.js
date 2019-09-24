import { createFormViewModel } from 'medisys-model'
import * as service from '../services/printoutSetting'

export default createFormViewModel({
  namespace: 'printoutSetting',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history, searchField }) => {
      history.listen((loct) => {
        const { pathname } = loct
        // if (pathname === '/setting') {
        //   dispatch({
        //     type: 'getPrintoutSetting',
        //     payload: {
        //       pagesize: 99999,
        //     },
        //   })
        // }
      })
    },

    effects: {
      *getPrintoutSetting (_, { call, put }) {
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
        const gst = {}
        data.forEach((p) => {
          gst[p.settingKey] = p.settingValue
        })
        return {
          gst,
        }
      },
    },
  },
})
