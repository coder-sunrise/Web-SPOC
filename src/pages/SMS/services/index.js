import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/SMSReminder'
const appointmentUrl = '/api/SMSReminder/appointment'
const patientUrl = '/api/SMSReminder/patient'
const smsHistoryUrl = '/api/SMSReminder/smshistory'

module.exports = {
  querySMSHistory: (params) => service.queryList(smsHistoryUrl, params),

  queryList: (params) => {
    const { smsType, ...restParams } = params
    console.log({ smsType })
    return service.queryList(
      smsType === 'Appointment' ? appointmentUrl : patientUrl,
      restParams,
    )
  },

  upsert: async (params) => {
    const r = await request(url, {
      method: 'POST',
      body: [
        ...params,
      ],
    })
    return r
  },
}
