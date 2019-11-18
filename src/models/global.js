import { createFormViewModel } from 'medisys-model'
import { queryNotices } from '@/services/api'
import { notification } from '@/components'

import config from '@/utils/config'
// console.log(
//   localStorage.getItem('menuCollapsed') !== undefined,
//   Boolean(localStorage.getItem('menuCollapsed')),
//   localStorage.getItem('menuCollapsed'),
// )

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
      disableSave: false,
      showSessionTimeout: false,
    },
    setting: {
      skipDefaultListen: true,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct

        // console.log(loct, method)
        // if (query.md === 'pt') {
        //   // dispatch({
        //   //   type: 'updateState',
        //   //   payload: {
        //   //     fullscreen: true,
        //   //     showPatientInfoPanel: true,
        //   //   },
        //   // })
        // } else if (query.md2 === 'cons') {
        //   // dispatch({
        //   //   type: 'updateState',
        //   //   payload: {
        //   //     fullscreen: true,
        //   //     showConsultationPanel: true,
        //   //   },
        //   // })
        // } else if (query.md2 === 'disp') {
        //   // dispatch({
        //   //   type: 'updateState',
        //   //   payload: {
        //   //     fullscreen: true,
        //   //     showDispensePanel: true,
        //   //   },
        //   // })
        // } else {
        //   // dispatch({
        //   //   type: 'updateState',
        //   //   payload: {
        //   //     showPatientInfoPanel: false,
        //   //     showConsultationPanel: false,
        //   //   },
        //   // })
        // }
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
        // console.log(payload, 'menuCollapsed')
        localStorage.setItem('menuCollapsed', payload ? 1 : 0)

        yield put({
          type: 'updateState',
          payload: {
            collapsed: payload,
          },
        })
      },
      *getUserSettings ({ payload }, { put, select }) {
        // localStorage.setItem('menuCollapsed', payload ? 1 : 0)
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
