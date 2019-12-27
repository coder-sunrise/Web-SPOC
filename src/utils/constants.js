/**
 * ENUM constants that maps with SEMR Gen2 codeset
 */

export const APPOINTMENT_STATUS = {
  SCHEDULED: 1,
  DRAFT: 2,
  CANCELLED: 3,
  TURNEDUP: 4,
  RESCHEDULED: 5,
  NOSHOW: 6,
}

export const CANCELLATION_REASON_TYPE = {
  NOSHOW: 1,
  OTHERS: 2,
}

export const RESCHEDULE_BY = {
  BYCLINIC: 1,
  BYPATIENT: 2,
}

export const USER_ROLE = {
  ADMINISTRATOR: 1,
  DOCTOR_OWNER: 2,
  DOCTOR: 3,
  CLINIC_ASSISTANT: 4,
}

export const COPAYER_TYPE = {
  CORPORATE: 1,
  GOVERNMENT: 2,
}

export const INVOICE_PAYER_TYPE = {
  PATIENT: 1,
  SCHEME: 2,
  PAYERACCOUNT: 3,
  COMPANY: 4,
}

export const UNFIT_TYPE = {
  1: 'Unfit for Work',
  2: 'Unfit for School',
  3: 'Others',
  4: 'on Hospitalization Leave',
  5: 'Unfit for Duty',
  6: 'Unfit to Attend Court',
  7: 'for Light Duty',
  8: 'Unfit for PE',
  9: 'Unfit for wearing shoes',
  10: 'Excuse Chit',
}

export const PAYMENT_MODE = {
  CREDIT_CARD: 1,
  CHEQUE: 2,
  CASH: 3,
  NETS: 4,
  GIRO: 5,
  DEPOSIT: 6,
}

export const CREDIT_CARD_TYPE = {
  1: 'VISA',
  2: 'MASTER',
  3: 'AMEX',
  4: 'DINER',
  5: 'JCB',
}

export const PDPA_CONSENT_TYPE = {
  1: 'PDPAPHONE',
  2: 'PDPAMESSAGE',
  3: 'PDPAEMAIL',
}

export const INVOICE_ITEM_TYPE = {
  0: 'Corrupted data',
  1: 'Medication',
  2: 'Consumable',
  3: 'Vaccination',
  4: 'Service',
  5: 'Package',
}

export const INVOICE_ITEM_TYPE_BY_TEXT = {
  Medication: 1,
  Consumable: 2,
  Service: 3,
  Package: 4,
}

export const INVOICE_ITEM_TYPE_BY_NAME = {
  MEDICATION: 1,
  CONSUMABLE: 2,
  VACCINATION: 3,
  SERVICE: 4,
  PACKAGE: 5,
  MISC: 6,
}

export const INVENTORY_TYPE = {
  MEDICATION: 1,
  CONSUMABLE: 2,
  VACCINATION: 3,
}

export const INVENTORY_ADJUSTMENT_STATUS = {
  DRAFT: 1,
  FINALIZED: 2,
  DISCARDED: 3,
}

export const REPORT_TYPE = {
  1: 'Queue Listing',
  2: 'Patient Listing',
  3: 'Sales Summary',
  4: 'Payment Collection',
  5: 'Session Summary',
  6: 'Diagnosis Trending',
  7: 'Medical Certificate',
  8: 'Certificate of Attendance',
  9: 'Referral Letter',
  10: 'Vaccination Certificate',
  11: 'Memo',
  12: 'Other Documents',
  13: 'Credit Note Listing',
  14: 'Void Credit Note & Payment',
  15: 'Invoice',
  16: 'Oustanding Payment',
  17: 'Sales Listing',
  18: 'Credit Note',
  19: 'Low Stock Consumables',
  20: 'Low Stock Medication',
  21: 'Consumable Movement Report',
  22: 'Medication Movement',
  23: 'Deposit Transaction',
  24: 'Drug Label',
  25: 'Statement',
  26: 'Purchase Order',
  27: 'Patient Label',
  29: 'Payment Receipt',
}

export const INVOICE_STATUS = {
  PAID: 1,
  OVERPAID: 2,
  OUTSTANDING: 3,
  WRITEOFF: 4,
}

export const PURCHASE_ORDER_STATUS_TEXT = {
  DRAFT: 'Draft',
  FINALIZED: 'Finalized',
  PARTIALREVD: 'Partially Received',
  CANCELLED: 'Cancelled',
  FULFILLED: 'Fulfilled',
  COMPLETED: 'Completed',
}

export const INVOICE_STATUS_TEXT = {
  PAID: 'Paid',
  OVERPAID: 'Overpaid',
  OUTSTANDING: 'Outstanding',
  WRITEOFF: 'Write-Off',
}

export const COUNTRY_CODE = {
  1: '+65 Singapore',
  2: '+60 Malaysia',
  3: '+62 Indonesia',
  4: '+63 Philippines',
  5: '+66 Thailand',
  6: '+81 Japan',
}

export const ADD_ON_FEATURE = {
  SMS: 1,
  MIMS: 2,
}

export const VISIT_TYPE = {
  CONS: 1,
  RETAIL: 2,
  BILL_FIRST: 3,
}

export const VISIT_TYPE_NAME = [
  {
    visitPurposeFK: VISIT_TYPE.CONS,
    displayName: 'CONSULTATION',
  },
  {
    visitPurposeFK: VISIT_TYPE.RETAIL,
    displayName: 'RETAIL',
  },
  {
    visitPurposeFK: VISIT_TYPE.BILL_FIRST,
    displayName: 'BILL-FIRST',
  },
]

export const DEFAULT_PAYMENT_MODE_GIRO = {
  PAYMENT_FK: 5,
  DISPLAY_VALUE: 'GIRO',
}

export const ORDER_TYPE_TAB = {
  MEDICATION: '1',
  VACCINATION: '2',
  SERVICE: '3',
  CONSUMABLE: '4',
  OPENPRECRIPTION: '5',
  PACKAGE: '6',
}

export const SMS_STATUS = {
  SENT: 1,
  FAILED: 2,
  DELIVERED: 3,
  UNDELIVERED: 4,
  RECEIVING: 5,
  RECEIVED: 6,
  ACCEPTED: 7,
  SCHEDULED: 8,
  READ: 9,
  QUEUED: 10,
  SENDING: 11,
}

export const SMS_STATUS_TEXT = {
  SENT: 'Sent',
  FAILED: 'Failed',
  DELIVERED: 'Delivered',
  UNDELIVERED: 'Undelivered',
  RECEIVING: 'Receiving',
  RECEIVED: 'Received',
  ACCEPTED: 'Accepted',
  SCHEDULED: 'Scheduled',
  READ: 'Read',
  QUEUED: 'Queued',
  SENDING: 'Sending',
}

export const FILE_STATUS = {
  UPLOADED: 1,
  CONFIRMED: 2,
  ARCHIEVED: 3,
}

export const FILE_CATEGORY = {
  VISITREG: 1,
  CONSULTATION: 2,
  PATIENT: 3,
}
