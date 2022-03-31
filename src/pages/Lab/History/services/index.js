import * as service from '@/services/common'

const url = '/api/LabWorklist/worklistHistory'

const fns = {
  query: params => service.query(url, { ...params, pagesize: 9999 }),
  queryList: params => service.queryList(url, { ...params, pagesize: 20 }),
}
export default fns
