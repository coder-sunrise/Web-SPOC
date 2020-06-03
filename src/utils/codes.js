import moment from 'moment'
import _ from 'lodash'
import Authorized from '@/utils/Authorized'
import { dateFormatLong, dateFormatLongWithTime } from './format'
import { UNFIT_TYPE, SCRIBBLE_NOTE_TYPE } from './constants'
import { calculateAgeFromDOB } from './dateUtils'

const status = [
  {
    value: false,
    name: 'Inactive',
    render: () => <span style={{ color: 'red' }}>Inactive</span>,
  },
  {
    value: true,
    name: 'Active',
    render: () => <span style={{ color: 'green' }}>Active</span>,
  },
]

const approvedStatus = [
  {
    value: 'AP',
    name: 'Approved',
    render: () => <span>Approved</span>,
  },
  {
    value: 'EP',
    name: 'Extracted to Payment Process',
    render: () => <span>Extracted to Payment Process</span>,
  },
  {
    value: 'PD',
    name: 'Paid',
    render: () => <span>Paid</span>,
  },
  {
    value: 'RV',
    name: 'Recovery Pending',
    render: () => <span>Recovery Pending</span>,
  },
  {
    value: 'RV2',
    name: 'Recovery Extracted',
    render: () => <span>Recovery Extracted</span>,
  },
  {
    value: 'RV3',
    name: 'Recovered',
    render: () => <span>Recovered</span>,
  },
]
const claimStatus = [
  {
    value: 'SU',
    name: 'Submitted',
    render: () => <span>Submitted</span>,
  },
  ...approvedStatus,
  {
    value: 'RJ',
    name: 'Rejected',
    render: () => <span>Rejected</span>,
  },
  {
    value: 'AE',
    name: 'Appealed',
    render: () => <span>Rejected</span>,
  },
  {
    value: 'PR',
    name: 'Pending for Screening Report',
    render: () => <span>Pending for Screening Report</span>,
  },
  {
    value: 'PBA',
    name: 'Pending Batch Approval',
    render: () => <span>Pending Batch Approval</span>,
  },
  {
    value: 'DF',
    name: 'Draft',
    render: () => <span>Draft</span>,
  },
  {
    value: 'OH',
    name: 'OnHold',
    render: () => <span>On-Hold</span>,
  },
  {
    value: 'CA',
    name: 'Cancellation Submitted',
    render: () => <span>Cancellation Submitted</span>,
  },
  {
    value: 'CA2',
    name: 'Cancellation Extracted',
    render: () => <span>Cancellation Extracted</span>,
  },
  {
    value: 'CA3',
    name: 'Cancelled',
    render: () => <span>Cancelled</span>,
  },
]
const chasSchemeTypes = [
  { code: 'CHASGREEN', displayValue: 'CHAS Green' },
  { code: 'CHASBLUE', displayValue: 'CHAS Blue' },
  { code: 'CHASORANGE', displayValue: 'CHAS Orange' },
  { code: 'CHASMG', displayValue: 'CHAS MG (Merdeka Generation)' },
  { code: 'CHASPG', displayValue: 'CHAS PG (Pioneer Generation)' },
  { code: 'CHASPA', displayValue: 'CHAS PA (Public Assistance)' },
  { code: 'PHPCCHILD', displayValue: 'PHPC Child' },
  { code: 'PGPCADULT', displayValue: 'PHPC Adult' },
  { code: 'PHPCSELF', displayValue: 'PHPC Self' },
  { code: 'PHPCMFAC', displayValue: 'PHPC MFAC' },
  { code: 'PHPCMFEC', displayValue: 'PHPC MFEC' },
]
const statusString = [
  {
    value: 'Inactive',
    name: 'Inactive',
    render: () => <span style={{ color: 'red' }}>Inactive</span>,
  },
  {
    value: 'Active',
    name: 'Active',
    render: () => <span style={{ color: 'green' }}>Active</span>,
  },
]

const isAutoOrder = [
  { value: false, name: 'No' },
  { value: true, name: 'Yes' },
]

const osBalanceStatus = [
  { value: 'all', name: 'All(Yes/No)', color: 'all' },
  { value: 'yes', name: 'Yes', color: 'yes' },
  { value: 'no', name: 'No', color: 'no' },
]

const sessionOptions = [
  { value: 'all', name: 'All Sessions' },
  { value: 'current', name: 'Current Session' },
  { value: 'past', name: 'Past Session' },
]

const smsStatus = [
  {
    name: 'Sent',
    value: 1,
  },
  {
    name: 'Failed',
    value: 2,
  },
]

const messageStatus = [
  {
    name: 'Read',
    value: 'Read',
  },
  {
    name: 'Unread',
    value: 'Unread',
  },
]

const appointmentStatus = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'Draft',
    value: 2,
  },
  {
    name: 'Scheduled',
    value: 1,
  },
  {
    name: 'Rescheduled',
    value: 5,
  },
]

const appointmentStatusReception = [
  {
    name: 'Scheduled',
    value: 1,
  },
  {
    name: 'Draft',
    value: 2,
  },
  {
    name: 'Cancelled',
    value: 3,
  },
  {
    name: 'Turned Up',
    value: 4,
  },
  {
    name: 'Rescheduled',
    value: 5,
  },
  {
    name: 'No Show',
    value: 6,
  },
]

const gstEnabled = [
  { value: false, name: 'No' },
  { value: true, name: 'Yes' },
]

const addressTypes = [
  { label: 'Mailing Address', value: '1' },
  { label: 'Primary Address', value: '2' },
]

const currencyRoundingList = [
  {
    name: 'Up',
    value: 'Up',
  },
  {
    name: 'Down',
    value: 'Down',
  },
]

const currencyRoundingToTheClosestList = [
  {
    name: '5 Cents',
    value: '0.05',
  },
  {
    name: '10 Cents',
    value: '0.10',
  },
  {
    name: '50 Cents',
    value: '0.50',
  },
  {
    name: '1 Dollars',
    value: '1',
  },
]

const currenciesList = [
  {
    value: 'Singapore',
    name: 'Singapore (S$)',
  },
  {
    value: 'United States',
    name: 'US Dollar ($)',
  },
  {
    value: 'Malaysia',
    name: 'Malaysia Ringgit (MYR)',
  },
]

const coPayerType = [
  {
    value: 'corporate',
    name: 'Corporate',
  },
  {
    value: 'government',
    name: 'Government',
  },
]

const consultationDocumentTypes = [
  {
    value: '5',
    name: 'Medical Certificate',
    prop: 'corMedicalCertificate',
    getSubject: (r) => {
      return `${moment(r.mcStartDate).format(dateFormatLong)} - ${moment(
        r.mcEndDate,
      ).format(dateFormatLong)} - ${r.mcDays} Day${r.mcDays > 1 ? 's' : ''}`
    },
    convert: (r) => {
      return {
        ...r,
        mcStartEndDate: [
          moment(r.mcStartDate),
          moment(r.mcEndDate),
        ],
      }
    },
    downloadConfig: {
      id: 7,
      key: 'MedicalCertificateId',
      subject: 'Medical Certificate',
      draft: (row) => {
        return {
          MedicalCertificateDetails: [
            {
              ...row,
              unfitType: UNFIT_TYPE[row.unfitTypeFK],
              mcIssueDate: moment(row.mcIssueDate).format(dateFormatLong),
              mcStartDate: moment(row.mcStartDate).format(dateFormatLong),
              mcEndDate: moment(row.mcEndDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
  {
    value: '6',
    name: 'Certificate of Attendance',
    prop: 'corCertificateOfAttendance',
    getSubject: (r) => {
      return `Certificate of Attendance ${r.accompaniedBy}`
    },
    convert: (r) => {
      return {
        ...r,
        issueDate: moment(r.issueDate).format(dateFormatLong),
        // attendanceStartTime: moment(r.attendanceStartTime).format('HH:mm'),
        // attendanceEndTime: moment(r.attendanceEndTime).format('HH:mm'),
      }
    },
    downloadConfig: {
      id: 8,
      key: 'CertificateOfAttendanceId',
      subject: 'Certificate Of Attendance',
      draft: (row) => {
        return {
          CertificateOfAttendanceDetails: [
            {
              ...row,
              issueDate: moment(row.issueDate).format(dateFormatLong),
              attendanceStartTime: moment(row.attendanceStartTime).format(
                'hh:mm A',
              ),
              attendanceEndTime: moment(row.attendanceEndTime).format(
                'hh:mm A',
              ),
            },
          ],
        }
      },
    },
  },
  {
    value: '1',
    name: 'Referral Letter',
    prop: 'corReferralLetter',
    downloadConfig: {
      id: 9,
      key: 'ReferralLetterId',
      subject: 'Referral Letter',
      draft: (row) => {
        return {
          ReferralLetterDetails: [
            {
              ...row,
              referralDate: moment(row.referralDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
  {
    value: '2',
    name: 'Memo',
    prop: 'corMemo',
    downloadConfig: {
      id: 11,
      key: 'memoid',
      subject: 'Memo',
      draft: (row) => {
        return {
          MemoDetails: [
            {
              ...row,
              memoDate: moment(row.memoDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
  {
    value: '3',
    name: 'Vaccination Certificate',
    code: 'Vaccination Cert',
    prop: 'corVaccinationCert',
    downloadKey: 'vaccinationcertificateid',
    downloadConfig: {
      id: 10,
      key: 'vaccinationcertificateid',
      subject: 'Vaccination Certificate',
      draft: (row) => {
        return {
          VaccinationCertificateDetails: [
            {
              ...row,
              certificateDate: moment(row.certificateDate).format(
                dateFormatLong,
              ),
            },
          ],
        }
      },
    },
  },
  {
    value: '4',
    name: 'Others',
    prop: 'corOtherDocuments',
    downloadKey: 'documentid',
    downloadConfig: {
      id: 12,
      key: 'documentid',
      subject: 'Other Documents',
      draft: (row) => {
        return {
          DocumentDetails: [
            {
              ...row,
              issueDate: moment(row.issueDate).format(dateFormatLong),
            },
          ],
        }
      },
    },
  },
]

const buttonTypes = [
  'RegularButton',
  'IconButton',
  'Fab',
]

export const countryCodes = [
  { name: '+65 Singapore', value: '65' },
  { name: '+60 Malaysia', value: '60' },
  { name: '+62 Indonesia', value: '62' },
  { name: '+63 Philippines', value: '63' },
  { name: '+66 Thailand', value: '66' },
  { name: '+81 Japan', value: '81' },
]

// const localCodes = {}
// export async function getCodes (code) {
//   if (!localCodes[code]) {
//     const r = await request(`/api/CodeTable?ctnames=${code}`)

//     if (r.status === '200') {
//       // console.log(r)
//       localCodes[code] = r.data[code] || []
//     } else {
//       localCodes[code] = []
//     }
//   }
//   // console.log(localCodes[code])
//   return localCodes[code]
// }

export const podoOrderType = [
  {
    value: 1,
    name: 'Medication',
    prop: 'purchaseOrderMedicationItem',
    itemFKName: 'inventoryMedicationFK',
    ctName: 'inventorymedication',
    stateName: 'MedicationItemList',
    itemCode: 'inventoryMedicationCode',
    itemName: 'inventoryMedicationName',
    stockName: 'medicationStock',
  },
  {
    value: 2,
    name: 'Consumable',
    prop: 'purchaseOrderConsumableItem',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
    stateName: 'ConsumableItemList',
    itemCode: 'inventoryConsumableCode',
    itemName: 'inventoryConsumableName',
    stockName: 'consumableStock',
  },
  {
    value: 3,
    name: 'Vaccination',
    prop: 'purchaseOrderVaccinationItem',
    itemFKName: 'inventoryVaccinationFK',
    ctName: 'inventoryvaccination',
    stateName: 'VaccinationItemList',
    itemCode: 'inventoryVaccinationCode',
    itemName: 'inventoryVaccinationName',
    stockName: 'vaccinationStock',
  },
]

export const InventoryTypes = [
  {
    value: 1,
    name: 'Medication',
    prop: 'medicationValueDto',
    itemFKName: 'inventoryMedicationFK',
    ctName: 'inventorymedication',
    field: 'inventoryMedication',
  },
  {
    value: 2,
    name: 'Consumable',
    prop: 'consumableValueDto',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
    field: 'inventoryConsumable',
  },
  {
    value: 3,
    name: 'Vaccination',
    prop: 'vaccinationValueDto',
    itemFKName: 'inventoryVaccinationFK',
    ctName: 'inventoryvaccination',
    field: 'inventoryVaccination',
  },
  {
    value: 4,
    name: 'Service',
    prop: 'serviceValueDto',
    itemFKName: 'serviceCenterServiceFK',
    ctName: 'ctservice',
    field: 'service',
  },
  {
    value: 5,
    name: 'OrderSet',
    prop: 'orderSetValueDto',
    itemFKName: 'inventoryOrderSetFK',
    ctName: 'inventoryorderset',
  },
]

const tagList = [
  {
    value: 'PatientName',
    text: '<#PatientName#>',
    url: '',
    getter: () => {
      const { patient } = window.g_app._store.getState()
      if (patient && patient.entity) {
        return patient.entity.name
      }
      return 'N.A.'
    },
  },
  {
    value: 'AppointmentDateTime',
    text: '<#AppointmentDateTime#>',
    url: '',
    getter: () => {
      const { visitRegistration = {} } = window.g_app._store.getState()
      const { entity } = visitRegistration
      if (entity && entity.visit && entity.visit.appointmentDatetTime) {
        return moment(entity.visit.appointmentDatetTime).format(
          dateFormatLongWithTime,
        )
      }
      return 'N.A.'
    },
  },
  {
    value: 'Doctor',
    text: '<#Doctor#>',
    url: '',
    getter: () => {
      const { user } = window.g_app._store.getState()
      if (user && user.data && user.data.clinicianProfile) {
        const title = user.data.clinicianProfile.title
          ? `${user.data.clinicianProfile.title} `
          : ''

        return `${title}${user.data.clinicianProfile.name}`
      }
      return 'N.A.'
    },
  },
  {
    value: 'NewLine',
    text: '<#NewLine#>',
    url: '',
    getter: () => {
      return '<br/>'
    },
  },
  {
    value: 'PatientCallingName',
    text: '<#PatientCallingName#>',
    url: '',
    getter: () => {
      const { patient } = window.g_app._store.getState()
      if (patient && patient.entity) {
        return patient.entity.callingName
      }
      return 'N.A.'
    },
  },
  {
    value: 'LastVisitDate',
    text: '<#LastVisitDate#>',
    url: '',
    getter: () => {
      const { patient } = window.g_app._store.getState()
      if (patient && patient.entity && patient.entity.lastVisitDate) {
        return moment(patient.entity.lastVisitDate).format(
          dateFormatLongWithTime,
        )
      }
      return 'N.A.'
    },
  },
  {
    value: 'PatientInfo',
    text: '<#PatientInfo#>',
    url: '',
    getter: () => {
      const { patient, codetable } = window.g_app._store.getState()
      let result
      if (patient && patient.entity) {
        let patientGender = codetable.ctgender.find(
          (x) => x.id === patient.entity.genderFK,
        )
        let patientAllergy
        for (
          let index = 0;
          index < patient.entity.patientAllergy.length;
          index++
        ) {
          if (patient.entity.patientAllergy[index].type === 'Allergy')
            patientAllergy =
              (patientAllergy ? `${patientAllergy}, ` : '') +
              patient.entity.patientAllergy[index].allergyName
        }
        result = `<p>Patient Name: ${patient.entity.name}</p>`
        result += `<p>Patient Ref. No.: ${patient.entity
          .patientReferenceNo}</p>`
        result += `<p>Patient Acc. No.: ${patient.entity.patientAccountNo}</p>`
        result += `<p>Gender/Age: ${patientGender.name.substring(
          0,
          1,
        )}/${calculateAgeFromDOB(patient.entity.dob)}</p>`

        result += `<p>Drug Allergy: ${patientAllergy || 'NA'}</p>`
      }
      return result || 'N.A.'
    },
  },
]

export const getInventoryItem = (
  list,
  value,
  itemFKName,
  rows = [],
  outstandingItem = undefined,
) => {
  let newRows = rows.filter((x) => x.type === value && x.isDeleted === false)
  const groupByFKArray = _(newRows)
    .groupBy((x) => x[itemFKName])
    .map((v, key) => ({
      [itemFKName]: parseInt(key, 10),
      totalCurrentReceivingQty: _.sumBy(v, 'currentReceivingQty'),
    }))
    .value()

  let fullyReceivedArray = []
  if (outstandingItem) {
    fullyReceivedArray = groupByFKArray.filter((o) => {
      const item = outstandingItem.find((i) => i[itemFKName] === o[itemFKName])
      if (
        item &&
        item.orderQuantity - item.quantityReceived ===
          o.totalCurrentReceivingQty
      ) {
        return {
          ...o,
        }
      }
      return null
    })
  }

  newRows = newRows.filter((o) =>
    fullyReceivedArray.find((i) => i[itemFKName] === o[itemFKName]),
  )

  let inventoryItemList = _.differenceBy(list, newRows, itemFKName)

  if (outstandingItem) {
    const filterOutstandingItem = outstandingItem.filter(
      (x) => x.type === value,
    )

    inventoryItemList = _.intersectionBy(
      inventoryItemList,
      filterOutstandingItem,
      itemFKName,
    )
  }

  if (outstandingItem) {
    inventoryItemList = inventoryItemList.map((o) => {
      const findSpecificOutstandingItem = outstandingItem.find(
        (i) => i[itemFKName] === o[itemFKName],
      )
      let remainingQty
      if (findSpecificOutstandingItem) {
        const { orderQuantity, quantityReceived } = findSpecificOutstandingItem
        const item = groupByFKArray.find((i) => i[itemFKName] === o[itemFKName])
        if (item) {
          remainingQty =
            orderQuantity - quantityReceived - item.totalCurrentReceivingQty
        }
      }

      return {
        ...o,
        remainingQty,
      }
    })
  }

  return {
    inventoryItemList,
  }
}

export const getInventoryItemV2 = (
  list,
  value,
  itemFKName,
  rows = [],
  outstandingItem = undefined,
  existingData = false,
) => {
  const groupByFKFunc = (array) => {
    return _(array)
      .groupBy((x) => x[itemFKName])
      .map((v, key) => ({
        [itemFKName]: parseInt(key, 10),
        totalCurrentReceivingQty: _.sumBy(v, 'currentReceivingQty'),
      }))
      .value()
  }

  let newRows = rows.filter((x) => x.type === value && x.isDeleted === false)
  // console.log({ newRows })

  const rowsGroupByFK = groupByFKFunc(newRows)

  // console.log({ rowsGroupByFK })
  const newOutstandingItem = outstandingItem.map((o) => {
    const {
      quantityReceived,
      orderQuantity,
      quantityReceivedFromOtherDOs = 0,
    } = o

    const activeItem = rowsGroupByFK.find(
      (i) => i[itemFKName] === o[itemFKName],
    )
    // console.log({ activeItem })
    const remainingQuantityShouldReceive =
      orderQuantity - quantityReceivedFromOtherDOs
    let remainingQuantity = orderQuantity - quantityReceived

    if (activeItem) {
      if (existingData) {
        remainingQuantity =
          orderQuantity -
          activeItem.totalCurrentReceivingQty -
          quantityReceivedFromOtherDOs
      } else {
        remainingQuantity -= activeItem.totalCurrentReceivingQty
      }

      if (remainingQuantity === 0) {
        return {
          ...o,
          remainingQuantity,
        }
      }
    } else if (existingData && !activeItem) {
      remainingQuantity = remainingQuantityShouldReceive
    }

    return {
      ...o,
      remainingQuantity,
    }
  })

  let fullyReceivedArray = []
  // console.log({ newOutstandingItem })

  fullyReceivedArray = rowsGroupByFK.filter((o) => {
    const item = newOutstandingItem.find((i) => i[itemFKName] === o[itemFKName])
    if (item && item.remainingQuantity <= 0) {
      return {
        ...o,
      }
    }
    return null
  })
  // console.log({ fullyReceivedArray })

  // get the fully received item
  newRows = newRows.filter((o) =>
    fullyReceivedArray.find((i) => i[itemFKName] === o[itemFKName]),
  )

  // get all the not fully received item based on the inventory item and current rows
  let inventoryItemList = _.differenceBy(list, newRows, itemFKName)
  // console.log({ inventoryItemList })

  // get current inventory item outstanding item
  const filterOutstandingItem = newOutstandingItem.filter(
    (x) => x.type === value,
  )
  // console.log({ filterOutstandingItem })

  // get the all the not fully received item based on outstanding item
  inventoryItemList = _.intersectionBy(
    inventoryItemList,
    filterOutstandingItem,
    itemFKName,
  )
  // console.log({ inventoryItemList })

  inventoryItemList = inventoryItemList.map((o) => {
    const findSpecificOutstandingItem = newOutstandingItem.find(
      (i) => i[itemFKName] === o[itemFKName],
    )

    // console.log({ findSpecificOutstandingItem })
    let remainingQty
    if (findSpecificOutstandingItem) {
      const { remainingQuantity } = findSpecificOutstandingItem

      remainingQty = remainingQuantity
    }

    return {
      ...o,
      remainingQty,
    }
  })
  // console.log({ inventoryItemList })
  return {
    inventoryItemList,
  }
}

export const inventoryItemListing = (
  list,
  itemFKName = undefined,
  stateName = undefined,
  stockName = undefined,
) => {
  let inventoryItemList = list.map((x) => {
    return {
      value: x.id,
      name: x.displayValue,
      code: x.code,
      // uom: prescribingUOM.id,
      stock: x[stockName],
      uom: x.dispensingUOM ? x.dispensingUOM.name : x.uom.name,
      sellingPrice: x.sellingPrice,
      lastCostPriceBefBonus: x.lastCostPriceBefBonus,
      [itemFKName]: x.id,
      stateName,
      itemFK: x.id,
      isActive: x.isActive,
    }
  })
  return {
    inventoryItemList,
  }
}

export const InvoicePayerType = [
  {
    invoicePayerFK: 1,
    name: 'PATIENT',
    listName: 'patientPaymentTxn',
  },
  // {
  //   invoicePayerFK: 2,
  //   name: 'COPAYER',
  //   listName: 'coPayerPaymentTxn',
  // },
  // {
  //   invoicePayerFK: 3,
  //   name: 'GOVT_COPAYER',
  //   listName: 'govCoPayerPaymentTxn',
  // },
]
export const recurrenceTypes = [
  {
    value: 'daily',
    name: 'Daily',
  },
  {
    value: 'weekly',
    name: 'Weekly',
  },
  {
    value: 'monthly',
    name: 'Monthly',
  },
]

export const inventoryAdjustmentStatus = [
  { value: 1, name: 'Draft' },
  { value: 2, name: 'Finalized' },
  { value: 3, name: 'Discarded' },
]

export const shortcutKeys = [
  { value: 'F1', name: 'F1' },
  { value: 'F2', name: 'F2' },
  { value: 'F3', name: 'F3' },
  { value: 'F4', name: 'F4' },
  { value: 'F5', name: 'F5' },
  { value: 'F6', name: 'F6' },
  { value: 'F7', name: 'F7' },
  { value: 'F8', name: 'F8' },
  { value: 'F9', name: 'F9' },
  { value: 'F10', name: 'F10' },
  { value: 'F11', name: 'F11' },
  { value: 'F12', name: 'F12' },
]

export const roundToPrecision = (x, precision) => {
  const y = +x + (precision === undefined ? 0.5 : precision / 2)
  return y - y % (precision === undefined ? 1 : +precision)
}

export const groupByFKFunc = (array) => {
  return _(array)
    .groupBy((x) => x.itemFK)
    .map((v, key) => ({
      itemFK: parseInt(key, 10),
      totalCurrentReceivingQty: _.sumBy(v, 'currentReceivingQty'),
    }))
    .value()
}

export const visitOrderTemplateItemTypes = [
  {
    id: 1,
    dtoName: 'visitOrderTemplateMedicationItemDto',
    itemFKName: 'inventoryMedicationFK',
    keyName: 'inventoryMedication',
  },
  {
    id: 2,
    dtoName: 'visitOrderTemplateConsumableItemDto',
    itemFKName: 'inventoryConsumableFK',
    keyName: 'inventoryConsumable',
  },
  {
    id: 3,
    dtoName: 'visitOrderTemplateVaccinationItemDto',
    itemFKName: 'inventoryVaccinationFK',
    keyName: 'inventoryVaccination',
  },
  {
    id: 4,
    dtoName: 'visitOrderTemplateServiceItemDto',
    itemFKName: 'serviceCenterServiceFK',
    keyName: 'service',
  },
]

export const labelPrinterList = [
  { value: '8.9cmx3.6cm', name: '8.9cmx3.6cm' },
  { value: '8.0cmx4.5cm', name: '8.0cmx4.5cm' },
  { value: '7.6cmx3.8cm', name: '7.6cmx3.8cm' },
]

const corAttchementTypes = [
  {
    id: 1,
    type: 'ClinicalNotes',
    name: 'Consultation Attachment',
  },
  {
    id: 2,
    type: 'VisitReferral',
    name: 'Referral Attachment',
  },
  {
    id: 3,
    type: 'Visit',
    name: 'Visit Attachment',
  },
  {
    id: 4,
    type: 'EyeVisualAcuity',
    name: 'Visual Acuity Test',
    accessRight: 'queue.consultation.widgets.eyevisualacuity',
  },
  {
    id: 5,
    type: 'QueueDisplay',
    name: 'Queue Display',
  },
]

const initRoomAssignment = async () => {
  const accessRight = Authorized.check('settings.clinicsetting.roomassignment')
  if (accessRight && accessRight.rights === 'enable') {
    await window.g_app._store.dispatch({
      type: 'settingRoomAssignment/query',
      payload: {
        pagesize: 9999,
      },
    })
  }
}

const scribbleTypes = [
  { type: 'history', typeFK: SCRIBBLE_NOTE_TYPE.HISTORY },
  { type: 'chiefComplaints', typeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS },
  { type: 'note', typeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES },
  { type: 'plan', typeFK: SCRIBBLE_NOTE_TYPE.PLAN },
]

const formTypes = [
  {
    value: '1',
    name: 'Letter of Certification',
    prop: 'corLetterOfCertification',
    downloadConfig: {
      id: 45,
      key: 'LetterofCertificationId',
      subject: 'Letter of Certification',
      draft: (row) => {
        const { formData, statusFK } = row

        let LCFormSurgicalCharges = []
        formData.procuderes.filter((p) => p.index <= 3).forEach((element) => {
          for (let index = 0; index < 3; index++) {
            LCFormSurgicalCharges.push({
              index: element.index,
              ProcedureDate: element.procedureDate,
              StartTime: element.procedureStartTime,
              EndTime: element.procedureEndTime,
              NatureOperation: element.natureOfOpertation,
              SurgicalCode: element.surgicalProcedureCode,
              SurgicalDescription: element.surgicalProcedureName,
              SurgicalTable: element.surgicalProcedureTable,
              DoctorMCRNo: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgicalSurgeonMCRNo
                : '',
              DoctorName: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgicalSurgeonName
                : '',
              SurgeonRoleDisplayValue: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgicalRoleName
                : '',
              SurgeonFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgeonFees
                : 0,
              ImplantFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].implantFees
                : 0,
              OtherFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].otherFees
                : 0,
              TotalSurgicalFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].totalSurgicalFees
                : 0,
              GSTChargedDisplayValue: element.surgicalCharges[index]
                ? element.surgicalCharges[index].gSTChargedName
                : 'Charged',
            })
          }
        })

        let LCFormSurgicalChargesAnnex = []
        formData.procuderes.filter((p) => p.index > 3).forEach((element) => {
          for (let index = 0; index < 5; index++) {
            LCFormSurgicalChargesAnnex.push({
              index: element.index,
              ProcedureDate: element.procedureDate,
              StartTime: element.procedureStartTime,
              EndTime: element.procedureEndTime,
              NatureOperation: element.natureOfOpertation,
              SurgicalCode: element.surgicalProcedureCode,
              SurgicalDescription: element.surgicalProcedureName,
              SurgicalTable: element.surgicalProcedureTable,
              PatientName: formData.patientName,
              PatientAccountNo: formData.patientAccountNo,
              DateOfAdmission: formData.admissionDate,
              PrincipalSurgeonName: formData.principalSurgeonName,
              SignatureDoctorMCRNo: formData.principalSurgeonMCRNo,
              SignatureDate: formData.principalSurgeonSignatureDate,
              DoctorMCRNo: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgicalSurgeonMCRNo
                : '',
              DoctorName: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgicalSurgeonName
                : '',
              SurgeonRoleDisplayValue: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgicalRoleName
                : '',
              SurgeonFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].surgeonFees
                : 0,
              ImplantFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].implantFees
                : 0,
              OtherFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].otherFees
                : 0,
              TotalSurgicalFees: element.surgicalCharges[index]
                ? element.surgicalCharges[index].totalSurgicalFees
                : 0,
              GSTChargedDisplayValue: element.surgicalCharges[index]
                ? element.surgicalCharges[index].gSTChargedName
                : 'Charged',
            })
          }
        })

        let LCFormNonSurgicalCharges = []
        for (let index = 0; index < 7; index++) {
          LCFormNonSurgicalCharges.push({
            DoctorMCRNo: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].surgicalSurgeonMCRNo
              : '',
            DoctorName: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].surgicalSurgeonName
              : '',
            SurgeonRoleDisplayValue: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].surgicalRoleName
              : '',
            AttendanceFee: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].inpatientAttendanceFees
              : 0,
            OtherFees: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].otherFees
              : 0,
            TotalSurgicalFees: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].totalSurgicalFees
              : 0,
            GSTChargedDisplayValue: formData.nonSurgicalCharges[index]
              ? formData.nonSurgicalCharges[index].gSTChargedName
              : 'Charged',
          })
        }

        return {
          LCFormDetails: [
            {
              StatusFK: statusFK,
              PatientName: formData.patientName,
              PatientNRIC: formData.patientNRICNo,
              PatientAccountNo: formData.patientAccountNo,
              DateOfAdmission: formData.admissionDate,
              DateOfDischarge: formData.dischargeDate,
              AdmittingSpecialtyCode: formData.admittingSpecialtys.join(','),
              OtherSpecialty: formData.others,
              CaseType: formData.caseType,
              PrincipalDiagnosisCode: formData.principalDiagnosisCode,
              PrincipalDiagnosisDescription: formData.principalDiagnosisName,
              SecondaryDiagnosisCode1: formData.secondDiagnosisACode,
              SecondaryDiagnosisDescription1: formData.secondDiagnosisAName,
              SecondaryDiagnosisCode2: formData.secondDiagnosisBCode,
              SecondaryDiagnosisDescription2: formData.secondDiagnosisBName,
              OtherDiagnosis: formData.otherDiagnosis
                .map((o) => `${o.diagnosisCode} - ${o.diagnosisName}`)
                .join('|'),
            },
          ],
          LCFormSurgicalCharges,
          LCFormSignature: [
            {
              PrincipalSurgeonName: formData.principalSurgeonName,
              DoctorMCRNo: formData.principalSurgeonMCRNo,
              SignatureDate: formData.principalSurgeonSignatureDate,
            },
          ],
          LCFormNonSurgicalCharges,
          LCFormSurgicalChargesAnnex,
        }
      },
    },
  },
]

const formStatus = [
  {
    value: 1,
    name: 'Draft',
  },
  {
    value: 2,
    name: 'Finalized',
  },
  {
    value: 3,
    name: 'Submitted',
  },
  {
    value: 4,
    name: 'Voided',
  },
]

const gstChargedTypes = [
  {
    id: 1,
    name: 'Charged',
  },
  {
    id: 2,
    name: 'Waived',
  },
  {
    id: 3,
    name: 'Not Registered',
  },
]

const surgicalRoles = [
  {
    id: 1,
    code: 'PrincipalSurgeon',
    name: 'Principal Surgeon',
  },
  {
    id: 2,
    code: 'Dentist',
    name: 'Dentist',
  },
  {
    id: 3,
    code: 'Doctor',
    name: 'Doctor',
  },
  {
    id: 4,
    code: 'Anaesthetist',
    name: 'Anaesthetist',
  },
  {
    id: 5,
    code: 'Assistant',
    name: 'Assistant',
  },
]

const ltAdmittingSpecialty = [
  {
    id: 1,
    code: '01',
    name: '01 Burns',
  },
  {
    id: 2,
    code: '02',
    name: '02 Cardio Thoracic Surgery',
  },
  {
    id: 3,
    code: '03',
    name: '03 Cardiology',
  },
  {
    id: 4,
    code: '04',
    name: '04 Chronic Medicine',
  },
  {
    id: 5,
    code: '05',
    name: '05 Dental',
  },
  {
    id: 6,
    code: '06',
    name: '06 Dermatology',
  },
  {
    id: 7,
    code: '07',
    name: '07 General Medicine',
  },
  {
    id: 8,
    code: '08',
    name: '08 General Surgery',
  },
  {
    id: 9,
    code: '09',
    name: '09 Geriatric Medicine',
  },
  {
    id: 10,
    code: '10',
    name: '10 Gynaecology',
  },
  {
    id: 11,
    code: '11',
    name: '11 Haematology',
  },
  {
    id: 12,
    code: '12',
    name: '12 Hand Surgery',
  },
  {
    id: 13,
    code: '13',
    name: '13 Infectious Disease',
  },
  {
    id: 14,
    code: '14',
    name: '14 Neonatology',
  },
  {
    id: 15,
    code: '15',
    name: '15 Neurology',
  },
  {
    id: 16,
    code: '16',
    name: '16 Neurosurgery',
  },
  {
    id: 17,
    code: '17',
    name: '17 Nuclear Medicine',
  },
  {
    id: 18,
    code: '18',
    name: '18 Obstetrics',
  },
  {
    id: 19,
    code: '19',
    name: '19 Medical Oncology',
  },
  {
    id: 20,
    code: '20',
    name: '20 Ophthalmology',
  },
  {
    id: 21,
    code: '21',
    name: '21 Orthopaedic Surgery',
  },
  {
    id: 22,
    code: '22',
    name: '22 Otorhinolaryngology',
  },
  {
    id: 23,
    code: '23',
    name: '23 Paediatric Medicine',
  },
  {
    id: 24,
    code: '24',
    name: '24 Paediatric Surgery',
  },
  {
    id: 25,
    code: '25',
    name: '25 Plastic & Reconstructive Surgery',
  },
  {
    id: 26,
    code: '26',
    name: '26 Psychiatry',
  },
  {
    id: 27,
    code: '27',
    name: '27 Rehabilitation Medicine',
  },
  {
    id: 28,
    code: '28',
    name: '28 Renal Medicine',
  },
  {
    id: 29,
    code: '29',
    name: '29 Therapeutic Radiology',
  },
  {
    id: 30,
    code: '30',
    name: '30 Trauma',
  },
  {
    id: 31,
    code: '31',
    name: '31 Tuberculosis',
  },
  {
    id: 32,
    code: '32',
    name: '32 Urology',
  },
  {
    id: 33,
    code: '33',
    name: '33 Colorectal Surgery',
  },
  {
    id: 34,
    code: '34',
    name: '34 Observational Medicine',
  },
  {
    id: 35,
    code: '35',
    name: '35 Family Medicine and Continuing Care',
  },
  {
    id: 36,
    code: '36',
    name: '36 Surgical Oncology',
  },
  {
    id: 99,
    code: '99',
    name: '99 Others (please specify)',
  },
]

module.exports = {
  appointmentStatus,
  recurrenceTypes,
  status,
  approvedStatus,
  chasSchemeTypes,
  claimStatus,
  statusString,
  isAutoOrder,
  addressTypes,
  currenciesList,
  currencyRoundingList,
  currencyRoundingToTheClosestList,
  coPayerType,
  appointmentStatusReception,
  messageStatus,
  smsStatus,
  // country,
  sessionOptions,
  consultationDocumentTypes,
  tagList,
  osBalanceStatus,
  buttonTypes,
  inventoryAdjustmentStatus,
  shortcutKeys,
  roundToPrecision,
  gstEnabled,
  groupByFKFunc,
  corAttchementTypes,
  initRoomAssignment,
  scribbleTypes,
  formTypes,
  formStatus,
  gstChargedTypes,
  surgicalRoles,
  ltAdmittingSpecialty,
  ...module.exports,
}
