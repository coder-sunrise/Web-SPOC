import { queryFakeList } from '@/services/api'


import * as service from '../services'
import { createListViewModel } from 'medisys-model'

export default createListViewModel({
  namespace: 'invoiceDetail',
  config:{
    queryOnLoad:true,
  },
  param: {
    service,
    state: {
    },
    subscriptions: {},
    effects: {
      *fetchList (_, { call, put }) {
        const response = yield call(queryFakeList)
        yield put({
          type: 'updateState',
          payload: {
            list:Array.isArray(response) ? response : [],
          },
        })
      },
    },
    reducers: {
    },
  },
})

