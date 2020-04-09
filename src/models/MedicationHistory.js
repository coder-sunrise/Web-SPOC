import { createListViewModel } from 'medisys-model'
import * as service from '@/services/consultation'

export default createListViewModel({
  namespace: 'medicationHistory',
  config: {},
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *queryMedicationHistory ({ payload }, { call, put }) {
        const response = yield call(service.queryMedicationHistory, payload)
        if (response.status === '200') {
          yield put({
            type: 'updateState',
            payload: {
              list: response.data,
            },
          })
          return response.data
        }
        return false
      },
    },
    reducers: {},
  },
})
