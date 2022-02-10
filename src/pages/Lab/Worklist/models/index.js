import { notification } from '@/components'
import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'labWorklist',
  config: { queryOnLoad: false },
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {
      *receiveSpecimen({ payload }, { call, put }) {
        const status = yield call(service.receiveSpecimen, payload)

        if (status === 200) {
          notification.success({ message: 'Lab specimen received.' })
          return true
        }
        return status
      },
      *discardSpecimen({ payload }, { call, put }) {
        const status = yield call(service.discardSpecimen, payload)

        if (status === 200 || status === 204) {
          notification.success({ message: 'Lab specimen discarded.' })
          return true
        }
        return status
      },
    },
    reducers: {},
  },
})
