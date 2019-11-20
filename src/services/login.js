import { stringify } from 'qs'
import request from '@/utils/request'

const FORM_DATA = {
  grant_type: 'password', // refresh_token for refresh token
  client_id: 'SEMRWebApp',
  scope: 'offline_access',
  client_secret: process.env.client_secret,
}

export async function login (credential) {
  const getTokenURL = '/connect/token'
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
