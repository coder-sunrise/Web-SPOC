import * as service from '@/services/common'

const url = '/api/appointment'

const fns = {
  queryList: params => service.queryList(url, params),

  upsert: params => service.upsert(url, params),
  saveFilterTemplate: (userId, params) =>
    service.upsert(`${url}/SaveAppointmentFilter/${userId}`, params),
  getFilterTemplate: params =>
    service.queryList(`${url}/GetAppointmentFilterByCurrentUser`, params),
}
export default fns
