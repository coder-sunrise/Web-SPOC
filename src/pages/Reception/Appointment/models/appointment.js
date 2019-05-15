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
  // filter by color
  const { colors } = filter
  returnData = data.filter((aptData) => colors.includes(aptData.colorTag))

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

const addNewColorIfNotSelected = (added, colors) => {
  const newFilterColor = colors.includes(added.colorTag)
    ? [
        ...colors,
      ]
    : [
        ...colors,
        added.colorTag,
      ]
  return newFilterColor
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
      selectedDoctors: [],
      filter: {
        searchQuery: '',
        colors: [],
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
        let newColorsFilter = [
          ...filter.colors,
        ]

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

          newColorsFilter = addNewColorIfNotSelected(added, newColorsFilter)
        }
        if (changed) {
          data = data.map(
            (appointment) =>
              appointment.id === changed.id ? { ...changed } : appointment,
          )
          newColorsFilter = addNewColorIfNotSelected(changed, newColorsFilter)
        }

        if (deleted >= 0) {
          data = data.filter((appointment) => appointment.id !== deleted)
        }

        const newFilter = {
          ...filter,
          colors: [
            ...newColorsFilter,
          ],
        }
        const displayData = applyFilter(data, newFilter)

        return {
          ...state,
          displayData,
          aptData: [
            ...data,
          ],
          filter: {
            ...state.filter,
            colors: [
              ...newColorsFilter,
            ],
          },
        }
      },
      updateSelectedDoctors (state, { selected }) {
        const displayData = applyFilter(state.aptData, selected)
        return {
          ...state,
          displayData,
          showAll: selected.length === 0,
          selectedDoctors: [
            ...selected,
          ],
        }
      },
      updateFilterColors (state, { selected }) {
        const hasDefault = selected.find((color) => color === 'default')
        // sort 'default' always at position 0
        const newSelected = hasDefault
          ? [
              hasDefault,
              ...selected.filter((color) => color !== hasDefault),
            ]
          : [
              ...selected,
            ]

        const filter = {
          ...state.filter,
          colors: newSelected,
        }
        const displayData = applyFilter(state.aptData, filter)
        return {
          ...state,
          displayData,
          filter,
        }
      },
      updateFilterQuery (state, { searchQuery }) {
        console.log('updateFilterQuery')
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
