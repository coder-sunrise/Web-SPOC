import { stringify } from 'qs'
import request, { axiosRequest } from '@/utils/request'

// export async function queryList (params) {
//   const entities = await request(`/api/fake_list?${stringify(params)}`)
//   return {
//     data: {
//       entities,
//       filter: {},
//     },
//   }
// }

export const startSession = async () => {
  const response = await axiosRequest('/api/bizsession/', { method: 'POST' })
  return response
}

export const endSession = async (sessionID) => {
  const response = await axiosRequest(`/api/bizsession/${sessionID}`, {
    method: 'PUT',
  })
  return response
}

export const getActiveSession = async () => {
  const criteria = [
    {
      prop: 'IsClinicSessionClosed',
      val: false,
      opr: 'eql',
    },
  ]

  // const sort = [
  //   { sortby: 'sessionno', order: 'asc' },
  // ]

  const response = await request('/api/bizsession', {
    method: 'GET',
    data: stringify({ criteria }),
  })

  return response
}

export const getSessionInfo = async (sessionID) => {
  const response = await axiosRequest(`/api/bizsession/${sessionID}`, {
    method: 'GET',
  })
  return response
}

export const getQueueListing = async (sessionID, filter) => {
  const criteria = [
    {
      prop: 'VisitFKNavigation.BizSessionFK',
      val: sessionID,
      opr: 'eql',
    },
    filter,
  ]

  const response = await request(`/api/queue/`, {
    method: 'GET',
    data: stringify({ criteria, combineCondition: 'and' }),
  })
  return response
}

export const deleteQueue = async (queueID) => {
  const response = await request(`/api/queue/${queueID}`, {
    method: 'DELETE',
  })

  return response
}

export async function fetchPatientInfoByPatientID (patientID) {
  // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
  const response = await request(`/api/patient/${patientID}`, {
    method: 'GET',
  })
  return response
}

export async function fetchPatientList () {
  const response = await request('/api/patient')
  return response
}

export async function fetchPatientListByName (patientName) {
  const criteria = [
    { prop: 'name', val: patientName, opr: 'like' },
  ]
  const response = await request('/api/patient', {
    method: 'GET',
    data: stringify({ criteria }),
  })
  return response
}

export async function registerVisit (visitInfo) {
  const formData = new FormData()
  formData.append('queueDetailsModel', JSON.stringify(visitInfo))
  const options = { method: 'POST', data: formData }
  const response = await axiosRequest(`/api/queue`, options)
  return {}
}

export async function getCodeTable (codetableName) {
  const response = await request(`/api/CodeTable?ctnames=${codetableName}`)
  return response
}

export const fetchDoctorProfile = async () => {
  const criteria = {
    current: 1,
    pageSize: 10,
  }
  const response = await request('/api/doctorprofile', {
    method: 'GET',
    // body: JSON.stringify(criteria),
  })
  return response
}
