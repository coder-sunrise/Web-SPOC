import request from '@/utils/request'

const url = '/api/System/GetLatestVersionRepository'

export const getSystemVersion = () => request(url, { method: 'GET' }, false)
