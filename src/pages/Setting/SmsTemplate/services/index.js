import * as service from '@/services/common'

const getUrl = () => {

  const url = '/api/smstemplate'
   

  return url
}
module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(getUrl(), params),
  upsert: (params) => service.upsert(getUrl(), params),
}
