import { stringify } from 'qs'
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
  request(`${userProfileURL}/ChangePassworByUserId`, {
    method: 'PUT',
    body: payload,
  })

export const getOTP = async (payload) =>
  request(`${userProfileURL}/generateResetPasswordCode`, {
    method: 'POST',
    data: stringify(payload),
    contentType: 'application/x-www-form-urlencoded',
  })

export const resetPassword = (payload) =>
  request(`${userProfileURL}/ResetPassword`, {
    method: 'POST',
    data: stringify(payload),
    contentType: 'application/x-www-form-urlencoded',
  })
