import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ApplicationNotification'

const exportFns = {
  queryList: params => service.queryList(url, params),
  readNotifications: params => {
    return request(`${url}/ReadNotifications`, {
      method: 'PUT',
      body: params,
    })
  },
  queryOfCurrentUser: params =>
    service.query(`${url}/GetAllOfCurrentUser`, params),
  upsert: params => service.upsert(url, params),
}

export default exportFns
