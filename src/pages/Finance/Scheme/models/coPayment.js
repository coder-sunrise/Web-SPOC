import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'schemeCoPayment',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      list: [],
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
      *submit ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
      },
    },
    reducers: {
      updateCollectPaymentList (state, { payload }) {
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
