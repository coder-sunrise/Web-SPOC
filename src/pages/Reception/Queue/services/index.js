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

export const getQueueListing = async (sessionID) => {
  const criteria = [
    {
      prop: 'VisitFKNavigation.BizSessionFK',
      val: sessionID,
      opr: 'eql',
    },
  ]

  const response = await request(`/api/queue/`, {
    method: 'GET',
    data: stringify({ criteria }),
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
  return { data: { visitInfo } }
}

export async function getCodeTable (codetableName) {
  const response = await request(`/api/CodeTable?ctnames=${codetableName}`)
  return response
}
