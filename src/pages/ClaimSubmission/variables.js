import moment from 'moment'
import { dateFormat } from '@/components'

export const SchemeType = [
  {
    value: 'chas',
    name: 'CHAS',
    id: 1,
  },
  // {
  //   value: 'medisave',
  //   name: 'MEDISAVE',
  //   id: 2,
  // },
]

export const FakeDataInvoiceClaimCount = [
  {
    schemeType: 'CHAS',
    status: 'ACTIVE',
    count: 99,
  },
  {
    schemeType: 'Medisave',
    status: 'ACTIVE',
    count: 9,
  },
]

export const FakeDataClaimSubmissionCHAS = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      // visitDate: moment().formatUTC({ dateFormatLong }),
      visitDate: moment().formatUTC({ dateFormat }),
      patientAccountNo: 'S1234567D',
      patientName: 'Tan Kok Wei',
      visitDoctorName: 'Dr Levine',
      diagnosis: 'Asthma',
      schemeType: 'CHAS Blue',
      schemeCategory: 'Chronic',
      invoiceNo: `INV/0000${i}`,
      invoiceDate: moment().formatUTC({ dateFormat }),
      invoiceAmount: 100,
      claimAmount: 80,
      rejectionReason: '',
    })
  }
  return data
}

export const FakeDataQueryById = () => {
  const data = {
    claimReference: 'string',
    hm: 'string',
    invoiceFK: 0,
    invoicePayerFK: 0,
    patientProfileFK: 0,
    visitDoctorProfileFK: 0,
    copaymentSchemeFK: 0,
    patientSchemePayerFK: 0,
    chasRemarkCodeFK: 0,
    patientAccountNoType: 'string',
    patientAccountNo: 'string',
    patientName: 'string',
    nationality: 'string',
    gender: 'string',
    race: 'string',
    patientDob: '2019-10-01T08:21:46.164Z',
    blockNo: 'string',
    unitNo: 'string',
    buildingName: 'string',
    street: 'string',
    postalCode: 'string',
    payerName: 'string',
    payerAccountNo: 'string',
    payerDob: '2019-10-01T08:21:46.164Z',
    relationship: 'string',
    heCode: 'string',
    hospitalCode: 'string',
    acra: 'string',
    visitDate: '2019-10-01T08:21:46.164Z',
    schemeCode: 'string',
    schemeType: 'string',
    schemeCategory: 'string',
    visitDoctorMCRNo: 'string',
    visitDoctorNRICNo: 'string',
    primaryClinicianMCR: 'string',
    invoiceNo: 'string',
    tier: 'string',
    invoiceAmt: 0,
    claimAmt: 0,
    approvedAmt: 0,
    consultationAmt: 0,
    investigationAmt: 0,
    prescriptionAmt: 0,
    otherAmt: 0,
    chasAmount: 0,
    claimRemarks: 'string',
    submissionDate: '2019-10-01T08:21:46.164Z',
    approvalDate: '2019-10-01T08:21:46.164Z',
    rejectionDate: '2019-10-01T08:21:46.164Z',
    status: 'string',
    chasClaimStatusCode: 'string',
    responseStatusCode: 'string',
    id: 0,
    isDeleted: true,
    concurrencyToken: 0,
  }
  return data
}
