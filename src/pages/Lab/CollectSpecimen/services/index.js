import * as service from '@/services/common'

const url = '/api/specimenCollection'
const queryVisitLabWorkitemsUrl = `${url}/getLabWorkitemsByVisitId`
const labSpecimenUrl = '/api/labSpecimen'

const fns = {
  query: params => service.query(url, params),
  queryVisitLabWorkitems: params =>
    service.query(queryVisitLabWorkitemsUrl, params),
  upsertSpecimen: params => service.upsert(labSpecimenUrl, params),
}
export default fns
