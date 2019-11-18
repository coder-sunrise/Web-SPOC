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
    console.log({ restParams, params })
    return service.queryList(urlSupplier, restParams)
  },
  upsert: ({ companyTypeFK, ...restParams }) =>
    service.upsert(companyTypeFK === 1 ? urlCoyer : urlSupplier, restParams),
  // upsertSup: (params) => service.upsert(urlSupplier, params),
}
