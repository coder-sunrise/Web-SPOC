import moment from 'moment'
import { AppointmentTypeOptions } from './setting'
import { getUniqueGUID } from '@/utils/utils'
import { VISIT_STATUS } from '../Queue/variables'

const patientName = [
  'Tan Ah Kow',
  'Goh Siew Chin',
  'Jason Goh',
  'Tan Min Min',
  'John Legend',
]

const doctorName = [
  'medisys',
  'levinne',
  'cheah',
  'tan',
  'lim',
]

const contactNo = [
  '11223344',
  '44332211',
  '12345678',
  '09876543',
  '01928375',
]

const now = new Date()
const appointmentDate = [
  new Date(now.getFullYear(), now.getMonth(), 5),
  new Date(now.getFullYear(), now.getMonth(), 10),
  new Date(now.getFullYear(), now.getMonth(), 15),
  new Date(now.getFullYear(), now.getMonth(), 20),
  // new Date(now.getFullYear(), now.getMonth(), 25),
  new Date(now.getFullYear(), now.getMonth(), now.getDate()),
]
const doctorBlockDate = [
  new Date(now.getFullYear(), now.getMonth(), 4),
  new Date(now.getFullYear(), now.getMonth(), 11),
  new Date(now.getFullYear(), now.getMonth(), 14),
  new Date(now.getFullYear(), now.getMonth(), 21),
  new Date(now.getFullYear(), now.getMonth(), 26),
]

const appointmentResources = {
  0: [
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 5, 7, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 5, 8, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[3].value,
      // color: AppointmentTypeOptions[3].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 5, 9, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 5, 11, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[1].value,
      // color: AppointmentTypeOptions[1].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 5, 14, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 5, 16, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[6].value,
      // color: AppointmentTypeOptions[6].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 5, 16, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 5, 17, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[4].value,
      // color: AppointmentTypeOptions[4].color,
    },
  ],
  1: [
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 10, 7, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 10, 11, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[1].value,
      // color: AppointmentTypeOptions[1].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 10, 12, 15, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 10, 14, 45, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[2].value,
      // color: AppointmentTypeOptions[2].color,
    },
  ],
  2: [
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 15, 7, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 15, 11, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[2].value,
      hasConflict: true,
      conflicts: [
        'The selected slot: 15 July 2019 7.30AM - 11.30AM is not within operating hour.',
        'The selected slot: 15 July 2019 7.30AM - 11.30AM is not within operating hour.',
        'The selected slot: 15 July 2019 7.30AM - 11.30AM is not within operating hour.',
      ],
      // color: AppointmentTypeOptions[2].color,
    },
  ],
  3: [
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 20, 7, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 20, 11, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[3].value,
      // color: AppointmentTypeOptions[3].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 20, 11, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 20, 15, 0, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[4].value,
      // color: AppointmentTypeOptions[4].color,
    },
  ],
  4: [
    {
      id: getUniqueGUID(),
      start: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        7,
        30,
        0,
      ),
      end: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        30,
        0,
      ),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[5].value,
      // color: AppointmentTypeOptions[5].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        30,
        0,
      ),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[4].value,

      series: true,
      draft: true,
    },
    {
      id: getUniqueGUID(),
      start: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        30,
        0,
      ),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[4].value,
      series: true,
      draft: true,
    },
  ],
}

const max = 5
const generateAppointmentData = () => {
  let data = []
  for (let i = 0; i < max; i++) {
    const appointment = {
      _appointmentID: i,
      patientName: patientName[i % max],
      isRegisteredPatient: i === 1,
      contactNo: contactNo[i % max],
      remarks: '',
      appointmentDate: appointmentDate[i % max],
      bookedBy: 'medisys',
      appointmentResources: appointmentResources[i],
      visitStatus: VISIT_STATUS.UPCOMING_APPT,
    }
    data.push(appointment)
  }
  return data
}

const generateDoctorBlock = () => {
  const _dateFormat = { dateFormatLong }
  const _timeFormat = 'hh:mm a'
  const _fullFormat = `${_dateFormat} ${_timeFormat}`
  let data = []
  for (let i = 0; i < max; i++) {
    const eventTime = '12:15 pm'
    const eventDate = moment(doctorBlockDate[i % max])
    const date = moment(eventDate).format(_dateFormat)

    const endDate = moment(`${date} ${eventTime}`, _fullFormat)
    endDate.add(parseInt('1', 10), 'hours')
    endDate.add(parseInt('15', 10), 'minutes')

    const startDate = moment(
      `${date} ${eventTime}`,
      `${_dateFormat} ${_timeFormat}`,
    )

    const doctorBlock = {
      _appointmentID: `doctorBlock-${i}`,
      doctor: doctorName[i % max],
      durationHour: '1',
      durationMinute: '15',
      eventDate,
      eventTime,
      start: startDate.toDate(),
      end: endDate.toDate(),
      isDoctorEvent: true,
      resourceId: '0',
      eventType: 'vacation',
      visitStatus: VISIT_STATUS.UPCOMING_APPT,
      hasConflict: i === max - 1,
    }
    data.push(doctorBlock)
  }
  return data
}

export const events = [
  ...generateAppointmentData(),
  ...generateDoctorBlock(),
]
