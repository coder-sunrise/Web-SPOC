import * as service from '@/services/common'
import request from '@/utils/request'

const urlCoyer = '/api/ctcopayer'
const urlSupplier = '/api/ctsupplier'
module.exports = {
  queryListCop: (params) => service.queryList(urlCoyer, params),
  upsertCop: (params) => service.upsert(urlCoyer, params),

  queryListSup: (params) => service.queryList(urlSupplier, params),
  upsertSup: (params) => service.upsert(urlSupplier, params),
}
