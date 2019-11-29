import { stringify } from 'qs'
import request from '@/utils/request'
import { string } from 'prop-types'

const FORM_DATA = {
  grant_type: 'password', // refresh_token for refresh token
  client_id: 'SEMRWebApp',
  scope: 'offline_access',
  client_secret: process.env.client_secret,
}

const REFRESH_FORM_DATA = {
  ...FORM_DATA,
  grant_type: 'refresh_token',
}

const getTokenURL = '/connect/token'
export async function login (credential) {
  const requestBody = {
    ...FORM_DATA,
    ...credential,
  }

  const response = await request(
    getTokenURL,
    {
      method: 'POST',
      data: stringify(requestBody),
      contentType: 'application/x-www-form-urlencoded',
    },
    false,
  )
  return response
}

export const refresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  const clinicCode = localStorage.getItem('clinicCode')
  const requestBody = {
    ...REFRESH_FORM_DATA,
    refresh_token: refreshToken,
    clinicCode,
  }
  const response = await request(
    getTokenURL,
    {
      method: 'POST',
      data: stringify(requestBody),
      contentType: 'application/x-www-form-urlencoded',
    },
    false,
  )
  return response
}
