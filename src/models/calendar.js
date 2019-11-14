// big calendar
import BigCalendar from 'react-big-calendar'
// moment
import moment from 'moment'
// medisys model
import { createListViewModel } from 'medisys-model'
// common components
import { notification } from '@/components'
import * as service from '@/services/calendar'
import { queryList as queryPublicHolidays } from '@/pages/Setting/PublicHoliday/services'
import { queryList as queryClinicBreakHour } from '@/pages/Setting/ClinicBreakHour/services'
import { queryList as queryClinicOperationHour } from '@/pages/Setting/ClinicOperationHour/services'
// utils
import {
  generateRecurringAppointments,
  filterRecurrenceDto,
  mapDatagridToAppointmentResources,
  compareDto,
} from '@/pages/Reception/Appointment/components/form/formUtils'
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
  )
  if (old === undefined)
    return [
      ...currentResources,
      { ...apptResource, isDeleted: true },
    ]

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
      conflicts: [],
      calendarEvents: [],
      currentViewDate: new Date(),
      currentViewAppointment: {
        appointments: [],
      },
      calendarView: BigCalendar.Views.DAY,
      publicHolidayList: [],
      clinicBreakHourList: [],
      clinicOperationHourList: [],
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
      *initState ({ payload }, { all, put }) {
        yield all([
          put({ type: 'getPublicHolidayList', payload }),
          put({ type: 'getClinicBreakHourList', payload }),
          put({ type: 'getClinicOperationHourList', payload }),
          put({
            type: 'patient/updateState',
            payload: { entity: null, conflicts: [] },
          }),
        ])
      },
      *getActiveBizSessionQueue (_, { put, select }) {
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
            rescheduleReason,
            rescheduledByFK,
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
            rescheduleReason,
            rescheduledByFK,
          }

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

            const updatedOldResources = oldResources.map((item) => ({
              clinicianFK: item.clinicianFK,
              appointmentTypeFK: item.appointmentTypeFK,
              startTime: item.startTime,
              endTime: item.endTime,
              roomFk: item.roomFk,
              isPrimaryClinician: item.isPrimaryClinician,
              sortOrder: item.sortOrder,
            }))

            appointments = formikValues.appointments.reduce((updated, appt) => {
              if (overwriteEntireSeries) {
                return [
                  ...updated,
                  {
                    ...appt,
                    rescheduleReason,
                    rescheduledByFK,
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
                  rescheduleReason,
                  rescheduledByFK,
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
          // console.log({ savePayload })
          return yield put({
            type: actionKey,
            payload: savePayload,
          })
        } catch (error) {
          console.log({ error })
        }
        return false
      },
      *validate ({ payload }, { call, put }) {
        const result = yield call(service.validate, payload)
        const { status, data } = result

        if (parseInt(status, 10) === 200) {
          yield put({
            type: 'saveConflict',
            payload: {
              conflicts: data.resourceConflict,
            },
          })
        }
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
      *getClinicBreakHourList (_, { call, put }) {
        const result = yield call(queryClinicBreakHour, {
          isActive: true,
        })

        if (result.status === '200') {
          yield put({
            type: 'saveClinicBreakHours',
            payload: result.data.data,
          })
        }
      },
      *getClinicOperationHourList (_, { call, put }) {
        const result = yield call(queryClinicOperationHour, {
          isActive: true,
        })

        if (result.status === '200') {
          yield put({
            type: 'saveClinicOperationHours',
            payload: result.data.data,
          })
        }
      },
      *getPublicHolidayList ({ payload }, { call, put }) {
        const result = yield call(queryPublicHolidays, {
          isActive: true,
          lgteql_startDate: payload.start,
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
      *navigateCalendar ({ payload }, { all, select, put }) {
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
        let calendarView = 'month'
        let offSet = -8

        if (targetView === BigCalendar.Views.WEEK) calendarView = 'week'
        if (targetView === BigCalendar.Views.DAY) {
          isDayView = true
          calendarView = 'day'
          offSet = -8
        }

        start = moment(targetDate)
          .startOf(calendarView)
          .add(offSet, 'hours')
          .formatUTC()
        end = moment(targetDate)
          .endOf(calendarView)
          .add(offSet, 'hours')
          .formatUTC()
        // console.log({ start, targetDate })
        const getCalendarListPayload = isDayView
          ? {
              combineCondition: 'and',
              lgteql_appointmentDate: start,
              lsteql_appointmentDate: end,
            }
          : {
              combineCondition: 'and',
              lgteql_appointmentDate: start,
              lsteql_appointmentDate: end,
            }

        yield all([
          put({ type: 'getCalendarList', payload: getCalendarListPayload }),
          put({
            type: 'doctorBlock/query',
            payload: {
              lgteql_startDateTime: start,
            },
          }),
        ])
      },
    },
    reducers: {
      saveConflict (state, { payload }) {
        return { ...state, conflicts: payload.conflicts }
      },
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
      saveClinicBreakHours (state, { payload }) {
        return {
          ...state,
          clinicBreakHourList: [
            ...payload,
          ],
        }
      },
      saveClinicOperationHours (state, { payload }) {
        return {
          ...state,
          clinicOperationHourList: [
            ...payload,
          ],
        }
      },
    },
  },
})
