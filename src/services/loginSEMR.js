import request, { baseUrl } from '@/utils/request'
import { stringify } from 'qs'
import axios from 'axios'

const CONFIG = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}

const FORM_DATA = {
  grant_type: 'password',
  client_id: 'SEMRWebApp',
  client_secret:
    '20e392d2ea9bfa76f2a9cb26c31a34d675ad81281a31f89ed5d572de8da0b9e7',
  scope: 'offline_access',
}

export async function login (credential) {
  const getTokenURL = baseUrl + '/connect/token'
  // const getTokenURL = 'http://semr2dev2010.emr.com.sg/connect/token'
  //
  const requestBody = {
    ...FORM_DATA,
    ...credential,
  }
  const response = await axios
    .post(getTokenURL, stringify(requestBody), CONFIG)
    .catch((error) => {
      return error.response
    })
  return response
}
