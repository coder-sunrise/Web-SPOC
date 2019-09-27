// big calendar
import BigCalendar from 'react-big-calendar'
// moment
import moment from 'moment'
// medisys model
import { createListViewModel } from 'medisys-model'
// common components
import { notification, serverDateFormat } from '@/components'
import * as service from '@/services/calendar'
import { queryList as queryPublicHolidays } from '@/pages/Setting/PublicHoliday/services'
// utils
import {
  generateRecurringAppointments,
  filterRecurrenceDto,
  mapDatagridToAppointmentResources,
  compareDto,
} from '@/pages/Reception/Appointment/components/form/formikUtils'
import { getTimeObject, compare } from '@/utils/yup'

const ACTION_KEYS = {
  insert: 'insertAppointment',
  save: 'saveAppointment',
  reschedule: 'rescheduleAppointment',
  delete: 'deleteDraft',
}

const sortDataGrid = (a, b) => {
  const start = getTimeObject(a.startTime)
  const end = getTimeObject(b.startTime)
  const aLessThanB = compare(start, end)
  if (aLessThanB) return -1
  if (!aLessThanB) return 1
  return 0
}

const updateApptResources = (oldResources) => (
  currentResources,
  apptResource,
) => {
  const old = oldResources.find(
    (oldItem) => oldItem.sortOrder === apptResource.sortOrder,
    // (oldItem) => oldItem.id === apptResource.id,
  )
  console.log({ oldResources, old })
  if (old === undefined)
    return [
      ...currentResources,
      { ...apptResource, isDeleted: true },
    ]
  // const {
  //   clinicianFK,
  //   appointmentTypeFK,
  //   startTime,
  //   endTime,
  //   roomFk,
  //   isPrimaryClinician,
  // } = old
  return [
    ...currentResources,
    {
      ...apptResource,
      ...old,
    },
  ]
}

export default createListViewModel({
  namespace: 'calendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      list: [],
      calendarEvents: [],
      currentViewDate: new Date(),
      currentViewAppointment: {
        appointments: [],
      },
      calendarView: BigCalendar.Views.MONTH,
      publicHolidayList: [],
      isEditedAsSingleAppointment: false,
      mode: 'single',
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((location) => {
        const { pathname } = location
        const allowedPaths = [
          '/reception/appointment',
        ]

        if (allowedPaths.includes(pathname)) {
          dispatch({
            type: 'getActiveBizSessionQueue',
          })
        }
      })
    },
    effects: {
      *getActiveBizSessionQueue (_, { call, put, select }) {
        const queueLog = yield select((state) => state.queueLog)
        const { sessionInfo } = queueLog
        if (sessionInfo.id === '') {
          // initialize biz session
          yield put({
            type: 'queueLog/getSessionInfo',
            payload: { shouldGetTodayAppointments: false },
          })
        }
      },
      *submit ({ payload }, { select, put }) {
        const calendarState = yield select((state) => state.calendar)
        // const { ltsppointmentstatus } = yield select((state) => state.codetable)
        try {
          const {
            validate,
            formikValues,
            datagrid = [],
            newAppointmentStatusFK,
          } = payload
          const {
            currentAppointment: formikCurrentAppointment,
            appointments: formikAppointments,
            recurrenceDto,
            overwriteEntireSeries,
            ...restFormikValues
          } = formikValues

          const isEdit = formikValues.id !== undefined
          let isRecurrenceChanged =
            formikValues.isEnableRecurrence &&
            compareDto(
              recurrenceDto,
              calendarState.currentViewAppointment.recurrenceDto || {},
            )

          const appointmentResources = datagrid
            .map(mapDatagridToAppointmentResources(isRecurrenceChanged))
            .sort(sortDataGrid)
            .map((item, index) => ({
              ...item,
              sortOrder: index,
            }))

          const currentAppointment = {
            ...formikCurrentAppointment,
            isEditedAsSingleAppointment: !isEdit
              ? false
              : calendarState.mode === 'single',
            appointmentStatusFk: newAppointmentStatusFK,
            appointments_Resources: appointmentResources,
          }

          console.log({ currentAppointment })

          const shouldGenerateRecurrence =
            !isEdit || (isRecurrenceChanged && formikValues.isEnableRecurrence)

          let appointments = []

          if (shouldGenerateRecurrence) {
            appointments = generateRecurringAppointments(
              recurrenceDto,
              currentAppointment,
              formikValues.isEnableRecurrence,
              isRecurrenceChanged,
            )
          } else if (calendarState.mode === 'single') {
            appointments = [
              currentAppointment,
            ]
          } else {
            /* 
              update all other recurrences
              - appointmentStatusFK
              - appointmentRemarks
              - appointmentsResources
            */
            const newResources = appointmentResources.filter(
              (item) => item.isNew,
            )
            const oldResources = appointmentResources.filter(
              (item) => !item.isNew,
            )

            console.log({
              newResources,
              oldResources,
              appts: formikValues.appointments,
            })
            const updatedOldResources = oldResources.map((item) => ({
              clinicianFK: item.clinicianFK,
              appointmentTypeFK: item.appointmentTypeFK,
              startTime: item.startTime,
              endTime: item.endTime,
              roomFk: item.roomFk,
              isPrimaryClinician: item.isPrimaryClinician,
            }))

            appointments = formikValues.appointments.reduce((updated, appt) => {
              if (overwriteEntireSeries) {
                return [
                  ...updated,
                  {
                    ...appt,
                    appointmentStatusFk: newAppointmentStatusFK,
                    appointmentRemarks: currentAppointment.appointmentRemarks,
                    appointments_Resources: [
                      ...newResources,
                      ...appt.appointments_Resources.reduce(
                        updateApptResources(updatedOldResources),
                        [],
                      ),
                    ]
                      .sort(sortDataGrid)
                      .map((item, index) => ({
                        ...item,
                        sortOrder: index,
                      })),
                  },
                ]
              }
              if (appt.isEditedAsSingleAppointment)
                return [
                  ...updated,
                  appt,
                ]

              return [
                ...updated,
                {
                  ...appt,
                  appointmentStatusFk: newAppointmentStatusFK,
                  appointmentRemarks: currentAppointment.appointmentRemarks,
                  appointments_Resources: [
                    ...newResources,
                    ...appt.appointments_Resources.reduce(
                      updateApptResources(updatedOldResources),
                      [],
                    ),
                  ]
                    .sort(sortDataGrid)
                    .map((item, index) => ({
                      ...item,
                      sortOrder: index,
                    })),
                },
              ]
            }, [])
          }

          // const cancelRecurrence =
          //   formikValues.isEnableRecurrence === false &&
          //   calendarState.currentViewAppointment.isEnableRecurrence === true
          // if (cancelRecurrence) {
          //   isRecurrenceChanged = true
          //   appointments = appointments.map(
          //     (appt) =>
          //       appt.id === currentAppointment.id
          //         ? { ...appt }
          //         : { ...appt, isDeleted: true },
          //   )
          // }

          const recurrence = formikValues.isEnableRecurrence
            ? filterRecurrenceDto(recurrenceDto)
            : null

          let actionKey = ACTION_KEYS.insert
          if (isEdit) actionKey = ACTION_KEYS.save
          if (newAppointmentStatusFK === 5) actionKey = ACTION_KEYS.reschedule
          let savePayload = {
            ...restFormikValues,
            appointments,
            recurrenceDto: recurrence,
          }
          if (validate) {
            yield put({
              type: 'validate',
              payload: savePayload,
            })
            return false
          }
          if (isEdit) {
            savePayload = {
              recurrenceChanged: isRecurrenceChanged,
              overwriteEntireSeries,
              editSingleAppointment: calendarState.mode === 'single',
              appointmentGroupDto: {
                ...restFormikValues,
                appointments,
                recurrenceDto: recurrence,
              },
            }
          }
          console.log({ savePayload })
          // return yield put({
          //   type: actionKey,
          //   payload: savePayload,
          // })
        } catch (error) {
          console.log({ error })
        }
        return false
      },
      *validate ({ payload }, { call }) {
        return yield call(service.validate, payload)
      },
      *refresh (_, { put }) {
        yield put({ type: 'navigateCalendar', payload: {} })
      },
      *getAppointmentDetails ({ payload }, { call, put }) {
        const result = yield call(service.query, payload)
        const { status, data } = result
        if (parseInt(status, 10) === 200) {
          yield put({
            type: 'setViewAppointment',
            data,
          })
          yield put({
            type: 'setEditType',
            payload: payload.mode,
          })
          yield put({
            type: 'cachePayload',
            payload,
          })
          return true
        }
        return false
      },
      *getCalendarList ({ payload }, { call, put }) {
        const result = yield call(service.queryList, {
          ...payload,
        })
        const { status, data } = result
        if (status === '200' && data.data) {
          yield put({
            type: 'updateState',
            payload: {
              list: data.data,
            },
          })
        }
      },
      *getPublicHolidayList ({ payload }, { call, put }) {
        const result = yield call(queryPublicHolidays, {
          lgteql_startDate: payload.start,
          pagesize: 99999,
        })
        if (result.status === '200') {
          yield put({
            type: 'savePublicHolidays',
            payload: result.data.data,
          })
        }
      },
      *insertAppointment ({ payload }, { call, put }) {
        const result = yield call(service.insert, payload)
        if (result) {
          yield put({ type: 'refresh' })
          notification.success({ message: 'Appointment created' })
          return true
        }
        return false
      },
      *saveAppointment ({ payload }, { call, put }) {
        const result = yield call(service.save, payload)
        if (result) {
          yield put({ type: 'refresh' })
          notification.success({ message: 'Appointment(s) updated' })
          return true
        }
        return false
      },

      *rescheduleAppointment ({ payload }, { call, put }) {
        const result = yield call(service.reschedule, payload)
        if (result) {
          yield put({ type: 'refresh' })
          notification.success({ message: 'Appointment(s) updated' })
          return true
        }
        return false
      },
      *deleteDraft ({ payload, callback }, { call, put }) {
        const result = yield call(service.deleteDraft, payload)
        if (result === 204) notification.success({ message: 'Deleted' })
        yield put({ type: 'refresh' })
        callback && callback()
      },
      *cancelAppointment ({ payload }, { call, put }) {
        const result = yield call(service.cancel, payload)
        if (result && result.status === '200') {
          notification.success({ message: 'Appointment(s) cancelled' })
          yield put({ type: 'refresh' })
          return true
        }
        return false
      },
      *navigateCalendar ({ payload }, { select, put }) {
        const calendarState = yield select((state) => state.calendar)
        const { date, view } = payload
        const targetDate =
          date !== undefined ? date : calendarState.currentViewDate
        const targetView =
          view !== undefined ? view : calendarState.calendarView
        yield put({
          type: 'setCurrentViewDate',
          payload: targetDate,
        })
        let start
        let end
        let isDayView = false

        if (targetView === BigCalendar.Views.MONTH) {
          start = moment(targetDate).startOf('month').formatUTC()
          end = moment(targetDate).endOf('month').formatUTC()
        }
        if (targetView === BigCalendar.Views.WEEK) {
          start = moment(targetDate).startOf('week').formatUTC()
          end = moment(targetDate).endOf('week').formatUTC()
        }
        if (targetView === BigCalendar.Views.DAY) {
          start = moment(targetDate).startOf('day').formatUTC()
          end = moment(targetDate).endOf('day').formatUTC()
          isDayView = true
        }

        const getCalendarListPayload = isDayView
          ? {
              eql_appointmentDate: start,
            }
          : {
              combineCondition: 'and',
              lgteql_appointmentDate: start,
              lsteql_appointmentDate: end,
            }

        yield put({ type: 'getCalendarList', payload: getCalendarListPayload })
        yield put({ type: 'getPublicHolidayList', payload: { start } })
        yield put({
          type: 'doctorBlock/query',
          payload: {
            pagesize: 9999,
            lgteql_startDateTime: start,
          },
        })
      },
    },
    reducers: {
      cachePayload (state, { payload }) {
        return { ...state, cachedPayload: payload }
      },
      setEditType (state, { payload }) {
        return { ...state, mode: payload }
      },
      setCurrentViewDate (state, { payload }) {
        return { ...state, currentViewDate: payload }
      },
      setViewAppointment (state, { data }) {
        return { ...state, currentViewAppointment: { ...data } }
      },
      setCalendarView (state, { payload }) {
        return { ...state, calendarView: payload }
      },
      savePublicHolidays (state, { payload }) {
        return {
          ...state,
          publicHolidayList: [
            ...payload,
          ],
        }
      },
    },
  },
})
