import { queryNotices } from '@/services/api'
import { createFormViewModel } from 'medisys-model'
import { notification } from '@/components'

import config from '@/utils/config'
// console.log(
//   localStorage.getItem('menuCollapsed') !== undefined,
//   Boolean(localStorage.getItem('menuCollapsed')),
//   localStorage.getItem('menuCollapsed'),
// )
let connection = null
const connectionObserver = {}
export default createFormViewModel({
  namespace: 'global',
  config: {
    queryOnLoad: false,
  },
  param: {
    // service,
    state: {
      collapsed:
        localStorage.getItem('menuCollapsed') !== undefined
          ? localStorage.getItem('menuCollapsed') === '1'
          : true,
      notices: [],
      currencySymbol: '$',
    },
    setting: {
      skipDefaultListen: true,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct

        // console.log(loct, method)
        if (query.md === 'pt') {
          dispatch({
            type: 'updateState',
            payload: {
              fullscreen: true,
              showPatientInfoPanel: true,
            },
          })
        } else if (query.md === 'cons') {
          dispatch({
            type: 'updateState',
            payload: {
              fullscreen: true,
              showConsultationPanel: true,
            },
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              showPatientInfoPanel: false,
              showConsultationPanel: false,
            },
          })
        }
        // if (typeof window.ga !== 'undefined') {
        //   window.ga('send', 'pageview', pathname + search)
        // }
      })
    },
    effects: {
      *fetchNotices (_, { call, put, select }) {
        const data = yield call(queryNotices)
        yield put({
          type: 'saveNotices',
          payload: data,
        })
        const unreadCount = yield select(
          (state) => state.global.notices.filter((item) => !item.read).length,
        )
        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            totalCount: data.length,
            unreadCount,
          },
        })
      },
      *clearNotices ({ payload }, { put, select }) {
        yield put({
          type: 'saveClearedNotices',
          payload,
        })
        const count = yield select((state) => state.global.notices.length)
        const unreadCount = yield select(
          (state) => state.global.notices.filter((item) => !item.read).length,
        )
        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            totalCount: count,
            unreadCount,
          },
        })
      },
      *changeNoticeReadState ({ payload }, { put, select }) {
        const notices = yield select((state) =>
          state.global.notices.map((item) => {
            const notice = { ...item }
            if (notice.id === payload) {
              notice.read = true
            }
            return notice
          }),
        )
        yield put({
          type: 'saveNotices',
          payload: notices,
        })
        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            totalCount: notices.length,
            unreadCount: notices.filter((item) => !item.read).length,
          },
        })
      },
      *changeLayoutCollapsed ({ payload }, { put, select }) {
        localStorage.setItem('menuCollapsed', payload ? 1 : 0)

        yield put({
          type: 'updateState',
          payload: {
            collapsed: payload,
          },
        })
      },
      *getUserSettings ({ payload }, { put, select }) {
        localStorage.setItem('menuCollapsed', payload ? 1 : 0)
        const mockUserConfig = {
          currencySymbol: '$',
        }
        if (config.currencySymbol !== mockUserConfig.currencySymbol) {
          localStorage.setItem('userSettings', JSON.stringify(mockUserConfig))
        }
        yield put({
          type: 'updateState',
          payload: {
            ...mockUserConfig,
          },
        })
      },

      initStream ({ payload }) {
        const signalREndPoint =
          'https://ec2-175-41-131-73.ap-southeast-1.compute.amazonaws.com/notificationHub'

        connection = new signalR.HubConnectionBuilder()
          .withUrl(signalREndPoint, {
            accessTokenFactory: () => localStorage.getItem('token'),
          })
          .build()
        // console.log(connection)
        connection.on('NewNotification', (type, response) => {
          const { sender, message } = response
          console.log(type, response)
          notification.info({
            // icon: WarningIcon,
            icon: null,
            placement: 'bottomRight',
            message: `${sender} ${message}`,
            // description:
            //   'test test testtest d sd sd d test test test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d test',
          })
          if (connectionObserver[type]) {
            connectionObserver[type]()
          }
          // var message = data.sender + ' says ' + data.message
          // var li = document.createElement('li')
          // li.textContent = message
          // document.getElementById('messagesList').appendChild(li)
          // console.log('***************')
          // console.log('NotificationReceived: ' + eventName + ' from ' + data.sender)
          // console.log('Message:' + data.message)
          // console.log('***************')
          // var notification = new Notification('New Messsage Received', {
          //   body: data.sender + ': ' + data.message,
          //   icon:
          //     'https://5.imimg.com/data5/XQ/KP/MY-40305254/kids-toy-500x500.jpg',
          // })
        })

        connection
          .start()
          .then(() => {
            console.log('Connected started')
          })
          .catch((err) => {
            return console.error(err.toString())
          }) // JSON-string from `response.json()` call
          .catch((error) => console.error(error))

        // setInterval(() => {
        //   connection
        //     .invoke('SendNotification', 'NewMessage', {
        //       message: 'reception update',
        //       sender: 'Mr Test',
        //     })
        //     .catch((err) => {
        //       return console.error(err.toString())
        //     })
        // }, 5000)
      },

      sendNotification ({ payload }, { put, select }) {
        const { type, data } = payload
        console.log(payload)
        connection.invoke('SendNotification', type, data).catch((err) => {
          return console.error(err)
        })
      },

      subscribeNotification ({ payload }, { put, select }) {
        const { type, callback } = payload
        connectionObserver[type] = callback
      },
    },
    reducers: {
      saveNotices (state, { payload }) {
        return {
          ...state,
          notices: payload,
        }
      },
      saveClearedNotices (state, { payload }) {
        return {
          ...state,
          notices: state.notices.filter((item) => item.type !== payload),
        }
      },
    },
  },
})
