import * as service from '@/services/common'

const url = '/api/PatientHistory'

module.exports = {
  // remove: (params) => service.remove(url, params),
  queryList: (params) => {
    return service.queryList(url, { ...params, pagesize: 9999 })
  },
  query: (params) => {
    return service.query(url, params)
  },

  queryRetailHistory: (params) => {
    return service.query(`${url}/Retail`, params)
  },
  // upsert: (params) => {
  //   return service.upsert(url, params)
  // },
}
