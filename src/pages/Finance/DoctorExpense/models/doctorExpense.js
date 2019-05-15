import { queryFakeList } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'doctorExpense',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: {},
    effects: {
      *fetchList ({ payload }, { call, put }) {
        const response = yield call(queryFakeList)
        yield put({
          type: 'updateState',
          payload: {
            list: Array.isArray(response) ? response : [],
          },
        })
      },
    },
    reducers: {},
  },
})
