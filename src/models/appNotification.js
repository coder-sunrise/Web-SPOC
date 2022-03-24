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
      pageSize: 5,
      morePageSize: 5,
      totalRecords: 1,
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
        const { pageSize, morePageSize, totalRecords } = appNotificationSate
        const { loadMore } = payload
        var user = yield select(st => st.user)
        var response = yield call(service.queryList, {
          toUserFK: user.data.id,
          pageSize: loadMore ? pageSize + Math.min(totalRecords - pageSize, morePageSize) : pageSize,

          current: 1,
          sorting: [
            {
              columnName: 'isRead',
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
            pageSize: response.data.pageSize,
            currentPage: response.data.currentPage,
            totalRecords: response.data.totalRecords,
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
    },
  },
})
