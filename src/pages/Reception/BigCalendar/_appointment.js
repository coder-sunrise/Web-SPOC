import { AppointmentTypeOptions } from './setting'
import { getUniqueGUID } from '@/utils/utils'

const patientName = [
  'Tan Ah Kow',
  'Goh Siew Chin',
  'Jason Goh',
  'Tan Min Min',
  'John Legend',
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
  new Date(now.getFullYear(), now.getMonth(), 25),
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
      start: new Date(now.getFullYear(), now.getMonth(), 25, 7, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 25, 11, 30, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[5].value,
      // color: AppointmentTypeOptions[5].color,
    },
    {
      id: getUniqueGUID(),
      start: new Date(now.getFullYear(), now.getMonth(), 25, 11, 30, 0),
      end: new Date(now.getFullYear(), now.getMonth(), 25, 15, 0, 0),
      doctor: 'medisys',
      resourceId: '0',
      appointmentType: AppointmentTypeOptions[4].value,

      series: true,
      draft: true,
    },
  ],
}

const generateAppointmentData = () => {
  let data = []
  for (let i = 0; i < 5; i++) {
    const appointment = {
      _appointmentID: i,
      patientName: patientName[i % 5],
      contactNo: contactNo[i % 5],
      remarks: '',
      appointmentDate: appointmentDate[i % 5],
      bookedBy: 'medisys',
      appointmentResources: appointmentResources[i],
    }
    data.push(appointment)
  }
  return data
}

export const events = generateAppointmentData()
