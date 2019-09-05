import request from '@/utils/request'

const userProfileURL = '/api/UserProfile'

export async function query () {
  return request('/api/users')
}

export async function queryCurrent () {
  return request('/api/userprofile/current')
}

export const changeCurrentUserPassword = (payload) =>
  request(`${userProfileURL}/ChangeCurrentUserPassword`, {
    method: 'PUT',
    body: payload,
  })

export const changeUserPassword = (payload) =>
  request(`${userProfileURL}`, {
    method: 'PUT',
    body: payload,
  })
