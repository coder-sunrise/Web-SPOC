import * as service from '@/services/common'
import request from '@/utils/request'
const url = '/api/workitem'

export const queryResultDetails = async params => {
  return await request(`${url}/ResultDetails`, {
    method: 'GET',
    body: { visitFK: params.visitId },
  })
}
