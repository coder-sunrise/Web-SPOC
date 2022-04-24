import { createBasicModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import service from '../components/_medisys/AppNotificationList/services'
import { sendNotification } from '@/utils/realtime'
import { NOTIFICATION_STATUS, APPNOTIFICATION_SCHEMA } from '@/utils/constants'

const DefaultPageSize = 10

export default createBasicModel({
  namespace: 'appNotification',
  param: {
    service,
    state: {
      notifications: [],
      pageSize: DefaultPageSize,
      morePageSize: 10,
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *create({ payload }, { call, put, select }) {
        var response = yield call(service.upsert, payload)
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
          sendNotification('AppNotification', notification)
        }
        return response
      },
      *readAllNotification({ payload }, { call, put, select }) {
        const appNotificationSate = yield select(st => st.appNotification)
        const { rows } = appNotificationSate
        return yield call(service.readNotifications, rows)
      },
      *queryNotifications({ payload = {} }, { call, put, select }) {
        var user = yield select(st => st.user)
        var response = yield call(service.queryOfCurrentUser, payload)
        yield put({
          type: 'updateState',
          payload: { notifications: response.data || [] },
        })
        return response
      },
      *loadNotifications({ payload = {} }, { call, put, select }) {
        const appNotificationSate = yield select(st => st.appNotification)
        const { pageSize, morePageSize } = appNotificationSate
        const { source, loadMore, isRead } = payload
        const currentPageSize = loadMore ? pageSize + morePageSize : pageSize
        var user = yield select(st => st.user)
        var response = yield call(service.queryList, {
          toUserFK: user.data.id,
          isRead: isRead, 
          'applicationNotificationFKNavigation.source': source,
          pagesize: currentPageSize > 0 ? currentPageSize : DefaultPageSize,
          current: 1,
          sorting: [
            {
              columnName: 'isRead',
              direction: 'asc',
            },
            {
              columnName: '(isAcknowledged == null ? !isAcknowledgeRequired : isAcknowledged)',
              direction: 'asc',
            },
            {
              columnName: 'applicationNotificationFKNavigation.generateDate',
              direction: 'desc',
            },
          ],
        })
        if (response.status != 200) return null
        var notifications = (response.data.data || []).map(x => ({
          ...x,
          type: Object.values(APPNOTIFICATION_SCHEMA).find(
            y => y.name === x.source,
          ).id,
          read: x.isRead,
        }))
        yield put({
          type: 'updateState',
          payload: {
            pageSize: Math.min(response.data.pageSize,response.data.totalRecords),
            rows: notifications.map(x => x.id),
          },
        })
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
      receiveMessage(st, { payload }) {
        const notifications = [payload, ...st.notifications]
        console.log(notifications)
        return {
          ...st,
          notifications,
          rows: notifications.map(x => x.id),
          pageSize: notifications.length
        }
      },
    },
  },
})
