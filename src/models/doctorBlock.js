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
            type: 'query',
            payload: {
              pagesize: 99999,
            },
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
      querySingleDone (state, { payload }) {
        return { ...state, currentViewDoctorBlock: payload.data }
      },
    },
  },
})
