/**
 * ENUM constants that maps with SEMR Gen2 codeset
 */

export const APPOINTMENT_STATUS = {
  CONFIRMED: 1,
  DRAFT: 2,
  CANCELLED: 3,
  TURNEDUP: 4,
  RESCHEDULED: 5,
  PFA_RESCHEDULED: 6,
  PFA_CANCELLED: 7,
  TURNEDUPLATE: 8,
}
export const APPOINTMENT_CANCELLEDBY = {
  CLINIC: 1,
  PATIENT: 2,
}

export const PATIENT_LAB = {
  PATIENT_PROFILE: 1,
  CONSULTATION: 2,
  LAB_TRACKING: 3,
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

export const LAB_TRACKING_STATUS = {
  NEW: 1,
  ORDERED: 2,
  RECEIVED: 3,
  COMPLETED: 4,
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
  8: 'Unfit for Physical Exercise',
  9: 'Unfit for wearing shoes',
  10: 'Excuse Chit',
  11: 'on Maternity Leave',
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
  5: 'OrderSet',
  6: 'Misc',
  7: 'Treatment',
}

export const INVOICE_ITEM_TYPE_BY_TEXT = {
  Medication: 1,
  Consumable: 2,
  Service: 3,
  OrderSet: 4,
}

export const INVOICE_ITEM_TYPE_BY_NAME = {
  MEDICATION: 1,
  CONSUMABLE: 2,
  VACCINATION: 3,
  SERVICE: 4,
  ORDERSET: 5,
  MISC: 6,
}

export const INVENTORY_TYPE = {
  MEDICATION: 1,
  CONSUMABLE: 2,
  VACCINATION: 3,
}

export const ITEM_TYPE = {
  MEDICATION: 1,
  CONSUMABLE: 2,
  VACCINATION: 3,
  SERVICE: 4,
  ORDERSET: 5,
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
  37: 'Inventory Trending Report',
  45: 'Letter of Certification',
}

export const REPORT_ID = {
  DRUG_LABEL_80MM_45MM: 24,
  DRUG_LABEL_89MM_36MM: 31,
  DRUG_LABEL_76MM_38MM: 48,
  PATIENT_LABEL_80MM_45MM: 27,
  PATIENT_LABEL_89MM_36MM: 32,
  PATIENT_LABEL_76MM_38MM: 45,
  PATIENT_LAB_LABEL_80MM_45MM: 33,
  PATIENT_LAB_LABEL_89MM_36MM: 34,
  PATIENT_LAB_LABEL_76MM_38MM: 46,
  POST_CARD_LABEL_80MM_45MM: 35,
  POST_CARD_LABEL_89MM_36MM: 36,
  PATIENT_ADDRESS_LABEL_80MM_45MM: 41,
  PATIENT_ADDRESS_LABEL_89MM_36MM: 42,
  PATIENT_ADDRESS_LABEL_76MM_38MM: 47,
  COPAYER_ADDRESS_LABEL_80MM_45MM: 43,
  COPAYER_ADDRESS_LABEL_89MM_36MM: 44,
  COPAYER_ADDRESS_LABEL_76MM_38MM: 49,
  SUPPLIER_ADDRESS_LABEL_80MM_45MM: 50,
  SUPPLIER_ADDRESS_LABEL_89MM_36MM: 51,
  SUPPLIER_ADDRESS_LABEL_76MM_38MM: 52,
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
  7: '+886 Taiwan',
  8: '+61 Australia',
  9: '+55 Brazil',
  10: '+86 China',
  11: '+1 Canada',
  12: '+1 United States of America',
  13: '+45 Denmark',
  14: '+33 France',
  15: '+49 Germany',
  16: '+39 Italy',
  17: '+82 South Korea',
  18: '+852 Hong Kong',
  19: '+853 Macao',
  20: '+52 Mexico',
  21: '+95 Myanmar',
  22: '+64 New Zealand',
  23: '+47 Norway',
  24: '+34 Spain',
  25: '+41 Switzerland',
  26: '+84 Vietnam',
  27: '+44 United Kingdom',
}

export const COUNTRY_CODE_NUMBER = {
  1: '+65',
  2: '+60',
  3: '+62',
  4: '+63',
  5: '+66',
  6: '+81',
  7: '+886',
  8: '+61',
  9: '+55',
  10: '+86',
  11: '+1',
  12: '+1',
  13: '+45',
  14: '+33',
  15: '+49',
  16: '+39',
  17: '+82',
  18: '+852',
  19: '+853',
  20: '+52',
  21: '+95',
  22: '+64',
  23: '+47',
  24: '+34',
  25: '+41',
  26: '+84',
  27: '+44',
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
  OPENPRESCRIPTION: '5',
  ORDERSET: '6',
}

export const PATIENT_HISTORY_TABS = {
  VISIT: 1,
  DISPENSE: 2,
  APPOINTMENT: 3,
  INVOICE: 4,
  NURSENOTES: 5,
}

export const FILE_STATUS = {
  UPLOADED: 1,
  CONFIRMED: 2,
  ARCHIEVED: 3,
}

export const SCRIBBLE_NOTE_TYPE = {
  CLINICALNOTES: 1,
  CHIEFCOMPLAINTS: 2,
  PLAN: 6,
  HISTORY: 3,
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
  UNREAD: 'Unread',
}

export const CANNED_TEXT_TYPE = {
  NOTE: 1,
  CHIEFCOMPLAINTS: 2,
  HISTORY: 3,
  PLAN: 6,
}

export const DENTAL_CANNED_TEXT_TYPE_FIELD = {
  1: 'clinicalNotes',
  2: 'complaints',
  3: 'associatedHistory',
  4: 'intraOral',
  5: 'extraOral',
  6: 'plan',
}

export const CLINIC_TYPE = {
  GP: 1,
  DENTAL: 2,
}

export const FILE_CATEGORY = {
  VISITREG: 1,
  CONSULTATION: 2,
  PATIENT: 3,
}

export const PURCHASE_ORDER_STATUS = {
  DRAFT: 1,
  FINALIZED: 2,
  PARTIALREVD: 3,
  CANCELLED: 4,
  FULFILLED: 5,
  COMPLETED: 6,
}

export const NUMBER_TYPE = {
  MOBILE: 1,
  HOME: 2,
  WORK: 3,
  FAX: 4,
}

export const NOTIFICATION_TYPE = {
  QUEUE: 1,
  CODETABLE: 2,
  ERROR: 3,
  SYSINFO: 4,
}

export const NOTIFICATION_STATUS = {
  OK: 1,
  ERROR: 2,
}
export const VALUE_KEYS = {
  QUEUEDISPLAYSETUP: 'queueDisplay',
  QUEUECALLING: 'queueCalling',
}
/**
 * ENUM constants that maps with SEMR Gen2 codeset
 */

export const SCHEME_TYPE = {
  CORPORATE: 15,
}

export const INVOICE_VIEW_MODE = {
  DEFAULT: 'default',
  APPLIED_SCHEME: 'applied_scheme',
}

export const ATTACHMENT_TYPE = {
  CLINICALNOTES: 'ClinicalNotes',
  VISITREFERRAL: 'VisitReferral',
  VISIT: 'Visit',
  EYEVISUALACUITY: 'EyeVisualAcuity',
}

export const FORM_FROM = {
  FORMMODULE: 1,
  QUEUELOG: 2,
}

export const FORM_CATEGORY = {
  VISITFORM: 1,
  CORFORM: 2,
}
