import * as service from '@/services/common'
import request from '@/utils/request'

// const url = '/api/userprofileABC123'
const url = '/api/ClinicianProfile'

export const fetchUserProfileByID = async (id) => {
  const response = await request(`${url}/${id}`, {
    method: 'GET',
  })
  return response
}

export const query = (params) => service.query(url, params)
export const queryList = (params) => service.queryList(url, params)
export const create = (params) => service.create(url, params)
export const upsert = (params) => {
  return service.upsert(url, params)
}
