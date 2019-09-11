import { stringify } from 'qs'
import request from '@/utils/request'
import { convertToQuery } from '@/utils/utils'
// static data
import { QueueListingDummyData } from '@/pages/Report/dummyData'

export const getQueueListingData = async (payload) => {
  /* use this when API is ready to return raw data */
  // const url = '/api/reports/1'
  // return request(url, {
  //   method: 'GET',
  //   body: convertToQuery({ reportParameters: payload }, [
  //     'reportParameters',
  //   ]),
  // })

  /* static mock data, for testing only */
  return {
    VisitListingDetails: QueueListingDummyData.VisitListingDetails.map(
      (row, index) => ({
        ...row,
        id: `queueListingReport-${index}`,
      }),
    ),
    InvoicePayerDetails: QueueListingDummyData.InvoicePayerDetail.map(
      (row, index) => ({
        ...row,
        id: `invoicePayerDetails-${index}`,
      }),
    ),
  }
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
