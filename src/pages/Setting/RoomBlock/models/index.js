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
            type: 'queryAll',
          })
        }
      })
    },
    effects: {
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
          if (totalPage > 1) {
            const serviceCalls = []

            for (let i = currentPage + 1; i <= totalPage; i++) {
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
          payload: {
            // pagesize: 99999,
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
