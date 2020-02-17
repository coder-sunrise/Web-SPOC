import { SCRIBBLE_NOTE_TYPE, CANNED_TEXT_TYPE } from '@/utils/constants'

export const gpConfigs = {
  fields: [
    {
      category: 'ClinicianNote',
      fieldName: 'clinicianNote',
      fieldTitle: 'Clinical Notes',
      scribbleField: 'notesScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CLINICALNOTES,
      index: 0,
    },
    {
      category: 'ChiefComplaints',
      fieldName: 'chiefComplaints',
      fieldTitle: 'Chief Complaints',
      scribbleField: 'chiefComplaintsScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CHIEFCOMPLAINTS,
      index: 1,
    },
    {
      category: 'Plan',
      fieldName: 'plan',
      fieldTitle: 'Plan',
      scribbleField: 'planScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.PLAN,
      cannedTextTypeFK: undefined,
      index: 2,
    },
  ],
  cfg: {
    hasAttachment: true,
  },
}

export const dentalConfigs = {
  fields: [
    {
      category: 'ClinicianNote',
      fieldName: 'clinicianNote',
      fieldTitle: 'Clinical Notes',
      scribbleField: 'notesScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CLINICALNOTES,
      index: 0,
    },
    {
      category: 'ChiefComplaints',
      fieldName: 'chiefComplaints',
      fieldTitle: 'Chief Complaints',
      scribbleField: 'chiefComplaintsScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CHIEFCOMPLAINTS,
      index: 1,
    },
    {
      category: 'AssociatedHistory',
      fieldName: 'associatedHistory',
      fieldTitle: 'Associated History',
      scribbleField: 'associatedHistoryScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.ASSOCIATEDHISTORY,
      cannedTextTypeFK: CANNED_TEXT_TYPE.ASSOCIATEDHISTORY,
      index: 2,
    },
    {
      category: 'IntraOral',
      fieldName: 'intraOral',
      fieldTitle: 'Intra Oral',
      scribbleField: 'intraOralScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.INTRAORAL,
      cannedTextTypeFK: CANNED_TEXT_TYPE.INTRAORAL,
      index: 3,
    },
    {
      category: 'ExtraOral',
      fieldName: 'extraOral',
      fieldTitle: 'Extra Oral',
      scribbleField: 'extraOralScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.EXTRAORAL,
      cannedTextTypeFK: CANNED_TEXT_TYPE.EXTRAORAL,
      index: 4,
    },
  ],
  cfg: {
    hasAttachment: false,
  },
}

export default gpConfigs
