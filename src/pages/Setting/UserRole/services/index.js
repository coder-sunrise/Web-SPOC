import * as service from '@/services/common'
import request from '@/utils/request'

const apiURL = '/api/role'

export const getRoles = () => service.queryList(apiURL, { pagesize: 999 })

export const getRoleByID = (id) => request(`${apiURL}/${id}`, { method: 'GET' })
