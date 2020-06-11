import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/forms'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  saveForm: async (userId, params) => {
    const r = await request(`${url}/saveform/${userId}`, {
      method: 'PUT',
      body: params,
    })
    return r
  },

  getVisitForm: async (params) => {
    const r = await request(
      `${url}/VisitForm/${params.id}/${params.formType}`,
      {
        method: 'GET',
        // body: params,
      },
    )
    return r
  },

  query: (params) => service.query(url, params),
}
