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

const patientNames = [
  'Annie Leonhart',
  'Blackwater',
  'Lincoln',
  'Mario',
  'John Kennedy',
]

const doctor = [
  'levinne',
  'cheah',
  'tan',
  'peck',
  'lim',
]

const contactNumber = [
  '12345678',
  '11223344',
  '55667788',
  '13579246',
  '24681357',
]
const appointmentTypes = [
  'checkup',
  'dental',
  'pillChecks',
  'checkup',
  'urgent',
]
const _todayDate = moment().format('DD MMM YYYY')
const dates = [
  {
    startDate: `${_todayDate} 08:15`,
    endDate: `${_todayDate} 08:30`,
    startTime: '08:15',
    endTime: '08:30',
  },
  {
    startDate: `${_todayDate} 08:15`,
    endDate: `${_todayDate} 08:30`,
    startTime: '08:15',
    endTime: '08:30',
  },
  {
    startDate: `${_todayDate} 08:30`,
    endDate: `${_todayDate} 08:45`,
    startTime: '08:30',
    endTime: '08:45',
  },
  {
    startDate: `${_todayDate} 09:15`,
    endDate: `${_todayDate} 09:30`,
    startTime: '09:15',
    endTime: '09:30',
  },
  {
    startDate: `${_todayDate} 09:15`,
    endDate: `${_todayDate} 09:45`,
    startTime: '09:15',
    endTime: '09:45',
  },
]

const generateData = () => {
  const data = []
  for (let i = 0; i < 5; i += 1) {
    data.push({
      id: i,
      allDay: false,
      appointmentType: appointmentTypes[i],
      bookBy: '',
      bookDate: '',
      contactNo: contactNumber[i],
      doctor: doctor[i],
      patientName: patientNames[i],
      startDate: dates[i].startDate,
      endDate: dates[i].endDate,
      startTime: dates[i].startTime,
      endTime: dates[i].endTime,
      title: `${patientNames[i]}(PT-00001A), ${contactNumber[i]}`,
    })
  }
  return data
}

const applyFilter = (data, filter) => {
  let returnData = [
    ...data,
  ]

  // filter by doctor
  const { doctors } = filter
  if (doctors.length !== 0 && !doctors.includes('all'))
    returnData = returnData.filter((aptData) =>
      doctors.includes(aptData.doctor),
    )

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
      patientList: [],
      currentSearchPatientInfo: {},
      aptData: generateData(),
      displayData: generateData(),
      filter: {
        searchQuery: '',
        appointmentType: [],
        doctors: [
          // { value: 'all', name: 'All', label: 'All' },
          'all',
        ],
      },

      showAll: false,
    },
    subscriptions: {},
    effects: {
      *fetchPatientListByName ({ payload }, { call, put }) {
        const response = !payload
          ? yield call(service.fetchPatientList)
          : yield call(service.fetchPatientListByName, payload)
        if (response) {
          const { data: { data = [] } } = response

          return yield put({
            type: 'updatePatientList',
            payload: [
              ...data,
            ],
          })
        }
        return false
      },
      *fetchPatientInfoByPatientID ({ payload }, { call, put }) {
        const response = yield call(
          service.fetchPatientInfoByPatientID,
          payload,
        )
        if (response) {
          return yield put({
            type: 'updateSelectedPatientInfo',
            payload: {
              ...response.data,
            },
          })
        }

        return false
      },
    },
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
        try {
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
        } catch (error) {
          return { ...state }
        }
      },
      updateFilterDoctor (state, { doctors }) {
        const newItemAll = doctors.indexOf('all') === doctors.length - 1

        let newDoctorsFilter = doctors
        if (newItemAll) {
          // new item === 'all', clear list and left 'all' only
          newDoctorsFilter = doctors.filter((doc) => doc === 'all')
        } else {
          // new item !== 'all'
          newDoctorsFilter =
            doctors.includes('all') && doctors.length > 1
              ? doctors.filter((doc) => doc !== 'all')
              : doctors
        }

        const filter = { ...state.filter, doctors: newDoctorsFilter }
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
          // filter: { ...newFilter },
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
      updatePatientList (state, { payload }) {
        return {
          ...state,
          patientList: [
            ...payload,
          ],
        }
      },
      updateSelectedPatientInfo (state, { payload }) {
        return { ...state, currentSearchPatientInfo: { ...payload } }
      },
    },
  },
})
