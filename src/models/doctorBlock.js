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
      *queryAll ({ payload }, { all, call, put }) {
        let mergeResult = []
        const response = yield call(service.getList, payload)

        const { status, data } = response
        if (parseInt(status, 10) === 200) {
          const { data: list, totalRecords, pageSize, currentPage } = data
          mergeResult = [
            ...list,
          ]
          const totalPage = Math.ceil(totalRecords / 10)
          const serviceCalls = []
          for (let i = 2; i <= totalPage; i++) {
            const servicePayload = {
              ...payload,
              current: i,
            }
            serviceCalls.push(call(service.getList, servicePayload))
          }
          const allResult = yield all(serviceCalls)

          if (allResult) {
            const _flatten = allResult.reduce(
              (_all, result) => [
                ..._all,
                ...result.data.data,
              ],
              [],
            )
            mergeResult = [
              ...list,
              ..._flatten,
            ]
          }

          yield put({
            type: 'updateState',
            payload: {
              list: mergeResult,
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
