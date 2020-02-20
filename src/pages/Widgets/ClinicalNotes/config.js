import {
  CLINIC_TYPE,
  SCRIBBLE_NOTE_TYPE,
  CANNED_TEXT_TYPE,
} from '@/utils/constants'

export const fieldKey = {
  [CLINIC_TYPE.GP]: 'gpFieldName',
  [CLINIC_TYPE.DENTAL]: 'dentalFieldName',
}

export const scribbleNoteTypeFieldKey = {
  [CLINIC_TYPE.GP]: 'gpScribbleNoteTypeFK',
  [CLINIC_TYPE.DENTAL]: 'dentalScribbleNoteTypeFK',
}

export const defaultConfigs = {
  fields: [
    {
      authority: 'queue.consultation.clinicalnotes.clinicalnotes',
      category: 'ClinicianNote',
      gpFieldName: 'clinicianNote',
      dentalFieldName: 'clinicianNote',
      fieldTitle: 'Clinical Notes',
      scribbleField: 'notesScribbleArray',
      gpScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES,
      dentalScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.DENTALCLINICALNOTES,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CLINICALNOTES,
      index: 0,
    },
    {
      authority: 'queue.consultation.clinicalnotes.chiefcomplaints',
      category: 'ChiefComplaints',
      gpFieldName: 'chiefComplaints',
      dentalFieldName: 'complaints',
      fieldTitle: 'Chief Complaints',
      scribbleField: 'chiefComplaintsScribbleArray',
      gpScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS,
      dentalScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.DENTALCOMPLAINTS,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CHIEFCOMPLAINTS,
      index: 1,
    },
    {
      authority: 'queue.consultation.clinicalnotes.plan',
      category: 'Plan',
      gpFieldName: 'plan',
      dentalFieldName: 'plan',
      fieldTitle: 'Plan',
      scribbleField: 'planScribbleArray',
      gpScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.PLAN,
      dentalScribbleNoteTypeFK: undefined,
      cannedTextTypeFK: CANNED_TEXT_TYPE.PLAN,
      index: 2,
    },
    {
      authority: 'queue.consultation.clinicalnotes.associatedhistory',
      category: 'AssociatedHistory',
      gpFieldName: 'associatedHistory',
      dentalFieldName: 'associatedHistory',
      fieldTitle: 'Associated History',
      scribbleField: 'associatedHistoryScribbleArray',
      gpScribbleNoteTypeFK: undefined,
      dentalScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.DENTALASSOCIATEHISTORY,
      cannedTextTypeFK: CANNED_TEXT_TYPE.ASSOCIATEDHISTORY,
      index: 3,
    },
    {
      authority: 'queue.consultation.clinicalnotes.intraoral',
      category: 'IntraOral',
      gpFieldName: 'intraOral',
      dentalFieldName: 'intraOral',
      fieldTitle: 'Intra Oral',
      scribbleField: 'intraOralScribbleArray',
      gpScribbleNoteTypeFK: undefined,
      dentalScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.DENTALINTRAORAL,
      cannedTextTypeFK: CANNED_TEXT_TYPE.INTRAORAL,
      index: 4,
    },
    {
      authority: 'queue.consultation.clinicalnotes.extraoral',
      category: 'ExtraOral',
      gpFieldName: 'extraOral',
      dentalFieldName: 'extraOral',
      fieldTitle: 'Extra Oral',
      scribbleField: 'extraOralScribbleArray',
      gpScribbleNoteTypeFK: undefined,
      dentalScribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.DENTALEXTRAORAL,
      cannedTextTypeFK: CANNED_TEXT_TYPE.EXTRAORAL,
      index: 5,
    },
  ],
}
