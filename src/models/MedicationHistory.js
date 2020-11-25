import { createListViewModel } from 'medisys-model'
import * as service from '@/services/patientHistory'

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
              list: response.data.data,
              totalVisits: response.data.totalRecords,
            },
          })
          return response.data.data
        }
        yield put({
          type: 'updateState',
          payload: {
            list: [],
            totalVisits: 0,
          },
        })
        return false
      },
    },
    reducers: {},
  },
})
