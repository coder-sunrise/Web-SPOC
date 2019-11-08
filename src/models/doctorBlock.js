import { createListViewModel } from 'medisys-model'
// common components
import { notification } from '@/components'
import { getCodes } from '@/utils/codes'
import * as service from '@/services/doctorBlock'

export default createListViewModel({
  namespace: 'doctorBlock',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentViewDoctorBlock: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { pathname } = location
        if (pathname === '/setting/doctorblock') {
          dispatch({
            type: 'queryAll',
          })
        }
      })
    },
    effects: {
      // *upsertDoctorBlock ({ payload }, { call, put }) {
      //   const result = yield call(service.upsert, payload)
      //   if (result) {
      //     yield put({ type: 'refresh' })
      //     notification.success({ message: 'Doctor Block(s) updated' })
      //     return true
      //   }
      //   return false
      // },
      *queryAll ({ payload }, { call, put }) {
        const response = yield call(service.getAllList, payload)
        const { status, data } = response
        if (parseInt(status, 10) === 200) {
          yield put({
            type: 'updateState',
            payload: {
              list: data.data,
            },
          })
        }
      },
      *refresh (_, { call, put }) {
        yield put({
          type: 'queryAll',
        })
      },
      *update ({ payload }, { call }) {
        const result = yield call(service.save, payload)
        if (result) {
          notification.success({ message: 'Doctor Block(s) updated' })
          return true
        }
        return false
      },
    },
    reducers: {
      queryOneDone (state, { payload }) {
        return { ...state, currentViewDoctorBlock: payload.data }
      },
    },
  },
})
