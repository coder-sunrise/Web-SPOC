import { createFormViewModel } from 'medisys-model'
import _ from 'lodash'
import * as service from '../services/queueDisplaySetup'
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
      pendingQCall: [],
      isSync: false,
    },
    subscriptions: ({ dispatch, history, searchField, ...restValues }) => {
      subscribeNotification('QueueCalled', {
        callback: (response) => {
          const { qNo, roomNo } = response
          const newCalledQueue = { qNo, roomNo }
          return dispatch({
            type: 'refreshQueueCallList',
            payload: {
              callingQueue: newCalledQueue,
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
            return data[0]
          }
        }
        return false
      },
      *getStatus ({ payload }, { call, put }) {
        const r = yield call(service.getStatus, payload)
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

        if (r.length > 0) {
          return r[0]
          // yield put({
          //   type: 'setExistingQueueCallList',
          //   payload: {
          //     data: r[0],
          //   },
          // })
        }
        return r
      },
      *syncUp ({ payload }, { call, put }) {
        const r = yield call(service.query, payload)
        const { status, data } = r

        if (status === '200') {
          if (data.length > 0) {
            yield put({
              type: 'getLatestQCall',
              payload: {
                data: data[0],
                isSync: payload.isSync,
              },
            })
            return data[0]
          }
        }
        return false
      },
    },
    reducers: {
      setExistingQueueCallList (st, { payload }) {
        const { value, ...restValues } = payload.data
        const existingQCall = JSON.parse(value)
        const uniqueQCall = _.uniqBy(existingQCall, 'qNo')
        return {
          ...st,
          qCallList: uniqueQCall,
          oriQCallList: existingQCall,
          ...restValues,
        }
      },
      refreshQueueCallList (st, { payload }) {
        const { callingQueue } = payload
        const { pendingQCall, isSync } = st

        if (isSync) {
          let pendingCalls = []

          pendingCalls = [
            ...pendingQCall,
            callingQueue,
          ]

          return {
            ...st,
            pendingQCall: pendingCalls,
            tracker: callingQueue,
          }
        }

        return {
          ...st,
          tracker: callingQueue,
        }
      },
      displayCallQueue (st, { payload }) {
        const { qCallList, pendingQCall } = st
        const currentCalledQueue = qCallList.find(
          (q) => q.qNo === pendingQCall[0].qNo,
        )

        let qArray = []
        if (currentCalledQueue) {
          const otherQCalls = qCallList.filter(
            (q) => q.qNo !== currentCalledQueue.qNo,
          )
          qArray = [
            currentCalledQueue,
            ...otherQCalls,
          ]
        } else {
          qArray = [
            pendingQCall[0],
            ...qCallList,
          ]
        }

        const remainingPendingQCall = pendingQCall.filter((q, idx) => idx !== 0)
        return {
          ...st,
          qCallList: qArray,
          currentQCall: {
            qNo: pendingQCall[0].qNo,
            roomNo: pendingQCall[0].roomNo,
          },
          pendingQCall: remainingPendingQCall,
        }
      },
      clearCurrentQCall (st, { payload }) {
        return {
          ...st,
          currentQCall: null,
        }
      },
      getLatestQCall (st, { payload }) {
        const { oriQCallList, pendingQCall } = st
        const { data, isSync } = payload
        const { value, ...restValues } = data
        const existingQCall = JSON.parse(value)

        const totalNewQCalled = existingQCall.length - oriQCallList.length
        const newExistingQCall = [
          ...existingQCall,
        ].splice(0, totalNewQCalled)

        const newPendingQCall = [
          ...pendingQCall,
          ..._.reverse(newExistingQCall),
        ]

        return {
          ...st,
          pendingQCall: newPendingQCall,
          oriQCallList: existingQCall,
          isSync,
          ...restValues,
        }
      },
      updateisSyncStatus (st, { payload }) {
        const { isSync } = payload
        return {
          ...st,
          isSync,
        }
      },
    },
  },
})
