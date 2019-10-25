import { createListViewModel } from 'medisys-model'
import { notification } from '@/components'
import * as service from '../services'

export default createListViewModel({
  namespace: 'roomBlock',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentViewRoomBlock: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { pathname } = location
        if (pathname === '/setting/roomblock') {
          dispatch({
            type: 'query',
            payload: {
              pagesize: 99999,
            },
          })
        }
      })
    },
    effects: {
      *refresh (_, { call, put }) {
        yield put({
          type: 'query',
          payload: {
            pagesize: 99999,
          },
        })
      },
      *update ({ payload }, { call }) {
        const result = yield call(service.save, payload)
        if (result) {
          notification.success({ message: 'Room Block(s) updated' })
          return true
        }
        return false
      },
    },
    reducers: {
      queryOneDone (state, { payload }) {
        return { ...state, currentViewRoomBlock: payload.data }
      },
    },
  },
})
