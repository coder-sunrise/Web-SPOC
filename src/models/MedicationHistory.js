import { createListViewModel } from 'medisys-model'
import service from '@/services/patientHistory'

export default createListViewModel({
  namespace: 'medicationHistory',
  config: {},
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *queryMedicationHistory({ payload }, { call, put }) {
        const response = yield call(service.queryMedicationHistory, payload)
        if (response.status === '200') {
          return {
            list: response.data.data,
            totalVisits: response.data.totalRecords,
          }
        }
        return false
      },
    },
    reducers: {},
  },
})
