import * as service from '@/services/common'

const url = '/api/appointment'

const fns = {
  queryList: async params => {
    const result = await service.queryList(url, params)
    return {
      ...result,
      data: {
        ...result.data,
        data: [
          ...result.data.data.map(item => ({
            ...item,
            appointment_Resources: JSON.parse(item.appointment_Resources) || [],
            preOrder: JSON.parse(item.preOrder) || [],
          })),
        ],
      },
    }
  },

  upsert: params => service.upsert(url, params),
  saveFilterTemplate: (userId, params) =>
    service.upsert(`${url}/SaveAppointmentFilter/${userId}`, params),
  getFilterTemplate: params =>
    service.queryList(`${url}/GetAppointmentFilterByCurrentUser`, params),
}
export default fns
