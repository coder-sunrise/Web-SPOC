import { createListViewModel } from 'medisys-model'
// moment
import moment from 'moment'
import { subscribeNotification } from '@/utils/realtime'
import * as service from '../services'
import { save as updateAppt } from '@/services/calendar'
import { StatusIndicator } from '../variables'
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
      sessionInfo: { ...InitialSessionInfo },
      patientList: [],
      currentFilter: StatusIndicator.ALL,
      error: {
        hasError: false,
        message: '',
      },
    },
    subscriptions: ({ dispatch }) => {
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
      *getSessionInfo (_, { call, put }) {
        const payload = {
          IsClinicSessionClosed: false,
        }
        const response = yield call(service.getActiveSession, payload)

        const { data } = response
        // data = null when get session failed
        if (data && data.totalRecords === 1) {
          const { data: sessionData } = data
          const today = moment().format(serverDateFormat)
          yield put({
            type: 'query',
            payload: {
              pagesize: 999999,
              'VisitFKNavigation.BizSessionFK': sessionData[0].id,
            },
          })
          yield put({
            type: 'calendar/getCalendarList',
            payload: {
              eql_appointmentDate: today,
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
      *refresh (_, { put }) {
        yield put({
          type: 'getSessionInfo',
        })
        return true
      },
      *actualizeAppointment ({ payload }, { select, call, put }) {
        const calendarState = yield select((state) => state.calendar)
        const { list } = calendarState
        // const appointment = list.find((item) => item.id === payload)
        // console.log({ appointment, list, payload })
        // if (appointment) {
        //   const appointmentPayload = {
        //     recurrenceChanged: false,
        //     overwriteEntireSeries: false,
        //     editSingleAppointment: true,
        //     concurrencyToken: appointment.concurrencyToken,
        //     appointmentGroupDto: {
        //       id: parseInt(appointment.appointmentGroupFK, 10),
        //       concurrencyToken: appointment.concurrencyToken,
        //       appointments: [
        //         {
        //           id: appointment.id,
        //           concurrencyToken: appointment.concurrencyToken,
        //           appointmentGroupFk: parseInt(
        //             appointment.appointmentGroupFK,
        //             10,
        //           ),
        //           appointmentStatusFk: 4,
        //           isEditedAsSingleAppointment: true,
        //         },
        //       ],
        //     },
        //   }
        // console.log({ appointmentPayload })
        // yield call(updateAppt, appointmentPayload)
        // }
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
