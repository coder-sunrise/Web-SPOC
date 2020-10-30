import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ctfolder'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  upsertList: (params) => {
    return request(`${url}/list`, {
      method: 'PUT',
      body: params,
    })
  },
}
