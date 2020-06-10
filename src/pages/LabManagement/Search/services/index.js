import { stringify } from 'qs'
import request from '@/utils/request'

export async function queryList (params) {
  const entities = await request(`/api/fake_list?${stringify(params)}`)
  return {
    data: {
      entities,
      filter: {},
    },
  }
}
