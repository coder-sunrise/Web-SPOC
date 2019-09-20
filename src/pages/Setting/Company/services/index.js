import * as service from '@/services/common'
import request from '@/utils/request'

const urlCoyer = '/api/ctcopayer'
const urlSupplier = '/api/ctsupplier'
module.exports = {
  upsertCop: (params) => service.upsert(urlCoyer, params),
  queryList: (params) => {
    const { companyTypeFK, ...restParams } = params
    if (companyTypeFK === 1) {
      return service.queryList(urlCoyer, restParams)
    }
    return service.queryList(urlSupplier, restParams)
  },
  upsertSup: (params) => service.upsert(urlSupplier, params),
}
