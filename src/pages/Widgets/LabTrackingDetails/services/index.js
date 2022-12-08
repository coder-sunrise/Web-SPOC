import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ExternalTracking'

const fns = {
  queryList: params => service.queryList(url, params),
  query: params => service.query(url, params),
  upsert: params => service.upsert(url, params),
}

export default fns
