import { stringify } from 'qs'
import request from '@/utils/request'

const FORM_DATA = {
  grant_type: 'password',
  client_id: 'SEMRWebApp',
  client_secret:
    '20e392d2ea9bfa76f2a9cb26c31a34d675ad81281a31f89ed5d572de8da0b9e7',
  scope: 'offline_access',
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
