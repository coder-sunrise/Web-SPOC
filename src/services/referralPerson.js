import * as service from '@/services/common'
import { axiosRequest } from '@/utils/request'

const url = '/api/referralperson'

const fns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  queryReferralSourceList: params =>
    service.queryList(`/api/ReferralSource`, params),
}
export default fns
