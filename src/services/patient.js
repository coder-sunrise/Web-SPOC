// import { stringify } from 'qs'
// import request from '@/utils/request'
// import { convertToQuery } from '@/utils/utils'

// export async function queryList (params) {
//   console.log('queryList', convertToQuery(params))
//   const response = await request(`/api/patient`, {
//     method: 'GET',
//     data: convertToQuery(params),
//   })

//   return response
// }
import * as service from '@/services/common'
import { convertToQuery } from '@/utils/utils'
import request from '@/utils/request'

const url = '/api/patient'

// const { api } = config
// const { url, subjects, getListWithoutCheckRights } = api

module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => service.query(url, params),
  create: (params) => service.create(url, params),
  update: (params) => service.update(url, params),
  upsert: (params) => service.upsert(url, params),
}
