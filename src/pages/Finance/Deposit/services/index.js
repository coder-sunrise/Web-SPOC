import * as service from '@/services/common'

const url = '/api/invoice'
const bizSessionUrl = '/api/bizSession'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  query: (params) => service.query(bizSessionUrl, params),
  queryBizSession: (params) => service.queryList(bizSessionUrl, params),
}
