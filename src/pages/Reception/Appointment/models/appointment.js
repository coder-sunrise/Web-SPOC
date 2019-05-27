// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import moment from 'moment'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import {
  _dateFormat,
  CALENDAR_VIEWS,
  getWeek,
  getMonth,
  getDateValue,
} from '../utils'

const applyFilter = (data, filter) => {
  let returnData = [
    ...data,
  ]
  // filter by appointment type
  const { appointmentType } = filter
  if (appointmentType.length !== 0) {
    returnData = returnData.filter((aptData) =>
      appointmentType.includes(aptData.appointmentType),
    )
  }

  // filter by query
  const { searchQuery } = filter
  if (searchQuery !== '') {
    returnData = returnData.filter((aptData) => {
      const { patientName } = aptData
      if (patientName.includes(searchQuery)) return true

      return false
    })
  }

  return returnData
}

const todayDate = moment(new Date()).format(_dateFormat).toString()

export default createListViewModel({
  namespace: 'appointment',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentView: CALENDAR_VIEWS.DAY,
      currentDate: todayDate,
      displayDate: todayDate,

      aptData: [],
      displayData: [],
      filter: {
        searchQuery: '',
        appointmentType: [
          'all',
        ],
        doctors: [
          'all',
        ],
      },
      showAll: false,
    },
    subscriptions: {},
    effects: {},
    reducers: {
      viewChange (state, { view }) {
        let { displayDate } = state

        if (view === CALENDAR_VIEWS.DAY) {
          displayDate = getDateValue(state.currentDate)
        }

        if (view === CALENDAR_VIEWS.WEEK) {
          displayDate = getWeek(state.currentDate)
        }

        if (view === CALENDAR_VIEWS.MONTH) {
          displayDate = getMonth(state.currentDate)
        }
        return { ...state, currentView: view, displayDate }
      },
      dateChange (state, { date }) {
        let { displayDate } = state

        if (state.currentView === CALENDAR_VIEWS.DAY) {
          displayDate = getDateValue(date)
        }

        if (state.currentView === CALENDAR_VIEWS.WEEK) {
          displayDate = getWeek(date)
        }

        if (state.currentView === CALENDAR_VIEWS.MONTH) {
          displayDate = getMonth(date)
        }

        return { ...state, currentDate: getDateValue(date), displayDate }
      },
      commitChanges (state, { added, changed, deleted }) {
        let { aptData: data } = state
        const { filter } = state

        if (added) {
          const startingAddedId =
            data.length > 0 ? data[data.length - 1].id + 1 : 0

          data = [
            ...data,
            {
              id: startingAddedId,
              ...added,
            },
          ]
        }
        if (changed) {
          data = data.map(
            (appointment) =>
              appointment.id === changed.id ? { ...changed } : appointment,
          )
        }

        if (deleted >= 0) {
          data = data.filter((appointment) => appointment.id !== deleted)
        }

        const newFilter = {
          ...filter,
        }
        const displayData = applyFilter(data, newFilter)

        return {
          ...state,
          displayData,
          aptData: [
            ...data,
          ],
        }
      },
      updateFilterDoctor (state, { doctors }) {
        const filter = { ...state.filter, doctors }
        const displayData = applyFilter(state.aptData, filter)

        return { ...state, displayData, filter }
      },
      updateFilterAppointmentType (state, { appointmentType }) {
        const filter = { ...state.filter, appointmentType }
        const displayData = applyFilter(state.aptData, filter)

        return { ...state, displayData, filter }
      },
      updateFilterQuery (state, { searchQuery }) {
        const { filter } = state
        const newFilter = {
          ...filter,
          searchQuery,
        }
        const displayData = applyFilter(state.aptData, newFilter)

        return {
          ...state,
          displayData,
          filter: { ...newFilter },
        }
      },
      showAll (state) {
        const { showAll, selectedDoctors } = state
        return {
          ...state,
          showAll: !showAll,
          selectedDoctors: !showAll ? [] : selectedDoctors,
        }
      },
    },
  },
})
