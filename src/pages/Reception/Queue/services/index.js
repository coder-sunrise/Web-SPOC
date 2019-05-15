import { stringify } from 'qs'
import request from '@/utils/request'

export async function queryList (params) {
  const entities = await request(`/api/fake_list?${stringify(params)}`)
  return {
    data: {
      entities,
      filter: {},
    },
  }
}

export async function fetchPatientInfoByPatientID (patientID) {
  // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
  const response = await request(`/api/patient/${patientID}`, {
    method: 'GET',
  })
  console.log('fetchPatientInfoByPatientID', response)
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
