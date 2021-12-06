import * as service from '@/services/common'

const url = '/api/pharmacyWorklist'

const fns = {
  query: params => service.query(url, params),
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  queryJournalHistoryList: params =>
    service.queryList(`${url}/GetJournalHistory`, params),
  queryLeafletDrugList: params =>
    service.query(`${url}/GetLeaftletDrugs`, params),
}
export default fns
