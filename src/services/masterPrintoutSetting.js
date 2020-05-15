import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/MasterReportSetting'

module.exports = {
  query: (params) => {
    return service.query(url, params)
  },
  upsert: async (params) => service.upsert(url, params),
}