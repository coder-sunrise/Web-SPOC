import * as service from '@/services/common'

const url = '/api/radiologyWorklistHistory'

const fns = {
  query: params => service.query(url, params),
  queryList: params => service.queryList(url, params),
}
export default fns
