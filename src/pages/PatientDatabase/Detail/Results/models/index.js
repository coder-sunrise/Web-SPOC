import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'patientResults',
  param: {
    service,
    state: {
      default: {},
      list: [],
    },
    subscriptions: {},
    effects: {
      *queryBasicDataList({ payload }, { call, put }) {
        const response = yield call(service.queryBasicDataList, {
          ...payload,
          pagesize: 10,
        })
        return response
      },
    },
    reducers: {},
  },
})
