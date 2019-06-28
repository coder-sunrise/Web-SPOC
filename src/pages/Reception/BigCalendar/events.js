const now = new Date()

export const calendarEvents = [
  {
    seriesID: 'series1',
    id: 'series1-event1',
    doctor: 'medisys',
    appointmentType: 'checkup',
    color: 'red',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 15, 7, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 15, 9, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 15, 7, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 15, 9, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 15, 7, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 15, 9, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series1',
    id: 'series1-event2',
    doctor: 'medisys',
    appointmentType: 'consultation',
    color: 'cyan',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 15, 11, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 15, 14, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 15, 11, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 15, 14, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 15, 11, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 15, 14, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series1',
    id: 'series1-event3',
    doctor: 'medisys',
    appointmentType: 'pillChecks',
    color: 'pink',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 15, 14, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 15, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 15, 14, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 15, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 15, 114, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 15, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series2',
    id: 'series2-event1',
    doctor: 'medisys',
    appointmentType: 'checkup',
    color: 'red',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 1',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      8,
      0,
      0,
    ),
    timeTo: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0),
    timeOut: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,
      0,
      0,
    ),
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series2',
    id: 'series2-event2',
    doctor: 'medisys',
    appointmentType: 'checkup',
    color: 'red',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 1',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,
      0,
      0,
    ),
    timeTo: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      10,
      0,
      0,
    ),
    timeIn: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0),
    timeOut: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      10,
      0,
      0,
    ),
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0),
    visitStatus: 'APPOINTMENT',
  },

  {
    seriesID: 'series3',
    id: 'series3-event1',
    doctor: 'medisys',
    appointmentType: '',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 3',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 11, 9, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 11, 8, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 11, 9, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 11, 8, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 11, 9, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 11, 8, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series3',
    id: 'series3-event2',
    doctor: 'medisys',
    appointmentType: 'checkup',
    color: 'red',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 3',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 11, 11, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 11, 12, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 11, 11, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 11, 12, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 11, 11, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 11, 12, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series3',
    id: 'series3-event3',
    doctor: 'medisys',
    appointmentType: 'consultation',
    color: 'cyan',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient3',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 11, 14, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 11, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 11, 14, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 11, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 11, 14, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 11, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series3',
    id: 'series3-event4',
    doctor: 'medisys',
    appointmentType: 'urgent',
    color: 'indigo',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 3',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 11, 16, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 11, 17, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 11, 16, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 11, 17, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 11, 16, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 11, 17, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series4',
    id: 'series4-event1',
    doctor: 'medisys',
    appointmentType: 'dental',
    color: 'blue',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 4',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 12, 9, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 12, 10, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 12, 9, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 12, 10, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 12, 9, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 12, 10, 30, 0),
    visitStatus: 'APPOINTMENT',
  },

  {
    seriesID: 'series5',
    id: 'series5-event1',
    doctor: 'medisys',
    appointmentType: 'dental',
    color: 'blue',
    roomNo: 'room1',
    resourceId: 'room1',
    patientName: 'Test patient 5',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 14, 9, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 14, 10, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 14, 9, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 14, 10, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 14, 9, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 14, 10, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series6',
    id: 'series6-event1',
    doctor: 'medisys',
    appointmentType: 'aesthetic',
    color: 'green',
    roomNo: 'room2',
    resourceId: 'room2',
    patientName: 'Test patient 6',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 17, 8, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 17, 12, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 17, 8, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 17, 12, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 17, 8, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 17, 12, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series7',
    id: 'series7-event1',
    doctor: 'medisys',
    appointmentType: 'aesthetic',
    color: 'green',
    roomNo: 'room2',
    resourceId: 'room2',
    patientName: 'Test patient 7',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 19, 10, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 19, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 19, 10, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 19, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 19, 10, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 19, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series8',
    id: 'series8-event1',
    doctor: 'medisys',
    appointmentType: 'pillChecks',
    color: 'pink',
    roomNo: 'room2',
    resourceId: 'room2',
    patientName: 'Test patient 8',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 24, 10, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 24, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 24, 10, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 24, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 24, 10, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 24, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series9',
    id: 'series9-event1',
    doctor: 'medisys',
    appointmentType: '',
    roomNo: 'room3',
    resourceId: 'room3',
    patientName: 'Test patient 9',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 4, 10, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 4, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 4, 10, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 4, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 4, 10, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 4, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series10',
    id: 'series10-event1',
    doctor: 'medisys',
    appointmentType: 'urgent',
    color: 'indigo',
    roomNo: 'room3',
    resourceId: 'room3',
    patientName: 'Test patient 10',
    contactNo: '12345678',
    remarks: '',
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 6, 10, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 6, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 6, 10, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 6, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 6, 10, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 6, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
  {
    seriesID: 'series11',
    id: 'series11-event1',
    doctor: 'Levinne',
    appointmentType: 'urgent',
    color: 'indigo',
    roomNo: 'room3',
    resourceId: 'room3',
    patientName: 'Test patient 10',
    contactNo: '12345678',
    remarks: '',
    isDoctorEvent: true,
    timeFrom: new Date(now.getFullYear(), now.getMonth(), 6, 10, 30, 0),
    timeTo: new Date(now.getFullYear(), now.getMonth(), 6, 15, 30, 0),
    timeIn: new Date(now.getFullYear(), now.getMonth(), 6, 10, 30, 0),
    timeOut: new Date(now.getFullYear(), now.getMonth(), 6, 15, 30, 0),
    start: new Date(now.getFullYear(), now.getMonth(), 6, 10, 30, 0),
    end: new Date(now.getFullYear(), now.getMonth(), 6, 15, 30, 0),
    visitStatus: 'APPOINTMENT',
  },
]
