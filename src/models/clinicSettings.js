import { createFormViewModel } from 'medisys-model'
import * as service from '../services/clinicSettings'

export default createFormViewModel({
  namespace: 'clinicSettings',
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
            type: 'clinicSettings',
            payload: {
              pagesize: 99999,
            },
          })
        }
      })
    },

    effects: {
      *getClinicSettings (_, { call, put }) {
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
        const settings = {}
        data.forEach((p) => {
          switch (p.dataType) {
            case 'Boolean': {
              const value = p.settingValue === 'Boolean'
              settings[p.settingKey] = value
              break
            }
            case 'Decimal': {
              settings[p.settingKey] = parseFloat(p.settingValue)
              settings[`${p.settingKey}Int`] = parseInt(
                p.settingValue * 100,
                10,
              )
              break
            }
            default: {
              settings[p.settingKey] = p.settingValue
            }
          }

          settings.concurrencyToken = p.concurrencyToken
        })
        return {
          settings,
        }
      },
    },
  },
})
