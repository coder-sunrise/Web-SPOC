import * as service from '@/services/common'

const url = '/api/patientdashboard'

const fns = {
  remove: params => service.remove(url, params),
  query: params => {
    return service.query(url, params)
  },
  upsert: params => {
    return service.upsert(url, params)
  },
}

export default fns
