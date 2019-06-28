import moment from 'moment'
import { initialAptInfo, _dateFormat } from './variables'
import { getColorByAppointmentType } from '../../setting'

// export const handleSubmit = (values, { props, resetForm }) => {
//   const {
//     patientName,
//     contactNo,
//     startDate: _utcStartDate,
//     endDate: _utcEndDate,
//     startTime,
//     endTime,
//     appointmentType = '',
//     doctor,
//   } = values
//   const { handleAddEvents, handleUpdateEvents, slotInfo, resources } = props

//   const startDate = moment(_utcStartDate).format(_dateFormat)
//   const endDate = moment(_utcEndDate).format(_dateFormat)

//   const _momentStartDate = moment(
//     `${startDate} ${startTime}`,
//     `${_dateFormat} hh:mm a`,
//   )
//   const _nativeStartDate = _momentStartDate.toDate()

//   const _momentEndDate = moment(
//     `${endDate} ${endTime}`,
//     `${_dateFormat} hh:mm a`,
//   )
//   const _nativeEndDate = _momentEndDate.toDate()

//   const assignedResource = resources.find(
//     (resource) => resource.resourceId === doctor,
//   )
//   let resourceId = assignedResource ? assignedResource.resourceId : 'other'

//   if (!_momentStartDate.isValid() && !_momentEndDate.isValid()) return

//   const event = {
//     ...slotInfo,
//     ...values,
//     tooltip: `${patientName}(${contactNo})`,
//     start: _nativeStartDate,
//     end: _nativeEndDate,
//     title: `${patientName}(${contactNo})`,
//     color: getColorByAppointmentType(appointmentType),
//     resourceId,
//   }

//   switch (slotInfo.type) {
//     case 'update':
//       handleUpdateEvents(event)
//       break
//     default:
//       handleAddEvents(event)
//       break
//   }
//   resetForm()
// }

export const handleSubmit = (values, { props, resetForm }) => {
  console.group('handleSubmit')
  console.log({ values, props })
  console.groupEnd('handleSubmit')
}

export const mapPropsToValues = ({ slotInfo, resources = [] }) => {
  const startDate = moment(slotInfo.start).format(_dateFormat)
  const startTime = moment(slotInfo.start).format('hh:mm a')
  const endDate = moment(slotInfo.end).format(_dateFormat)
  const endTime = moment(slotInfo.end).format('hh:mm a')

  const currentResource = resources.find(
    (resource) => resource.resourceId === slotInfo.resourceId,
  )
  let doctor = ''
  if (currentResource) {
    doctor =
      currentResource.resourceId !== 'other' ? currentResource.resourceId : ''
  }

  return {
    ...initialAptInfo,
    ...slotInfo,
    doctor,
    startDate,
    startTime,
    endDate,
    endTime,
  }
}

export const getEventSeriesByID = (seriesID, data) => {
  if (!data && !seriesID) return []

  return data.filter((eachData) => eachData.seriesID === seriesID)
}
