import * as service from '@/services/common'
import { convertToQuery } from '@/utils/utils'
import request from '@/utils/request'

const url = '/api/SMSReminder'

module.exports = {
  querySMSData: async (params, smsType) => {
    const parsedParams = convertToQuery({
      pagesize: 10,
      current: 1,
      ...params,
    })
    const data = await request(`${url}/${smsType}`, {
      method: 'GET',
      data: parsedParams,
    })

    return data
  },
  query: (params) => {
    return service.query(url, params)
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
