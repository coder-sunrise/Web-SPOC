import { createBasicModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import service from '../components/_medisys/AppNotificationList/services'
import { sendNotification } from '@/utils/realtime'
import { NOTIFICATION_STATUS, APPNOTIFICATION_SCHEMA } from '@/utils/constants'

export default createBasicModel({
  namespace: 'appNotification',
  param: {
    service,
    state: {
      notifications: [],
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *create({ payload }, { call, put, select }) {
        var response = yield call(service.upsert, payload)
        console.log('create response', response)
        var receivers = response.data || []
        if (receivers.length > 0) {
          var notification = {
            list: receivers.map(x => ({
              ...x,
              type: Object.values(APPNOTIFICATION_SCHEMA).find(
                y => y.name == x.source,
              ).id,
              status: NOTIFICATION_STATUS.OK,
              read: false,
            })),
          }
          console.log('create response after map', notification)
          sendNotification('AppNotification', notification)
        }
        return response
      },
      *readAllNotification({ payload }, { call, put, select }) {
        //payload is list for receivers mandatory fields
      },
      *queryNotifications({ payload }, { call, put, select }) {
        var user = yield select(st => st.user)
        var response = yield call(service.query, {
          currentUserFK: user.data.id,
          includeSelf: true,
        })
        yield put({
          type: 'updateState',
          payload: { notifications: response.data || [] },
        })
        return response
      },
      *loadNotifications({ payload }, { call, put, select }) {
        var user = yield select(st => st.user)
        var response = yield call(service.query, {
          currentUserFK: user.data.id,
          includeSelf: false,
          filterOutRead: true,
        })
        var notifications = (response.data || []).map(x => ({
          ...x,
          type: Object.values(APPNOTIFICATION_SCHEMA).find(
            y => y.name === x.source,
          ).id,
          read: x.isRead,
        }))
        yield put({
          type: 'header/updateState',
          payload: {
            notifications,
          },
        })
        return response
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
          notifications: data.data,
        }
      },
    },
  },
})
