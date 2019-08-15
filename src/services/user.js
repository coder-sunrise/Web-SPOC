import request from '@/utils/request'

export async function query () {
  return request('/api/users')
}

export async function queryCurrent () {
  return request('/api/clinicianProfile/current')
  // return request('/api/UserProfile/Current')
}
