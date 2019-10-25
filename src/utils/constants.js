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
  CASH: 1,
  NETS: 2,
  CREDIT_CARD: 3,
  CHEQUE: 4,
  GIRO: 5,
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
}

export const GENDER = {
  1: 'MALE',
  2: 'FEMALE',
  3: 'UNKNOWN',
}
