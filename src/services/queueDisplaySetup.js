import * as service from '@/services/common'

const url = '/api/KeyValueStore'
const fns = {
  query: params => service.query(url, params),
  upsert: params => service.upsert(url, params),
  getStatus: params => service.query(`${url}/Status`, params),
}
export default fns
