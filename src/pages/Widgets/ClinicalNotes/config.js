import { SCRIBBLE_NOTE_TYPE, CANNED_TEXT_TYPE } from '@/utils/constants'

export const defaultConfigs = {
  fields: [
    {
      authority: 'queue.consultation.clinicalnotes.history',
      category: 'History',
      fieldName: 'history',
      fieldTitle: 'History',
      scribbleField: 'historyScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.HISTORY,
      cannedTextTypeFK: CANNED_TEXT_TYPE.HISTORY,
      index: 0,
      height: 390,
    },
    {
      authority: 'queue.consultation.clinicalnotes.chiefcomplaints',
      category: 'ChiefComplaints',
      fieldName: 'chiefComplaints',
      fieldTitle: 'Chief Complaints',
      scribbleField: 'chiefComplaintsScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CHIEFCOMPLAINTS,
      index: 1,
    },
    {
      authority: 'queue.consultation.clinicalnotes.clinicalnotes',
      category: 'Note',
      fieldName: 'note',
      fieldTitle: 'Clinical Notes',
      scribbleField: 'notesScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES,
      cannedTextTypeFK: CANNED_TEXT_TYPE.NOTE,
      index: 2,
    },
    {
      authority: 'queue.consultation.clinicalnotes.plan',
      category: 'Plan',
      fieldName: 'plan',
      fieldTitle: 'Plan',
      scribbleField: 'planScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.PLAN,
      cannedTextTypeFK: CANNED_TEXT_TYPE.PLAN,
      index: 3,
    },
  ],
}
