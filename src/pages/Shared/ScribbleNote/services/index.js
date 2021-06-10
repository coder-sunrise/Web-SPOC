import * as service from '@/services/common'

const url = '/api/Consultation/ScribbleNote'

const templateUrl = '/api/CTScribbleNoteTemplate'

const fns = {
  remove: params => service.remove(url, params),
  query: params => {
    return service.query(url, params)
  },
  upsert: params => {
    return service.upsert(url, params)
  },

  queryTemplateList: params => service.queryList(templateUrl, params),
}
export default fns
