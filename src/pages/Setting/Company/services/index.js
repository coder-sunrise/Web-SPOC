import * as service from '@/services/common'

const urlCopayer = '/api/ctcopayer'
const urlSupplier = '/api/ctsupplier'
const urlManufacturer = '/api/ctmanufacturer'
const fns = {
  upsertCop: params => service.upsert(urlCopayer, params),
  queryList: params => {
    const { companyTypeFK, ...restParams } = params
    if (companyTypeFK === 1) {
      return service.queryList(urlCopayer, restParams)
    }
    if (companyTypeFK === 2) {
      return service.queryList(urlSupplier, restParams)
    }
    if (companyTypeFK === 3) {
      return service.queryList(urlManufacturer, restParams)
    }
  },
  upsert: ({ companyTypeFK, ...restParams }) =>
    service.upsert(
      companyTypeFK === 1
        ? urlCopayer
        : companyTypeFK === 2
        ? urlSupplier
        : urlManufacturer,
      restParams,
    ),
  queryOne: params => {
    return service.query(urlCopayer, params)
  },
}

export default fns
