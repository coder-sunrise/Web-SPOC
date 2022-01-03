import * as service from '@/services/common'

const url = '/api/specimenCollection'
const queryVisitLabWorkitemsUrl = `${url}/getLabWorkitemsByVisitId`

const fns = {
  query: params => service.query(url, params),
  queryVisitLabWorkitems: params => {
    console.log('queryVisitLabWorkitems - params : ', params)
    return service.query(queryVisitLabWorkitemsUrl, params)
  },
}
export default fns
