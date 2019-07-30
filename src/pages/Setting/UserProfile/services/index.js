import { stringify } from 'qs'
import * as service from '@/services/common'
import request, { axiosRequest } from '@/utils/request'
import { convertToQuery } from '@/utils/utils'

// const url = '/api/userprofileABC123'
const url = '/api/userprofile'

export const fetchUserProfileByID = async (id) => {
  const response = await axiosRequest(`${url}/${id}`, {
    method: 'GET',
  })
  return response
}

export const query = (params) => service.query(url, params)
export const queryList = (params) => service.queryList(url, params)
export const create = (params) => service.create(url, params)
export const upsert = (params) => service.upsert(url, params)
