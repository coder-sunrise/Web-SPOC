import { stringify } from 'qs'
import request, { download, baseUrl, axiosRequest } from '@/utils/request'
import { convertToQuery } from '@/utils/utils'
import { REPORT_TYPE } from '@/utils/constants'
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

export const getUnsavedPDF = async (reportID, payload) => {
  const baseURL = '/api/reports'
  return request(`${baseURL}/${reportID}`, {
    method: 'POST',
    xhrFields: {
      responseType: 'arraybuffer',
      contentType: 'application/x-www-form-urlencoded',
    },
    body: stringify({
      reportFormat: 'Pdf',
      reportContent: JSON.stringify({ ...payload }),
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

export const exportPdfReport = async (reportID, payload) => {
  const baseURL = '/api/report'
  return download(
    `${baseURL}/${reportID}?ReportFormat=pdf&ReportParameters={${payload}}`,
    { subject: REPORT_TYPE[reportID] || 'Report', type: 'pdf' },
  )
}

export const exportExcelReport = async (reportID, payload) => {
  const baseURL = '/api/report'
  return download(
    `${baseURL}/${reportID}?ReportFormat=excel&ReportParameters={${payload}}`,
    { subject: REPORT_TYPE[reportID] || 'Report', type: 'xls' },
  )
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
      reportContent: JSON.stringify(payload),
    },
  })
  return response
}
