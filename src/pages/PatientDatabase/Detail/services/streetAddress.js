import * as service from '@/services/common'

const url = '/api/patient'
const streetAddressUrl = '/api/streetaddress'

module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => {
  //   console.log(1)
  //   return service.query(url, params)
  // },
  // upsert: (params) => {
  //   return service.upsert(url, params)
  // },

  queryList: (params) => service.queryList(streetAddressUrl, params),
  // query: (params) => service.query(streetAddressUrl, params),
}
