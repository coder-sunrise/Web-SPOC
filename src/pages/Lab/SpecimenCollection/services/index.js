import * as service from '@/services/common'

const url = '/api/specimenCollection'
const queryVisitSpecimenCollection = `${url}/getVisitSpecimenCollection`

const fns = {
  query: params => service.query(url, params),
  queryList: params => service.queryList(url, params),
  queryLabSpecimenById: params => service.query(url, params),
  queryVisitSpecimenCollection: params =>
    service.query(queryVisitSpecimenCollection, params),
  upsert: params => service.upsert(url, params),
  ack: params => service.upsert(`${url}/ack`, params),
}
export default fns
