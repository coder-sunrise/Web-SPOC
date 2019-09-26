import { createListViewModel } from 'medisys-model'
// moment
import moment from 'moment'
import { subscribeNotification } from '@/utils/realtime'
import * as service from '../services/queue'
import { save as updateAppt } from '@/services/calendar'
import { StatusIndicator } from '@/pages/Reception/Queue/variables'
import { serverDateFormat } from '@/components'

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
      list: [],
      sessionInfo: { ...InitialSessionInfo },
      patientList: [],
      currentFilter: StatusIndicator.ALL,
      error: {
        hasError: false,
        message: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      // history.listen((location) => {
      //   const { pathname } = location
      //   const allowedPaths = [
      //     '/reception/queue',
      //     '/reception/appointment',
      //   ]
      //   if (allowedPaths.includes(pathname)) {
      //     dispatch({
      //       type: 'getSessionInfo',
      //       payload: {
      //         shouldGetTodayAppointments: pathname === allowedPaths[0],
      //       },
      //     })
      //   }
      // })
      subscribeNotification('QueueListing', {
        callback: () => {
          dispatch({ type: 'refresh' })
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
      *endSession ({ sessionID }, { call, put }) {
        const response = yield call(service.endSession, sessionID)
        const { status } = response

        if (status >= 204 && status < 400) {
          // end session successfully, reset session info
          yield put({
            type: 'updateSessionInfo',
            payload: { ...InitialSessionInfo },
          })
          // yield put({
          //   type: 'global/sendNotification',
          //   payload: {
          //     type: 'QueueListing',
          //     data: {
          //       sender: 'End Session',
          //       message: 'Session has been ended',
          //     },
          //   },
          // })
        }

        return status >= 204
      },
      *getSessionInfo (
        { payload = { shouldGetTodayAppointments: true } },
        { call, put },
      ) {
        const { shouldGetTodayAppointments = true } = payload
        const bizSessionPayload = {
          IsClinicSessionClosed: false,
        }
        const response = yield call(service.getBizSession, bizSessionPayload)

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
          if (shouldGetTodayAppointments)
            yield put({
              type: 'getTodayAppointments',
            })

          yield put({
            type: 'updateSessionInfo',
            payload: { ...sessionData[0] },
          })
          return true
        }
        return false
      },
      *getTodayAppointments (_, { put }) {
        const today = moment().format('YYYY-MM-DD')
        yield put({
          type: 'calendar/getCalendarList',
          payload: {
            combineCondition: 'and',
            eql_appointmentDate: today,
            group: [
              {
                appointmentStatusFk: 5,
                eql_appointmentStatusFk: '1',
                combineCondition: 'or',
              },
              // {
              //   eql_appointmentDate: today,
              // },
            ],
          },
        })
      },
      *deleteQueueByQueueID ({ payload }, { call, put }) {
        yield call(service.deleteQueue, payload)
        yield put({
          type: 'refresh',
        })
      },
      *refresh ({ payload }, { put }) {
        yield put({
          type: 'getSessionInfo',
          payload,
        })
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
