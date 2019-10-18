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
