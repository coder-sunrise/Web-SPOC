import moment from 'moment'
import _ from 'lodash'
import numeral from 'numeral'
import Authorized from '@/utils/Authorized'
import { currencySymbol, qtyFormat } from '@/utils/config'
import { dateFormatLong, dateFormatLongWithTime } from '@/components'
import {
  UNFIT_TYPE,
  SCRIBBLE_NOTE_TYPE,
  VISITDOCTOR_CONSULTATIONSTATUS,
} from './constants'
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
    value: '1',
    name: 'Spectacle Prescription',
    prop: 'corSpectaclePrescription',
    authority:
      'queue.consultation.widgets.consultationdocument.spectacleprescription',
    downloadConfig: {
      id: 96,
      key: 'SpectaclePrescriptionId',
      subject: 'Spectacle Prescription',
      draft: row => {
        return {
          SpectaclePrescriptionDetails: [
            {
              ...row,
              dateofPrescription: row.dateofPrescription
                ? moment(row.dateofPrescription).format(dateFormatLong)
                : '',
            },
          ],
        }
      },
    },
  },
  {
    value: '2',
    name: 'Spectacle Order Form',
    prop: 'corSpectacleOrderForm',
    downloadConfig: {
      id: 8,
      key: 'SpectacleOrderFormId',
      subject: 'Spectacle Order Form',
      draft: row => {
        return {
          SpectacleOrderFormDetails: [
            {
              ...row,
            },
          ],
        }
      },
    },
  },
  {
    value: '3',
    name: 'Contact Lens Prescription',
    prop: 'corContactLensPrescription',
    downloadConfig: {
      id: 9,
      key: 'ContactLensPrescriptionId',
      subject: 'Contact Lens Prescription',
      draft: row => {
        return {
          ContactLensPrescriptionDetails: [
            {
              ...row,
            },
          ],
        }
      },
    },
  },
  {
    value: '4',
    name: 'Contact Lens Order Form',
    prop: 'corContactLensOrderForm',
    downloadConfig: {
      id: 11,
      key: 'ContactLensOrderFormId',
      subject: 'Contact Lens Order Form',
      draft: row => {
        return {
          ContactLensOrderFormDetails: [
            {
              ...row,
            },
          ],
        }
      },
    },
  },
  {
    value: '5',
    name: 'Referral Letter',
    prop: 'corReferralLetter',
    downloadConfig: {
      id: 12,
      key: 'ReferralLetterId',
      subject: 'Referral Letter',
      draft: row => {
        return {
          DocumentDetails: [
            {
              ...row,
            },
          ],
        }
      },
    },
  },
  {
    value: '6',
    name: 'Medical Report',
    prop: 'corMedicalReport',
    downloadConfig: {
      id: 12,
      key: 'MedicalReportId',
      subject: 'Medical Report',
      draft: row => {
        return {
          DocumentDetails: [
            {
              ...row,
            },
          ],
        }
      },
    },
  },
]

const buttonTypes = ['RegularButton', 'IconButton', 'Fab']

export const countryCodes = [
  { name: '+65 Singapore', value: '65' },
  { name: '+60 Malaysia', value: '60' },
  { name: '+62 Indonesia', value: '62' },
  { name: '+63 Philippines', value: '63' },
  { name: '+66 Thailand', value: '66' },
  { name: '+81 Japan', value: '81' },
]

export const podoOrderType = [
  {
    value: 2,
    name: 'Product',
    prop: 'purchaseOrderConsumableItem',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
    stateName: 'ConsumableItemList',
    itemCode: 'inventoryConsumableCode',
    itemName: 'inventoryConsumableName',
    stockName: 'consumableStock',
  },
]

export const rgType = [
  {
    value: 2,
    name: 'Product',
    prop: 'receivingGoodsConsumableItem',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
    stateName: 'ConsumableItemList',
    itemCode: 'inventoryConsumableCode',
    itemName: 'inventoryConsumableName',
    stockName: 'consumableStock',
  },
]

const loadFromCodesConfig = {
  InsertConsumable: rows => {
    const pRows = rows.filter(o => !o.isDeleted && o.type === '4')
    if (pRows && pRows.length > 0) {
      const rowHTMLs = pRows.map(o => {
        const {
          consumableName = '',
          unitOfMeasurement = '',
          quantity = 0,
          remarks = '',
        } = o

        const qtyFormatStr = numeral(quantity).format(qtyFormat)
        const subjectHtml = `<li> - ${consumableName}</li>`
        const qtyHtml = `<li>Quantity: ${qtyFormatStr} ${unitOfMeasurement}</li>`
        const remarksHtml = remarks !== '' ? `<li>${remarks}</li>` : ''

        return `<ul>${subjectHtml} <ul>${qtyHtml}${remarksHtml}</ul></ul>`
      })

      return `<ul>
              <li><strong>Consumable</strong></li>
              ${rowHTMLs.join('')}
           </ul>`
    }
    return ''
  },

  InsertPatientInfo: (codetable, patient) => {
    let result
    let patientGender = codetable.ctgender.find(x => x.id === patient.genderFK)
    result = `<p>Patient Name: ${patient.name}</p>`
    result += `<p>Patient Ref. No.: ${patient.patientReferenceNo}</p>`
    result += `<p>Patient Acc. No.: ${patient.patientAccountNo}</p>`
    result += `<p>Gender/Age: ${patientGender.name.substring(
      0,
      1,
    )}/${calculateAgeFromDOB(patient.dob)}</p>`

    return result
  },
}

export const InventoryTypes = [
  {
    value: 2,
    name: 'Product',
    prop: 'consumableValueDto',
    itemFKName: 'inventoryConsumableFK',
    ctName: 'inventoryconsumable',
    field: 'inventoryConsumable',
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
          x => x.id === patient.entity.genderFK,
        )
        result = `<p>Patient Name: ${patient.entity.name}</p>`
        result += `<p>Patient Ref. No.: ${patient.entity.patientReferenceNo}</p>`
        result += `<p>Patient Acc. No.: ${patient.entity.patientAccountNo}</p>`
        result += `<p>Gender/Age: ${patientGender.name.substring(
          0,
          1,
        )}/${calculateAgeFromDOB(patient.entity.dob)}</p>`
      }
      return result || 'N.A.'
    },
  },
  {
    value: 'Order',
    text: '<#Order#>',
    url: '',
    getter: () => {
      const { orders, patient, codetable } = window.g_app._store.getState()
      if (!orders) return '-'

      const { rows = [] } = orders

      let service = rows
        .filter(o => !o.isDeleted && o.type === '3')
        .map(s => `<p>- ${s.subject}</p>`)
        .join('')

      const ordersHTML = [
        loadFromCodesConfig.InsertConsumable(rows, codetable, patient),
        service,
      ]

      let htmls = ordersHTML.join('')
      return htmls
    },
  },
]

const month = [
  { value: '01', name: 'Jan' },
  { value: '02', name: 'Feb' },
  { value: '03', name: 'Mar' },
  { value: '04', name: 'Apr' },
  { value: '05', name: 'May' },
  { value: '06', name: 'Jun' },
  { value: '07', name: 'Jul' },
  { value: '08', name: 'Aug' },
  { value: '09', name: 'Sep' },
  { value: '10', name: 'Oct' },
  { value: '11', name: 'Nov' },
  { value: '12', name: 'Dec' },
]

const year = [
  { value: '2040', name: '2040' },
  { value: '2039', name: '2039' },
  { value: '2038', name: '2038' },
  { value: '2037', name: '2037' },
  { value: '2036', name: '2036' },
  { value: '2035', name: '2035' },
  { value: '2034', name: '2034' },
  { value: '2033', name: '2033' },
  { value: '2032', name: '2032' },
  { value: '2031', name: '2031' },
  { value: '2030', name: '2030' },
  { value: '2029', name: '2029' },
  { value: '2028', name: '2028' },
  { value: '2027', name: '2027' },
  { value: '2026', name: '2026' },
  { value: '2025', name: '2025' },
  { value: '2024', name: '2024' },
  { value: '2023', name: '2023' },
  { value: '2022', name: '2022' },
  { value: '2021', name: '2021' },
  { value: '2020', name: '2020' },
  { value: '2019', name: '2019' },
  { value: '2018', name: '2018' },
  { value: '2017', name: '2017' },
  { value: '2016', name: '2016' },
  { value: '2015', name: '2015' },
  { value: '2014', name: '2014' },
  { value: '2013', name: '2013' },
  { value: '2012', name: '2012' },
  { value: '2011', name: '2011' },
  { value: '2010', name: '2010' },
  { value: '2009', name: '2009' },
  { value: '2008', name: '2008' },
  { value: '2007', name: '2007' },
  { value: '2006', name: '2006' },
  { value: '2005', name: '2005' },
  { value: '2004', name: '2004' },
  { value: '2003', name: '2003' },
  { value: '2002', name: '2002' },
  { value: '2001', name: '2001' },
  { value: '2000', name: '2000' },
  { value: '1999', name: '1999' },
  { value: '1998', name: '1998' },
  { value: '1997', name: '1997' },
  { value: '1996', name: '1996' },
  { value: '1995', name: '1995' },
  { value: '1994', name: '1994' },
  { value: '1993', name: '1993' },
  { value: '1992', name: '1992' },
  { value: '1991', name: '1991' },
  { value: '1990', name: '1990' },
]

const tagCategory = [
  {
    value: 'Patient',
    name: 'Patient',
    render: () => <span>Patient</span>,
  },
  {
    value: 'Service',
    name: 'Service',
    render: () => <span>Service</span>,
  },
]

const languageCategory = [
  {
    value: 'JP',
    name: 'Japanese',
    render: () => <span>Japanese</span>,
  },
  {
    value: 'EN',
    name: 'English',
    render: () => <span>English</span>,
  },
]

export const getInventoryItem = (
  list,
  value,
  itemFKName,
  rows = [],
  outstandingItem = undefined,
) => {
  let newRows = rows.filter(x => x.type === value && x.isDeleted === false)
  const groupByFKArray = _(newRows)
    .groupBy(x => x[itemFKName])
    .map((v, key) => ({
      [itemFKName]: parseInt(key, 10),
      totalCurrentReceivingQty: _.sumBy(v, 'currentReceivingQty'),
    }))
    .value()

  let fullyReceivedArray = []
  if (outstandingItem) {
    fullyReceivedArray = groupByFKArray.filter(o => {
      const item = outstandingItem.find(i => i[itemFKName] === o[itemFKName])
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

  newRows = newRows.filter(o =>
    fullyReceivedArray.find(i => i[itemFKName] === o[itemFKName]),
  )

  let inventoryItemList = _.differenceBy(list, newRows, itemFKName)

  if (outstandingItem) {
    const filterOutstandingItem = outstandingItem.filter(x => x.type === value)

    inventoryItemList = _.intersectionBy(
      inventoryItemList,
      filterOutstandingItem,
      itemFKName,
    )
  }

  if (outstandingItem) {
    inventoryItemList = inventoryItemList.map(o => {
      const findSpecificOutstandingItem = outstandingItem.find(
        i => i[itemFKName] === o[itemFKName],
      )
      let remainingQty
      if (findSpecificOutstandingItem) {
        const { orderQuantity, quantityReceived } = findSpecificOutstandingItem
        const item = groupByFKArray.find(i => i[itemFKName] === o[itemFKName])
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

export const getOutstandingInventoryItem = (
  list,
  value,
  itemFKName,
  rows = [],
  outstandingItem = undefined,
  existingData = false,
) => {
  let newRows = rows.filter(x => x.type === value && x.isDeleted === false)
  //get current received qty group by poitemfk
  const rowsGroupByFK = groupByFKFunc(newRows)

  const newOutstandingItem = outstandingItem.map(o => {
    const {
      quantityReceived,
      orderQuantity,
      quantityReceivedFromOtherDOs = 0,
      bonusQuantity,
      bonusReceived,
    } = o

    const activeItem = rowsGroupByFK.find(
      i => i.purchaseOrderItemFK === o.purchaseOrderItemFK,
    )
    const remainingQuantityShouldReceive =
      orderQuantity + bonusQuantity - quantityReceivedFromOtherDOs
    let remainingQuantity = orderQuantity - quantityReceived
    let remainingBonusQuantity = bonusQuantity - bonusReceived

    if (activeItem) {
      if (existingData) {
        remainingQuantity =
          orderQuantity > 0
            ? orderQuantity -
              activeItem.totalCurrentReceivingQty -
              quantityReceivedFromOtherDOs
            : 0
        remainingBonusQuantity =
          bonusQuantity > 0
            ? bonusQuantity -
              activeItem.totalCurrentReceivingBonusQty -
              quantityReceivedFromOtherDOs
            : 0
      } else {
        remainingQuantity -= activeItem.totalCurrentReceivingQty
        remainingBonusQuantity -= activeItem.totalCurrentReceivingBonusQty
      }
    } else if (existingData && !activeItem) {
      remainingQuantity = orderQuantity > 0 ? remainingQuantityShouldReceive : 0
      remainingBonusQuantity =
        bonusQuantity > 0 ? remainingQuantityShouldReceive : 0
    }

    return {
      ...o,
      remainingQuantity,
      remainingBonusQuantity,
    }
  })

  // let fullyReceivedArray = rowsGroupByFK.filter(o => {
  //   const item = newOutstandingItem.find(i => i.purchaseOrderItemFK === o.purchaseOrderItemFK)
  //   return (item && item.remainingQuantity <= 0 && item.remainingBonusQuantity <= 0)
  // })

  // get the fully received item
  // newRows = newRows.filter(o =>
  //   fullyReceivedArray.find(i => i.purchaseOrderItemFK === o.purchaseOrderItemFK),
  // )

  // get all the not fully received item based on the inventory item and current rows
  // let inventoryItemList = _.differenceBy(list, newRows, itemFKName)//same itemfkname have diff remain qty : 0 or > 0

  // get current inventory item outstanding item
  const filterOutstandingItem = newOutstandingItem.filter(
    x =>
      x.type === value &&
      (x.remainingQuantity > 0 || x.remainingBonusQuantity > 0),
  )

  // get the all the not fully received item based on outstanding item

  let inventoryItemList = filterOutstandingItem
    .map(o => {
      const ivtItem = list.find(i => i[itemFKName] === o[itemFKName])

      let remainingQty, remainingBonusQty
      if (ivtItem) {
        const { remainingQuantity, remainingBonusQuantity } = o
        remainingQty = remainingQuantity
        remainingBonusQty = remainingBonusQuantity
      } else return null
      return {
        ...ivtItem,
        value: o.id,
        orderQuantity: o.orderQuantity,
        remainingQty: remainingQty,
        bonusQuantity: o.bonusQuantity,
        remainingBonusQty: remainingBonusQty,
        purchaseOrderItemFK: o.id,
      }
    })
    .filter(x => x)
  return inventoryItemList
}

export const inventoryItemListing = (
  list,
  itemFKName = undefined,
  stateName = undefined,
  stockName = undefined,
) => {
  let inventoryItemList = list.map(x => {
    const { code, displayValue, sellingPrice = 0 } = x
    const uom = x.dispensingUOM ? x.dispensingUOM.name : x.uom?.name
    const itemFKObj = itemFKName ? { [itemFKName]: x.id } : {}
    return {
      value: x.id,
      name: displayValue,
      code,
      stock: x[stockName],
      uom,
      sellingPrice: x.sellingPrice,
      lastCostPriceBefBonus: x.lastCostPriceBefBonus,
      id: x.id,
      stateName,
      itemFK: x.id,
      isActive: x.isActive,
      orderable: x.orderable,
      displayValue: `${displayValue} - ${code} (${currencySymbol}${sellingPrice.toFixed(
        2,
      )} / ${uom})`,
      ...itemFKObj,
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
  return y - (y % (precision === undefined ? 1 : +precision))
}

export const groupByFKFunc = array => {
  return _(array)
    .groupBy(x => x.purchaseOrderItemFK)
    .map((v, key) => ({
      purchaseOrderItemFK: parseInt(key, 10),
      totalCurrentReceivingQty: _.sumBy(v, 'currentReceivingQty'),
      totalCurrentReceivingBonusQty: _.sumBy(v, 'currentReceivingBonusQty'),
    }))
    .value()
}

export const visitOrderTemplateItemTypes = [
  {
    id: 2,
    dtoName: 'visitOrderTemplateConsumableItemDto',
    itemFKName: 'inventoryConsumableFK',
    keyName: 'inventoryConsumable',
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

export const corAttchementTypes = [
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
  // {
  //   id: 5,
  //   type: 'QueueDisplay',
  //   name: 'Queue Display',
  // },
]

export const ReportsOnSignOffOption = {
  MedicalCertificate: 'Medical Certificate',
  CertificateofAttendance: 'Certificate of Attendance',
  ReferralLetter: 'Referral Letter',
  Memo: 'Memo',
  OtherDocuments: 'Other Documents',
}
export const ReportsOnSignOff = [
  {
    code: ReportsOnSignOffOption.MedicalCertificate,
    description: 'Medical Certificate',
  },
  {
    code: ReportsOnSignOffOption.CertificateofAttendance,
    description: 'Certificate of Attendance',
  },
  {
    code: ReportsOnSignOffOption.ReferralLetter,
    description: 'Referral Letter',
  },
  { code: ReportsOnSignOffOption.Memo, description: 'Memo' },
  {
    code: ReportsOnSignOffOption.OtherDocuments,
    description: 'Other Documents',
  },
]
export const ReportsOnCompletePaymentOption = {
  Invoice: 'Invoice',
  Receipt: 'Receipt',
}
export const ReportsOnCompletePayment = [
  { code: ReportsOnCompletePaymentOption.Invoice, description: 'Invoice' },
  { code: ReportsOnCompletePaymentOption.Receipt, description: 'Receipt' },
]
const initRoomAssignment = async () => {
  // The local identity feature overwrited
  return
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
    value: '2',
    name: 'From',
    prop: 'corForm',
    downloadConfig: {
      id: 0,
      key: 'FormId',
      subject: 'From',
      draft: row => {},
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
    code: 'PRINCIPALSURGEON',
    name: 'Principal Surgeon',
  },
  {
    id: 2,
    code: 'OTHERSURGEON',
    name: 'Other Surgeon',
  },
  {
    id: 3,
    code: 'DENTIST',
    name: 'Dentist',
  },
  {
    id: 4,
    code: 'DOCTOR',
    name: 'Doctor',
  },
  {
    id: 5,
    code: 'ANESTHETIST',
    name: 'Anesthetist',
  },
  {
    id: 6,
    code: 'ASSISTANT',
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

const queueProcessorType = [
  {
    value: 1,
    name: 'XRay Interface',
  },
  {
    value: 2,
    name: 'SAP Interface',
  },
  {
    value: 3,
    name: 'Lab Interface',
  },
]

const queueItemStatus = [
  {
    value: 1,
    name: 'Pending',
  },
  {
    value: 2,
    name: 'Processing',
  },
  {
    value: 3,
    name: 'Successful',
  },
  {
    value: 4,
    name: 'Failed',
  },
]

const orderItemCategory = [
  {
    value: 'Consumable',
    name: 'Product',
  },
  {
    value: 'Service',
    name: 'Service',
  },
]

export const documentCategorys = [
  { value: 1, name: 'Consultation Document' },
  { value: 2, name: 'Form' },
]

export const documentTemplateTypes = [
  {
    value: 1,
    name: 'Referral Letter',
  },
  {
    value: 2,
    name: 'Memo',
  },
  {
    value: 4,
    name: 'Others',
  },
  {
    value: 5,
    name: 'Consent Form',
  },
  {
    value: 6,
    name: 'Questionnaire',
  },
]

const isPanelItemRequired = [
  { value: false, name: 'No' },
  { value: true, name: 'Yes' },
]

const pharmacyStatus = [
  {
    statusFK: 1,
    name: 'Ordered',
  },
  {
    statusFK: 2,
    name: 'Prepared',
  },
  {
    statusFK: 3,
    name: 'Verified',
  },
  {
    statusFK: 4,
    name: 'Completed',
  },
]

const examinationSteps = [
  {
    statusFK: 1,
    name: 'Ordered',
  },
  {
    statusFK: 2,
    name: 'PendingReport',
    name: 'Examination Started',
  },
  {
    statusFK: 3,
    name: 'Modality Completed',
  },

  {
    statusFK: 4,
    name: 'Completed',
  },
  {
    statusFK: 5,
    name: 'Cancelled',
  },
]

const visitDoctorConsultationStatusColor = [
  { value: VISITDOCTOR_CONSULTATIONSTATUS.WAITING, color: '#4255BD' },
  { value: VISITDOCTOR_CONSULTATIONSTATUS.INPROGRESS, color: '#CF1322' },
  { value: VISITDOCTOR_CONSULTATIONSTATUS.PAUSED, color: '#CF1322' },
  { value: VISITDOCTOR_CONSULTATIONSTATUS.COMPLETED, color: '#777' },
]

const orderItemTypes = [
  { type: 'Consumable', displayValue: 'Con' },
  { type: 'Service', displayValue: 'Svc' },
]

export {
  appointmentStatus,
  status,
  approvedStatus,
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
  sessionOptions,
  consultationDocumentTypes,
  tagList,
  osBalanceStatus,
  buttonTypes,
  gstEnabled,
  initRoomAssignment,
  scribbleTypes,
  formTypes,
  formStatus,
  gstChargedTypes,
  surgicalRoles,
  ltAdmittingSpecialty,
  month,
  year,
  queueProcessorType,
  queueItemStatus,
  orderItemCategory,
  tagCategory,
  isPanelItemRequired,
  languageCategory,
  pharmacyStatus,
  examinationSteps,
  visitDoctorConsultationStatusColor,
  orderItemTypes,
}
