// import { stringify } from 'qs'
// import request from '@/utils/request'

// export async function queryList (params) {
//   const entities = await request(`/api/fake_list?${stringify(params)}`)
//   return {
//     data: {
//       entities,
//       filter: {},
//     },
//   }
// }

import * as service from '@/services/common'
import { convertToQuery } from '@/utils/utils'
import request from '@/utils/request'

const url = '/api/stockdrug'

// const { api } = config
// const { url, subjects, getListWithoutCheckRights } = api

module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => service.query(url, params),
  create: (params) => service.create(url, params),
  update: (params) => service.update(url, params),
}
