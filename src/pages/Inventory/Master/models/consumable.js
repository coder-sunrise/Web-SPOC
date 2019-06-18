import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../Consumable/services'

export default createListViewModel({
  namespace: 'consumable',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentTab: 0,
      entity: {
        Code: 'abc',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname === '/inventory/master/consumable') {
          dispatch({
            type: 'updateState',
            payload: {
              currentTab: Number(query.t) || 0,
            },
          })
        }
      })
    },
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
      *submitDetail ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
      },
      *submitPrice ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
      },
      *submitStock ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
      },
    },
    reducers: {
      updateCollectPaymentList (state, { payload }) {
        return {
          ...state,
          collectPaymentList: [ ...payload ],
        }
      },
    },
  },
})
