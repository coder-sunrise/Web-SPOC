import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ReceivingGoods'

const fns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  queryById: params => service.query(url, params),
  unlockReceivingGoods: async params => {
    let r = await request(`${url}/Unlock/${params.id}`, {
      method: 'PUT',
      body: params,
    })
    return r
  },
  writeOffReceivingGoods: async params => {
    let r = await request(`${url}/WriteOff`, {
      method: 'PUT',
      body: params,
    })
    return r
  },
}
export default fns
