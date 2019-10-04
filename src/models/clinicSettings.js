import { createFormViewModel } from 'medisys-model'
import humps from 'humps'
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
      })
    },

    effects: {},
    reducers: {
      queryDone (state, { payload }) {
        const { data } = payload
        const settings = {}
        let entity = {}
        data.forEach((p) => {
          entity[humps.camelize(p.settingKey)] = {
            ...p,
          }
          switch (p.dataType) {
            case 'Boolean': {
              const value = p.settingValue === 'true'
              settings[humps.camelize(p.settingKey)] = value
              break
            }
            case 'Decimal': {
              settings[humps.camelize(p.settingKey)] = parseFloat(
                p.settingValue,
              )
              settings[humps.camelize(`${p.settingKey}Int`)] = parseInt(
                p.settingValue * 100,
                10,
              )
              break
            }
            default: {
              settings[humps.camelize(p.settingKey)] = p.settingValue
            }
          }

          settings.concurrencyToken = p.concurrencyToken
        })
        return {
          settings,
          entity,
        }
      },
    },
  },
})
