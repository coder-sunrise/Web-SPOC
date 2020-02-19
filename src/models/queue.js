import { createListViewModel } from 'medisys-model'
// moment
import moment from 'moment'
import { subscribeNotification, sendNotification } from '@/utils/realtime'
import * as service from '../services/queue'
import { notification } from '@/components'
import {
  StatusIndicator,
  VISIT_STATUS,
} from '@/pages/Reception/Queue/variables'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'

const InitialSessionInfo = {
  isClinicSessionClosed: true,
  id: '',
  // sessionNo: `${moment().format('YYMMDD')}-01`,
  sessionNo: 'N/A',
  sessionNoPrefix: '',
  sessionStartDate: '',
  sessionCloseDate: '',
}

const combineDateTime = (date, time) => {
  const appointmentDate = date.split('T')[0]
  return `${appointmentDate}T${time}`
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
      statusTagClicked: false,
      sessionInfo: { ...InitialSessionInfo },
      patientList: [],
      appointmentList: [],
      currentFilter: StatusIndicator.ALL,
      selfOnly: false,
      _modifiedSelftOnly: false,
      error: {
        hasError: false,
        message: '',
      },
    },
    subscriptions: ({ history, dispatch, ...restProps }) => {
      subscribeNotification('QueueListing', {
        callback: (response) => {
          const { location } = history
          const { user } = window.g_app._store.getState()
          const { senderId } = response
          if (
            user.data.id !== senderId &&
            location.pathname === '/reception/queue'
          )
            dispatch({ type: 'refresh' })
        },
      })
    },
    effects: {
      *initState (_, { select, put }) {
        let user = yield select((state) => state.user.data)
        const queueLogState = yield select((state) => state.queueLog)
        let { clinicianProfile: { userProfile: { role: userRole } } } = user
        if (userRole === undefined) {
          user = yield select((state) => state.user.data)
          userRole = user.clinicianProfile.userProfile.role

          yield put({
            type: 'codetable/fetchCodes',
            payload: {
              code: 'clinicianprofile',
            },
          })
        }

        yield put({
          type: 'updateState',
          payload: {
            list: [],
            sessionInfo: { ...InitialSessionInfo },
            selfOnly: !queueLogState._modifiedSelftOnly
              ? userRole && userRole.clinicRoleFK === 1
              : queueLogState.selfOnly,
          },
        })
      },
      *startSession (_, { call, put }) {
        const response = yield call(service.startSession)

        if (response) {
          // start session successfully
          yield put({
            type: 'updateSessionInfo',
            payload: { ...response },
          })
          yield put({
            type: 'query',
            payload: {
              'VisitFKNavigation.BizSessionFK': response.id,
            },
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

        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              sessionInfo: {
                isClinicSessionClosed: true,
                id: '',
                // sessionNo: `${moment().format('YYMMDD')}-01`,
                sessionNo: 'N/A',
                sessionNoPrefix: '',
                sessionStartDate: '',
                sessionCloseDate: '',
              },
            },
          })
        }
        return response
      },
      *getCurrentActiveSessionInfo (_, { call, put }) {
        const bizSessionPayload = {
          IsClinicSessionClosed: false,
        }
        const response = yield call(service.getBizSession, bizSessionPayload)
        const { data } = response
        if (data && data.totalRecords === 1) {
          const { data: sessionData } = data
          yield put({
            type: 'updateSessionInfo',
            payload: { ...sessionData[0] },
          })
        }
      },
      *getSessionInfo (
        { payload = { shouldGetTodayAppointments: true } },
        { call, put, all, select, take },
      ) {
        let user = yield select((state) => state.user.data)
        let { clinicianProfile: { userProfile: { role: userRole } } } = user

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
                pagesize: 999,
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

          return true
        }
        yield put({
          type: 'updateSessionInfo',
          payload: { ...InitialSessionInfo },
        })
        return false
      },
      *getTodayAppointments ({ payload }, { call, put }) {
        const { shouldGetTodayAppointments = true } = payload
        // TODO: integrate with new appointment listing api
        if (shouldGetTodayAppointments) {
          const today = moment().formatUTC()
          const queryPayload = {
            combineCondition: 'and',
            eql_appointmentDate: today,
            in_appointmentStatusFk: '1|5',
          }
          const response = yield call(
            service.queryAppointmentListing,
            queryPayload,
          )
          if (response) {
            const { data: { data = [] } } = response
            yield put({
              type: 'updateState',
              payload: {
                appointmentList: data.map((item) => ({
                  ...item,
                  visitStatus: VISIT_STATUS.UPCOMING_APPT,
                  appointmentTime: combineDateTime(
                    item.appointmentDate,
                    item.startTime,
                  ),
                })),
              },
            })
          }
        }
      },
      *deleteQueueByQueueID ({ payload }, { call, put }) {
        const result = yield call(service.deleteQueue, payload)
        if (result) {
          notification.success({
            message: 'Visit Deleted',
          })
          yield put({
            type: 'refresh',
          })
          sendQueueNotification({
            message: 'Visit deleted.',
            queueNo: payload.queueNo,
          })
        }
        return result
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
            // [`${prefix}name`]: searchQuery,
            // [`${prefix}patientAccountNo`]: searchQuery,
            // [`${prefix}contactFkNavigation.contactNumber.number`]: searchQuery,
            // combineCondition: 'or',
            apiCriteria: {
              searchValue: searchQuery,
            },
          },
        })

        yield take('patientSearch/query/@@end')

        return true
      },
    },
    reducers: {
      toggleSelfOnly (state) {
        return { ...state, selfOnly: !state.selfOnly, _modifiedSelftOnly: true }
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
