import * as service from '@/services/common'

const url = '/api/PatientAttachment'

module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
  queryList: (params) =>
    service.queryList(url, {
      ...params,
      sorting: [
        { columnName: 'sortOrder', direction: 'asc' },
      ],
    }),
  upsert: (params) => service.upsert(url, params),
  remove: (params) => service.remove(url, params),
}
