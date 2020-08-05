import { createFormViewModel } from 'medisys-model'
import _ from 'lodash'
import { subscribeNotification } from '@/utils/realtime'
import { VALUE_KEYS } from '@/utils/constants'
import * as service from '../services/queueDisplaySetup'

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

      subscribeNotification('QueueClear', {
        callback: () => {
          return dispatch({
            type: 'getExistingQueueCallList',
            payload: {
              keys: VALUE_KEYS.QUEUECALLING,
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
      *claearAll ({ payload }, { call, put }) {
        const { key } = payload
        const r = yield call(service.query, { keys: key })
        const { status, data } = r

        if (status === '200') {
          if (data.length > 0) {
            const response = yield call(service.upsert, {
              ...data[0],
              key,
              value: '[]',
            })
            if (response) {
              yield put({ type: 'claearAllDone' })
              return true
            }
          }
        }
        return false
      },
    },
    reducers: {
      setExistingQueueCallList (st, { payload }) {
        const { value, ...restValues } = payload.data
        const existingQCall = JSON.parse(value)
        // filter same queueNo and roomNo
        const uniqueQCall = _.uniqBy(existingQCall, 'qNo')
        let uniqueRoomCall = []
        uniqueQCall.forEach((element) => {
          if (
            element.roomNo === '' ||
            !uniqueRoomCall.find((o) => o.roomNo === element.roomNo)
          ) {
            uniqueRoomCall.push({ ...element })
          }
        })

        return {
          ...st,
          qCallList: uniqueRoomCall,
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

        let qArray = []
        // filter same queueNo and roomNo
        let otherQCalls = qCallList.filter((q) => q.qNo !== pendingQCall[0].qNo)

        otherQCalls = otherQCalls.filter(
          (q) => q.roomNo === '' || q.roomNo !== pendingQCall[0].roomNo,
        )

        qArray = [
          pendingQCall[0],
          ...otherQCalls,
        ]

        const remainingPendingQCall = pendingQCall.filter((q, idx) => idx !== 0)
        console.log('pendingQCall11', pendingQCall)
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
      claearAllDone (st, { payload }) {
        return {}
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
