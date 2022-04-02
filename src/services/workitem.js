import * as service from '@/services/common'
import request from '@/utils/request'
const url = '/api/workitem'
const testPanelItemUrl = '/api/ctTestPanelItem'

export const queryResultDetails = async params => {
  return await request(`${url}/ResultDetails`, {
    method: 'GET',
    body: { visitFK: params.visitId },
  })
}

export const getTestPanelItemWithRefRange = async params => {
  return await request(`${testPanelItemUrl}/allWithRefRange`, {
    method: 'GET',
    body: { patientProfileFK: params.patientProfileFK },
  })
}
export const getLabResults = async params => {
  return await request(`${url}/LabResults`, {
    method: 'GET',
    body: params,
  })
}
