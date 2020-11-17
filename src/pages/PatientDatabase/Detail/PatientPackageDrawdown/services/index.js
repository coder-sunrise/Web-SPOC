import request from '@/utils/request'
import * as commonService from '@/services/common'

const url = '/api/patientPackage'

export const getPatientPackageDrawdown = (params) => commonService.query(url, params)

export const savePatientPackage = (payload) => {
  const { patientId } = payload
  return request(`${url}/${patientId}`, { method: 'PUT', body: payload })
}

