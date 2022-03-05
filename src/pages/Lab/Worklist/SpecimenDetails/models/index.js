import { createFormViewModel } from 'medisys-model'
import { notification } from '@/components'
import service from '../../services'

export default createFormViewModel({
  namespace: 'worklistSpecimenDetails',
  config: {},
  param: {
    service,
    state: { entity: { specimenOrders: [] } },
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {
      *queryDone({ payload }, { call, select, put, take }) {
        const { entity: specimenDetails } = yield select(
          st => st.worklistSpecimenDetails,
        )
      },
      *startLabTest({ payload }, { call, put }) {
        const status = yield call(service.startLabTest, payload)

        if (status === 200 || status === 204) {
          notification.success({
            message: 'Manual tests started. Orders sent to analyzer.',
          })
          return true
        }
        return status
      },
      *saveLabTest({ payload }, { call, put }) {
        const status = yield call(service.saveLabTest, payload)
        if (status === 200 || status === 204) {
          notification.success({
            message: 'Lab tests saved.',
          })
          return true
        }
        return status
      },
      *verifyLabTest({ payload }, { call, put }) {
        const status = yield call(service.verifyLabTest, payload)
        if (status === 200 || status === 204) {
          notification.success({
            message: 'Lab tests verified.',
          })
          return true
        }
        return status
      },
    },
    reducers: {},
  },
})
