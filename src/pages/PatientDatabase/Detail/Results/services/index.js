import * as service from '@/services/common'

const url = '/api/patientResult'

const fns = {
  queryBasicDataList: params =>
    service.queryList(`${url}/basicHistory`, params),
}
export default fns
