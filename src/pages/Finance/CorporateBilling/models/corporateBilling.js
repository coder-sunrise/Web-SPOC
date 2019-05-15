import { queryFakeList } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'corporateBilling',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      collectPaymentList: [],
    },
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
    reducers: {
      updateCollectPaymentList (state, { payload }) {
        console.log('reducers', payload)
        return {
          ...state,
          collectPaymentList: [
            ...payload,
          ],
        }
      },
    },
  },
})
