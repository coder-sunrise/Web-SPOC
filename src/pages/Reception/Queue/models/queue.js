import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'
import { StatusIndicator } from '../variables'

const MessageWrapper = ({ children }) => (
  <div>
    <h3>An error occured</h3>
    <h4>{children}</h4>
  </div>
)

const InitialSessionInfo = {
  isClinicSessionClosed: true,
  id: '',
  // sessionNo: `${moment().format('YYMMDD')}-01`,
  sessionNo: 'N/A',
  sessionNoPrefix: '',
  sessionStartDate: '',
  sessionCloseDate: '',
}

export default createListViewModel({
  namespace: 'queueLog',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      sessionInfo: { ...InitialSessionInfo },
      patientList: [],
      currentFilter: StatusIndicator.ALL,
      error: {
        hasError: false,
        message: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      console.log('queueLog subscriptions')
      dispatch({
        type: 'global/subscribeNotification',
        payload: {
          type: 'Consultation',
          callback: () => {
            dispatch({
              type: 'refresh',
            })
          },
        },
      })
      dispatch({
        type: 'global/subscribeNotification',
        payload: {
          type: 'QueueListing',
          callback: () => {
            dispatch({ type: 'refresh' })
          },
        },
      })
    },
    effects: {
      *startSession (_, { call, put }) {
        const response = yield call(service.startSession)
        const { data } = response
        if (data && data.id) {
          // start session successfully
          return yield put({
            type: 'updateSessionInfo',
            payload: { ...data },
          })
        }
        return yield put({
          type: 'toggleError',
          error: {
            hasError: true,
            message: 'Failed to start session.',
          },
        })
      },
      *endSession ({ sessionID }, { select, call, put }) {
        const response = yield call(service.endSession, sessionID)
        const { status } = response

        if (status >= 204 && status < 400) {
          // end session successfully, reset session info
          yield put({
            type: 'updateSessionInfo',
            payload: { ...InitialSessionInfo },
          })
          yield put({
            type: 'global/sendNotification',
            payload: {
              type: 'QueueListing',
              data: {
                sender: 'End Session',
                message: 'Session has been ended',
              },
            },
          })
        }

        return status >= 204
      },
      *getSessionInfo (_, { call, put }) {
        const payload = {
          IsClinicSessionClosed: false,
        }
        const response = yield call(service.getActiveSession, payload)

        const { data } = response
        // data = null when get session failed
        if (data && data.totalRecords === 1) {
          const { data: sessionData } = data
          yield put({
            type: 'query',
            payload: {
              pagesize: 999999,
              'VisitFKNavigation.BizSessionFK': sessionData[0].id,
            },
          })
          yield put({
            type: 'updateSessionInfo',
            payload: { ...sessionData[0] },
          })
          return true
        }
        return false
      },
      *deleteQueueByQueueID ({ payload }, { call, put }) {
        yield call(service.deleteQueue, payload)
        yield put({
          type: 'refresh',
        })
      },
      *refresh (_, { select, put }) {
        const queueLogState = yield select((state) => state.queueLog)
        const { currentFilter, sessionInfo } = queueLogState
        yield put({
          type: 'getSessionInfo',
        })
        // if (sessionInfo.id !== '') {
        //   const filter =
        //     currentFilter !== StatusIndicator.ALL
        //       ? {
        //           'visitFkNavigation.visitStatus': currentFilter,
        //         }
        //       : {}
        //   yield put({
        //     type: 'query',
        //     payload: {
        //       pagesize: 999999,
        //       'VisitFKNavigation.BizSessionFK': sessionInfo.id,
        //       ...filter,
        //     },
        //   })
        // }

        return true
      },
    },
    reducers: {
      toggleError (state, { error = {} }) {
        return { ...state, error: { ...error } }
      },
      updateSessionInfo (state, { payload }) {
        return { ...state, sessionInfo: { ...payload } }
      },
      showError (state, { payload }) {
        return { ...state, errorMessage: payload }
      },
      updateFilter (state, { status }) {
        return { ...state, currentFilter: status }
      },
    },
  },
})
