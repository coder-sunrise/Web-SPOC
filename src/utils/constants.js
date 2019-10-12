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
