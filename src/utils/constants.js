/**
 * ENUM constants that maps with SEMR Gen2 codeset
 */

export const APPOINTMENT_STATUS = {
  CONFIRMED: 1,
  CANCELLED: 3,
  TURNEDUP: 4,
  RESCHEDULED: 5,
  PFA_RESCHEDULED: 6,
  PFA_CANCELLED: 7,
  TURNEDUPLATE: 8,
  DELETED: 9,
  PFA_NOSHOW: 10,
}
export const APPOINTMENT_STATUSOPTIONS = [
  {
    id: APPOINTMENT_STATUS.CONFIRMED,
    name: 'Confirmed',
  },
  {
    id: APPOINTMENT_STATUS.CANCELLED,
    name: 'Cancelled',
  },
  {
    id: APPOINTMENT_STATUS.TURNEDUP,
    name: 'Turned Up',
  },
  {
    id: APPOINTMENT_STATUS.RESCHEDULED,
    name: 'Rescheduled',
  },
  {
    id: APPOINTMENT_STATUS.PFA_RESCHEDULED,
    name: 'PFA(Rescheduled)',
  },
  {
    id: APPOINTMENT_STATUS.PFA_CANCELLED,
    name: 'PFA(Cancelled)',
  },
  {
    id: APPOINTMENT_STATUS.TURNEDUPLATE,
    name: 'Turned Up(Late)',
  },
  {
    id: APPOINTMENT_STATUS.DELETED,
    name: 'Deleted',
  },
  {
    id: APPOINTMENT_STATUS.PFA_NOSHOW,
    name: 'PFA(No Show)',
  },
]
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
  INSURANCE: 3,
}

export const INVOICE_PAYER_TYPE = {
  PATIENT: 1,
  SCHEME: 2,
  PAYERACCOUNT: 3,
  COMPANY: 4,
}

export const CLINICAL_ROLE = {
  DOCTOR: 1,
  OTHERS: 2,
  STUDENT: 3,
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

export const USER_PREFERENCE_TYPE = {
  CESTEMPLATE: '1',
  WIDGETTEMPLATE: '2',
  GRIDSETTING: '3',
  APPOINTMENTFILTERTEMPLATE: '4',
  PATIENTHISTORY: '5',
  FAVOURITEDIAGNOSISSETTING: '6',
  FAVOURITEICD10DIAGNOSISSETTING: '7',
  FAVOURITEDIAGNOSISLANGUAGESETTING: '8',
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
  2: 'Consumable',
  4: 'Service',
  5: 'OrderSet',
  6: 'Misc',
  7: 'Treatment',
}

export const INVOICE_ITEM_TYPE_BY_TEXT = {
  Consumable: 2,
  Service: 3,
  OrderSet: 4,
}

export const INVOICE_ITEM_TYPE_BY_NAME = {
  CONSUMABLE: 2,
  SERVICE: 4,
  ORDERSET: 5,
  MISC: 6,
}

export const INVENTORY_TYPE = {
  CONSUMABLE: 2,
}

export const ITEM_TYPE = {
  CONSUMABLE: 2,
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
  11: 'Memo',
  12: 'Other Documents',
  13: 'Credit Note Listing',
  14: 'Void Credit Note & Payment',
  15: 'Invoice',
  16: 'Oustanding Payment',
  17: 'Sales Listing',
  18: 'Credit Note',
  20: 'Low Stock',
  22: 'Inventory Movement Report',
  23: 'Deposit Transaction',
  24: 'Drug Label',
  25: 'Statement',
  26: 'Purchase Order',
  27: 'Patient Label',
  29: 'Payment Receipt',
  37: 'Inventory Trending Report',
  55: 'Letter of Certification',
  61: 'Refraction Form Report',
  68: 'Patient History Report',
  80: 'Invoice',
}

export const IGNORED_REPORT_SETTING_REPORT_IDS = [
  24,
  27,
  31,
  32,
  33,
  34,
  35,
  36,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  69,
  70,
  71,
  73,
  74,
  75,
  88,
  90,
  92,
  95,
]

export const REPORT_FILE_NAME = {
  1: 'Queue Listing Report',
  2: 'Patient Listing Report',
  3: 'Sales Summary Report',
  4: 'Payment Collection Report',
  5: 'Session Summary Report',
  6: 'Diagnosis Trending Report',
  7: 'Medical Certificate',
  8: 'Certificate Of Attendance',
  9: 'Referral Letter',
  11: 'Memo',
  12: 'Other Documents',
  13: 'Credit Note Listing Report',
  14: 'Void Credit Note & Payment Report',
  15: 'Tax Invoice',
  16: 'Outstanding Payment Report',
  17: 'Sales Listing Report',
  18: 'Credit Note',
  19: 'Low Stock Consumables Report',
  20: 'Inventory Threshold Report',
  22: 'Inventory Movement Report',
  23: 'Deposit Transaction Report',
  24: 'Drug Label Report',
  25: 'Statement Report',
  26: 'Purchase Order',
  27: 'Patient Label',
  28: 'Gst Details Report',
  29: 'Payment Receipt',
  30: 'Chas Claim Report',
  32: 'Patient Label 89mmx36mm',
  35: 'Post Card',
  36: 'Post Card 89mmx36mm',
  37: 'Inventory Trending Report',
  38: 'Appointment List Report',
  39: 'Inventory Listing Report',
  40: 'Inventory Stock Count Report',
  41: 'Patient Address Label',
  42: 'Patient Address Label 89mmx36mm',
  43: 'Copayer Address Label',
  44: 'Copayer Address Label 89mmx36mm',
  45: 'Patient Label 76mmx38mm',
  47: 'Patient Address Label 76mmx38mm',
  49: 'Copayer Address Label 76mmx38mm',
  50: 'Supplier Address Label',
  51: 'Supplier Address Label 89mmx36mm',
  52: 'Supplier Address Label 76mmx38mm',
  53: 'Patient Result Report',
  54: 'Statement Summary Report',
  55: 'Letter Of Certification',
  56: 'Statement Payment Receipt',
  57: 'Patient Deposit Transaction Details',
  58: 'Patient Deposit Receipt',
  59: 'Invoice Listing Report',
  60: 'Payment Collection Report (Summary)',
  61: 'Refraction Form Report',
  62: 'Patient Ageing Report',
  63: 'Visit Listing Report',
  64: 'Purchase & Receiving Listing Report',
  65: 'Receiving Goods',
  67: 'WIP Revenue Report',
  68: 'Patient History Report',
  69: 'Referral Person Label',
  70: 'Referral Person Label 89mmx36mm',
  71: 'Referral Person Label 76mmx38mm',
  72: 'Referral Source Report',
  73: 'Referral Source Label',
  74: 'Referral Source Label 89mmx36mm',
  75: 'Referral Source Label 76mmx38mm',
  76: 'Expiring Stock Report',
  77: 'Sales Listing By Performer Report',
  79: 'Xero Invoices Report',
  80: 'Visitation Invoice Report',
  81: 'Daily Appointment Listing Report',
  85: 'Dispensary Report',
  87: 'Patient Info Leaflet',
  89: 'Tax Invoice (Group)',
  90: 'Drug Summary Label Report 80mmx45mm',
  91: 'Purchase Request',
  93: 'Medical Report',
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
  REFERRAL_PERSON_LABEL_80MM_45MM: 69,
  REFERRAL_PERSON_LABEL_89MM_36MM: 70,
  REFERRAL_PERSON_LABEL_76MM_38MM: 71,
  REFERRAL_SOURCE_LABEL_80MM_45MM: 73,
  REFERRAL_SOURCE_LABEL_89MM_36MM: 74,
  REFERRAL_SOURCE_LABEL_76MM_38MM: 75,
  PATIENT_INFO_LEAFLET: 87,
  DRUG_LABEL_80MM_45MM_V2: 88,
  DRUG_SUMMARY_LABEL_80MM_45MM: 90,
  LAB_SPECIMEN_LABEL_50MM_34MM: 92,
  MAILING_COVER_PAGE: 95,
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

export const RECEIVING_GOODS_STATUS_TEXT = {
  DRAFT: 'Draft',
  CANCELLED: 'Cancelled',
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

export const PharmacyWorkitemStatus = {
  1: 'New',
  2: 'Prepared',
  3: 'Verified',
  4: 'Completed',
}

export const VISIT_TYPE = {
  OTC: 2,
  BF: 3,
}

export const VISIT_TYPE_NAME = [
  {
    visitPurposeFK: VISIT_TYPE.OTC,
    displayCode: 'OTC',
  },
  {
    visitPurposeFK: VISIT_TYPE.BF,
    displayCode: 'BF',
  },
]

export const DEFAULT_PAYMENT_MODE_GIRO = {
  PAYMENT_FK: 5,
  DISPLAY_VALUE: 'GIRO',
}

export const ORDER_TYPE_TAB = {
  SERVICE: '3',
  CONSUMABLE: '4',
  ORDERSET: '6',
}

export const PATIENT_HISTORY_TABS = {
  VISIT: 1,
  DISPENSE: 2,
  APPOINTMENT: 3,
  NURSENOTES: 4,
  REFERRAL: 5,
}

export const PATIENT_ACCOUNT_TABS = {
  INVOICE: 1,
  DEPOSIT: 2,
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
  MEDICALCERTIFICATE: 7,
  APPOINTMENTREMARKS: 10,
  SERVICEINSTRUCTION: 11,
  NURSENOTES: 14,
}

export const CANNED_TEXT_TYPE_BASE_TEXT = [
  CANNED_TEXT_TYPE.MEDICALCERTIFICATE,
  CANNED_TEXT_TYPE.APPOINTMENTREMARKS,
  CANNED_TEXT_TYPE.SERVICEINSTRUCTION,
]

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
  EYE: 4,
}

export const FILE_CATEGORY = {
  VISITREG: 1,
  CONSULTATION: 2,
  PATIENT: 3,
  QUEUEDISPLAY: 4,
  COPAYER: 5,
}

export const PURCHASE_ORDER_STATUS = {
  DRAFT: 1,
  FINALIZED: 2,
  PARTIALREVD: 3,
  CANCELLED: 4,
  FULFILLED: 5,
  COMPLETED: 6,
}

export const RECEIVING_GOODS_STATUS = {
  DRAFT: 1,
  CANCELLED: 2,
  COMPLETED: 3,
}

export const NUMBER_TYPE = {
  MOBILE: 1,
  HOME: 2,
  WORK: 3,
  FAX: 4,
}

export const APPNOTIFICATION_SCHEMA = {}

export const NOTIFICATION_TYPE = {
  QUEUE: 1,
  CODETABLE: 2,
  ERROR: 3,
  CONSULTAION: 4,
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
  INSURANCE: 16,
}

export const SCHEME_CATEGORY = {
  CORPORATE: 5,
  INSURANCE: 11,
}

export const INVOICE_VIEW_MODE = {
  DEFAULT: 'default',
  APPLIED_SCHEME: 'applied_scheme',
  Edit_Invoice: 'edit_invoice',
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

export const REVENUE_CATEGORY = {
  CONSULTATION: 1,
  EXAMINATION: 2,
  PROCEDURE: 3,
  DIAGNOSTIC: 4,
  DRUG: 5,
  CONSUMABLE: 6,
  OTHER: 7,
}

export const DURATION_UNIT = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4,
}

export const DIAGNOSIS_TYPE = {
  ICD10DIANOGSIS: 'ICD10',
  SNOMEDDIAGNOSIS: 'Snomed',
}

export const SERVICE_CENTER_CATEGORY = {
  INTERNALSERVICECENTRE: 1,
  EXTERNALSERVICECENTRE: 2,
  INTERNALRADIOLOGYSERVICECENTER: 3,
  INTERNALLABSERVICECENTER: 4,
  EXTERNALRADIOLOGYSERVICECENTRE: 5,
  EXTERNALLABSERVICECENTRE: 6,
}

export const RADIOLOGY_WORKITEM_STATUS_TITLE = {
  1: 'New',
  2: 'In Progress',
  3: 'Modality Completed',
  4: 'Completed',
  5: 'Cancelled',
}

export const RADIOLOGY_WORKITEM_STATUS = {
  NEW: 1,
  INPROGRESS: 2,
  MODALITYCOMPLETED: 3,
  COMPLETED: 4,
  CANCELLED: 5,
}

export const RADIOLOGY_WORKLIST_STATUS_COLOR = {
  1: '#009933',
  2: '#960',
  3: '#099',
  4: '#366',
  5: '#797979',
}

export const RADIOLOGY_WORKITEM_BUTTON = [
  {
    name: 'Start Examination',
    currentStatusFK: 1,
    nextStatusFK: 2,
    enableCancel: true,
    authority: 'radiologyworklist.startexamination',
  },
  {
    name: 'Complete Modality',
    currentStatusFK: 2,
    nextStatusFK: 3,
    enableCancel: true,
    authority: 'radiologyworklist.completemodality',
  },
  {
    name: 'Complete Reporting',
    currentStatusFK: 3,
    nextStatusFK: 4,
    enableCancel: false,
    authority: 'radiologyworklist.completereporting',
  },
]

export const mapApptStatus = statusFK => {
  let status = ''
  switch (statusFK) {
    case APPOINTMENT_STATUS.CANCELLED:
    case APPOINTMENT_STATUS.PFA_CANCELLED:
      status = 'Cancelled'
      break
    case APPOINTMENT_STATUS.CONFIRMED:
      status = 'Confirmed'
      break
    case APPOINTMENT_STATUS.DELETED:
      status = 'Deleted'
      break
    case APPOINTMENT_STATUS.TURNEDUP:
    case APPOINTMENT_STATUS.TURNEDUPLATE:
    case APPOINTMENT_STATUS.PFA_NOSHOW:
      status = 'Last Confirmed'
      break
    case APPOINTMENT_STATUS.RESCHEDULED:
    case APPOINTMENT_STATUS.PFA_RESCHEDULED:
      status = 'Rescheduled'
      break
  }
  return status
}

export const INVALID_APPOINTMENT_STATUS = [
  APPOINTMENT_STATUS.RESCHEDULED,
  APPOINTMENT_STATUS.PFA_RESCHEDULED,
  APPOINTMENT_STATUS.DELETED,
]

export const PHARMACY_STATUS = {
  NEW: 1,
  PREPARED: 2,
  VERIFIED: 3,
  COMPLETED: 4,
}

export const PHARMACY_ACTION = {
  REDISPENSE: 'Redispense',
  PREPARE: 'Prepare',
  VERIFY: 'Verify',
  COMPLETE: 'Complete',
  CANCEL: 'Cancel',
  COMPLETEPARTIAL: 'CompletePartial',
}

export const CHECKLIST_CATEGORY = {
  DOCTORCONSULTATION: 2,
}

export const GENDER = { FEMALE: 1, MALE: 2 }

export const MODALITY_STATUS = {
  PENDING: 1,
  PROCESSING: 2,
  SUCCESSFUL: 3,
  FAILED: 4,
}

export const FOLDER_TYPE = {
  PATIENT: 'Patient',
  COPAYER: 'CoPayer',
}

export const PRIORITY_VALUES = { NORMAL: 'Normal', URGENT: 'Urgent' }

export const PRIORITY_OPTIONS = [
  {
    value: 'Normal',
    name: 'Normal',
  },
  {
    value: 'Urgent',
    name: 'Urgent',
  },
]

export const DOCUMENT_CATEGORY = {
  CONSULTATIONDOCUMENT: 1,
  FORM: 2,
}

export const DOCUMENT_TEMPLATE_TYPE = {
  REFERRALLETTER: 1,
  MEMO: 2,
  OTHERS: 4,
  CONSENTFORM: 5,
  QUESTIONNAIRE: 6,
}

export const DOCUMENTCATEGORY_DOCUMENTTYPE = [
  {
    documentCategoryFK: DOCUMENT_CATEGORY.CONSULTATIONDOCUMENT,
    templateTypes: [
      DOCUMENT_TEMPLATE_TYPE.REFERRALLETTER,
      DOCUMENT_TEMPLATE_TYPE.MEMO,
      DOCUMENT_TEMPLATE_TYPE.OTHERS,
    ],
  },
  {
    documentCategoryFK: DOCUMENT_CATEGORY.FORM,
    templateTypes: [
      DOCUMENT_TEMPLATE_TYPE.CONSENTFORM,
      DOCUMENT_TEMPLATE_TYPE.QUESTIONNAIRE,
      DOCUMENT_TEMPLATE_TYPE.OTHERS,
    ],
  },
]

export const CALENDAR_VIEWS = {
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
}

export const CALENDAR_RESOURCE = {
  DOCTOR: 'Doctor',
  RESOURCE: 'Resource',
}

export const ORDER_TYPES = {
  CONSUMABLE: '4',
  SERVICE: '3',
  // ORDER_SET: '6',
  // TREATMENT: '7',
}

export const VISITDOCTOR_CONSULTATIONSTATUS = {
  WAITING: 'Waiting',
  INPROGRESS: 'In Progress',
  PAUSED: 'Paused',
  COMPLETED: 'Completed',
}

export const YESNOOPTIUONS = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
]

export const AGETYPE = {
  CHILD: 'Child',
  YOUTH: 'Youth',
  ADULT: 'Adult',
}

export const INVOICE_REPORT_TYPES = {
  SUMMARYINVOICE: 'Summary Invoice',
  INDIVIDUALINVOICE: 'Individual Invoice',
  CLAIMABLEITEMCATEGORYINVOICE: 'Claimable Item Category Invoice',
  ITEMCATEGORYINVOICE: 'Item Category Invoice',
  CLAIMABLEITEMINVOICE: 'Claimable Item Invoice',
  DETAILEDINVOICE: 'Detailed Invoice',
  PAYMENT_RECEIPT: 'Payment Receipt',
}

export const TESTTYPES = {
  BASICEXAMINATION: 'BasicExamination',
  BPSYS: 'BPSys',
  BPDIA: 'BPDIA',
  PULSE: 'Pulse',
  BMI: 'BMI',
  ROHRER: 'Rohrer',
  KAUP: 'kaup',
  WAIST: 'Waist',
  IOP: 'IOP',
  COLORVISIONTEST: 'ColorVisionTest',
  PREGNANCY: 'Pregnancy',
  MENSES: 'Menses',
  R5MCORRECTED: 'Right5mCorrected',
  R50CMCORRECTED: 'Right50cmCorrected',
  L5MCORRECTED: 'Left5mCorrected',
  L50CMCORRECTED: 'Left50cmCorrected',
}

export const DISPENSE_FROM = {
  QUEUE: 1,
}

export const EXAMINATION_STATUS = {
  NEW: 'New',
  INPROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const APPOINTMENT_STAGE_COLOR = [
  {
    code: 'Draft',
    color: '#E36C0A',
  },
  {
    code: 'Confirmed',
    color: '#548DD4',
  },
  {
    code: 'Registered',
    color: '#47CFFF',
  },
  {
    code: 'Consultation',
    color: '#FF5353',
  },
  {
    code: 'Billing',
    color: '#97E551',
  },
  {
    code: 'Completed',
    color: '#00B853',
  },
]

export const VISIT_STATUS = [
  {
    id: 1,
    code: 'COMPLETED',
    displayValue: 'Completed',
  },
  {
    id: 2,
    code: 'UNGRADED',
    displayValue: 'Ungraded',
  },
  {
    id: 3,
    code: 'VERIFIED',
    displayValue: 'Verified',
  },
]

export const CLINICALNOTE_FORM = {
  PATIENTHISTORY: 1,
  VISIONREFRACTION: 2,
  PRELIMINARYASSESSMENT: 3,
  ANTERIOREYEEXAMINATION: 4,
  POSTERIOREYEEXAMINATION: 5,
  MANAGEMENT: 6,
  CONTACTLENSFITTING: 7,
  BINOCULARVISION: 8,
  PAEDIATRIC: 9,
  INVESTIGATIVETESTS: 10,
  FOLLOWUP: 11,
}

export const CLINICALNOTE_FORMTHUMBNAIL = {
  POSTERIOREYEEXAMINATION:
    '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',
}
