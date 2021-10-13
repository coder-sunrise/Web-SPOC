import * as service from '@/services/common'

const urlCopayer = '/api/ctcopayer'
const urlSupplier = '/api/ctsupplier'
const fns = {
  upsertCop: params => service.upsert(urlCopayer, params),
  queryList: params => {
    const { companyTypeFK, ...restParams } = params
    if (companyTypeFK === 1) {
      return service.queryList(urlCopayer, restParams)
    }
    return service.queryList(urlSupplier, restParams)
  },
  upsert: ({ companyTypeFK, ...restParams }) =>
    service.upsert(companyTypeFK === 1 ? urlCopayer : urlSupplier, restParams),
  queryOne: params => {
      return service.query(urlCopayer, params)
    },
}

export default fns
