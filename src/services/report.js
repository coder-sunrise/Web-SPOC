import { stringify } from 'qs'
import request, { baseUrl, axiosRequest } from '@/utils/request'
import { convertToQuery } from '@/utils/utils'
// static data
// import { QueueListingDummyData } from '@/pages/Report/dummyData'

export const getRawData = async (reportID, payload) => {
  const baseRawDataURL = '/api/reports/datas'
  return request(`${baseRawDataURL}/${reportID}`, {
    method: 'GET',
    body: { reportParameters: JSON.stringify({ ...payload }) },
  })
}

export const getPDF = async (reportID, payload) => {
  const baseURL = '/api/reports'
  return request(`${baseURL}/${reportID}`, {
    method: 'GET',
    xhrFields: {
      responseType: 'arraybuffer',
    },
    body: stringify({
      reportFormat: 'Pdf',
      reportParameters: JSON.stringify({ ...payload }),
    }),
  })
}

export const getExcel = async (reportID, payload) => {
  const baseURL = '/api/reports'
  return request(`${baseURL}/${reportID}`, {
    method: 'GET',
    xhrFields: {
      responseType: 'arraybuffer',
    },
    body: stringify({
      reportFormat: 'Excel',
      reportParameters: JSON.stringify({ ...payload }),
    }),
  })
}

export const getPatientListingReport = async (payload) => {
  /* use this when API is ready to return raw data */
  const url = '/api/reports/2'
  return request(url, {
    method: 'GET',
    body: convertToQuery({ reportParameters: payload }, [
      'reportParameters',
    ]),
  })
}

export const postPDF = async (reportID, payload) => {
  const baseURL = '/api/reports'
  var response = request(`${baseURL}/${reportID}`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    xhrFields: {
      responseType: 'arraybuffer',
    },
    data: {
      reportContent: JSON.stringify(
        payload,
      ),
    },
  })
  return response
}