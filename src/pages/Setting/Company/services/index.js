import * as service from '@/services/common'

const urlCoyer = '/api/ctcopayer'
const urlSupplier = '/api/ctsupplier'
const fns = {
  upsertCop: params => service.upsert(urlCoyer, params),
  queryList: params => {
    const { companyTypeFK, ...restParams } = params
    if (companyTypeFK === 1) {
      return service.queryList(urlCoyer, restParams)
    }
    return service.queryList(urlSupplier, restParams)
  },
  upsert: ({ companyTypeFK, ...restParams }) =>
    service.upsert(companyTypeFK === 1 ? urlCoyer : urlSupplier, restParams),
}

export default fns
