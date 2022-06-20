import * as service from '@/services/common'

const url = '/api/ScribbleNote'

const templateUrl = '/api/CTScribbleNoteTemplate'

const fns = {
  remove: params => service.remove(url, params),
  query: params => {
    return service.query(url, params)
  },
  upsert: params => {
    return service.upsert(url, params)
  },
  queryTemplate: params => {
    return service.query(templateUrl, params)
  },
  queryTemplateList: params => service.queryList(templateUrl, params),
  upsertTemplate: params => service.upsert(templateUrl, params),
}
export default fns
