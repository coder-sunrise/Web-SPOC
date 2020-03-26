import * as service from '@/services/common'

const url = '/api/KeyValueStore'

module.exports = {
  query: (params) => service.query(url, params),
  upsert: (params) => service.upsert(url, params),
  getStatus: (params) => service.query(`${url}/Status`, params),
}
