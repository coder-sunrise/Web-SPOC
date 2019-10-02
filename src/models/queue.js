import { createListViewModel } from 'medisys-model'
// moment
import moment from 'moment'
import { subscribeNotification } from '@/utils/realtime'
import * as service from '../services/queue'
import { save as updateAppt } from '@/services/calendar'
import { StatusIndicator } from '@/pages/Reception/Queue/variables'
import { serverDateTimeFormatFull } from '@/components'

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
      selfOnly: false,
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
      //   ]
      //   if (allowedPaths.includes(pathname)) {
      //     dispatch({
      //       type: 'initState',
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
      *initState (_, { select, put, take }) {
        let user = yield select((state) => state.user.data)

        let { clinicianProfile: { userProfile: { role: userRole } } } = user
        console.log({ userRole })
        if (userRole === undefined) {
          console.log('fetch user')
          yield take('user/fetchCurrent/@@end')
          user = yield select((state) => state.user.data)
          userRole = user.clinicianProfile.userProfile.role
        }
        yield put({
          type: 'updateState',
          payload: {
            list: [],
            selfOnly: userRole && userRole.clinicRoleFK === 1,
          },
        })
      },
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
        { call, put, all },
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

          yield all([
            put({
              type: 'query',
              payload: {
                pagesize: 999999,
                'VisitFKNavigation.BizSessionFK': sessionData[0].id,
              },
            }),
            put({
              type: 'updateSessionInfo',
              payload: { ...sessionData[0] },
            }),
            put({
              type: 'getTodayAppointments',
              payload: {
                shouldGetTodayAppointments,
              },
            }),
          ])

          // if (shouldGetTodayAppointments)

          return true
        }
        return false
      },
      *getTodayAppointments ({ payload }, { put }) {
        const { shouldGetTodayAppointments = true } = payload

        if (shouldGetTodayAppointments) {
          const today = moment()
          const start = moment(today.formatUTC(), serverDateTimeFormatFull)
            .add(-8, 'hours')
            .formatUTC(false)

          yield put({
            type: 'calendar/getCalendarList',
            payload: {
              combineCondition: 'and',
              eql_appointmentDate: start,
              group: [
                {
                  appointmentStatusFk: 5,
                  eql_appointmentStatusFk: '1',
                  combineCondition: 'or',
                },
              ],
            },
          })
        }
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
      *searchPatient ({ payload }, { take, put }) {
        const prefix = 'like_'
        const { searchQuery } = payload
        yield put({
          type: 'patientSearch/query',
          payload: {
            version: Date.now(),
            [`${prefix}name`]: searchQuery,
            [`${prefix}patientAccountNo`]: searchQuery,
            [`${prefix}contactFkNavigation.contactNumber.number`]: searchQuery,
            combineCondition: 'or',
          },
        })

        yield take('patientSearch/query/@@end')

        return true
      },
    },
    reducers: {
      toggleSelfOnly (state) {
        return { ...state, selfOnly: !state.selfOnly }
      },
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
