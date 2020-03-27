import { createFormViewModel } from 'medisys-model'
import * as service from '../services/queueDisplaySetup'
import { notification } from '@/components'
import { KEYS } from '@/utils/constants'

export default createFormViewModel({
  namespace: 'queueDisplaySetup',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      // ...JSON.parse(localStorage.getItem('queueDisplaySetup') || '{}'),
      default: {
        value: {
          images: [],
          showDateTime: false,
        },
      },
    },
    subscriptions: ({ dispatch, history, searchField }) => {},

    effects: {
      *upsertQueueDisplaySetup ({ payload }, { call, put }) {
        const r = yield call(service.upsert, payload)

        if (r) {
          notification.success({ message: 'Saved' })
          return true
        }
        return r
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        const queueDisplaySetup =
          data.find((o) => o.key === KEYS.QUEUEDISPLAYSETUP) || {}

        if (queueDisplaySetup) {
          const { value = '{}' } = queueDisplaySetup
          const parsedValue = JSON.parse(value)
          return {
            entity: {
              ...queueDisplaySetup,
              value: parsedValue,
            },
          }
        }

        return {
          ...st,
        }
      },
    },
  },
})
