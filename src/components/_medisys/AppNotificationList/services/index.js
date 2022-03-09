import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ApplicationNotification'

const exportFns = {
  query: params =>  service.query(url, params),
  upsert: params => service.upsert(url, params),
}

export default exportFns
