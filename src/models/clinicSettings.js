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
          const key = humps.camelize(p.settingKey)
          const value = p.settingValue
          switch (p.dataType) {
            case 'Boolean': {
              const booleanValue = value === 'true'
              settings[key] = booleanValue
              break
            }
            case 'Decimal': {
              const decimalValue = parseFloat(value)
              const decimalIntValue = parseInt(value * 100, 10)
              settings[key] = decimalValue
              settings[`${key}Int`] = decimalIntValue
              break
            }
            default: {
              settings[key] = value
            }
          }

          settings.concurrencyToken = p.concurrencyToken
        })

        const clinicSettingsSessionData = JSON.stringify(settings)
        sessionStorage.setItem('clinicSettings', clinicSettingsSessionData)
        return {
          settings,
          entity,
        }
      },
    },
  },
})
