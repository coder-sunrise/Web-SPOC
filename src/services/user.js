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

export const getOTP = (payload) =>
  request(`${userProfileURL}/generateResetPasswordCode`, {
    method: 'PUT',
    body: payload,
  })

export const resetPassword = (payload) =>
  request(`${userProfileURL}/ResetPassword`, {
    method: 'PUT',
    body: payload,
  })
