import { createFormViewModel } from 'medisys-model'
import * as service from '../services/queueDisplaySetup'
import { notification } from '@/components'
import { KEYS } from '@/utils/constants'
import { subscribeNotification } from '@/utils/realtime'

export default createFormViewModel({
  namespace: 'queueCalling',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      qCallList: [],
      calling: false,
      pendingQCall: [],
    },
    subscriptions: ({ dispatch, history, searchField }) => {
      subscribeNotification('QueueCalled', {
        callback: (response) => {
          const { qNo, roomNo } = response
          const newCalledQueue = { qNo, roomNo }
          dispatch({
            type: 'refreshQueueCallList',
            payload: {
              callingQueue: newCalledQueue,
              calling: true,
            },
          })
        },
      })
    },

    effects: {
      *getExistingQueueCallList ({ payload }, { call, put }) {
        const r = yield call(service.query, payload)
        const { status, data } = r
        if (status === '200') {
          if (data.length > 0) {
            yield put({
              type: 'setExistingQueueCallList',
              payload: {
                data: data[0],
              },
            })
          }
        }
        return false
      },
      *getStatus ({ payload }, { call, put }) {
        const r = yield call(service.getStatus, payload)
        console.log({ r })
        const { status, data } = r
        if (status === '200') {
          if (data.length > 0) {
            return data[0]
          }
        }
        return false
      },
      *upsertQueueCallList ({ payload }, { call, put }) {
        const r = yield call(service.upsert, payload)

        if (r) {
          notification.success({ message: 'Called' })
          return true
        }
        return r
      },
    },
    reducers: {
      setExistingQueueCallList (st, { payload }) {
        const { value, ...restValues } = payload.data
        const existingQCall = JSON.parse(value)
        return {
          ...st,
          qCallList: existingQCall,
          ...restValues,
        }
      },
      refreshQueueCallList (st, { payload }) {
        const { callingQueue, calling } = payload
        const { qCallList, pendingQCall } = st
        const { qNo, roomNo } = callingQueue

        let pendingCalls = []

        pendingCalls = [
          ...pendingQCall,
          callingQueue,
        ]

        return {
          ...st,
          calling: true,
          pendingQCall: pendingCalls,
        }
      },
    },
  },
})
