import * as service from '@/services/common'

const url = '/api/medicalCheckupWorklist'

const fns = {
  query: params => service.query(url, { ...params, pagesize: 9999 }),
  queryList: params => service.queryList(url, { ...params, pagesize: 9999 }),
  upsert: params => service.upsert(url, params),
  queryIndividualCommentHistory: params =>
    service.queryList(`${url}/IndividualCommentHistory`, {
      ...params,
      pagesize: 9999,
    }),
  querySummaryCommentHistory: params =>
    service.queryList(`${url}/SummaryCommentHistory`, {
      ...params,
      pagesize: 9999,
    }),
}
export default fns
