const corAttchementTypes = [
  {
    id: 1,
    type: 'ClinicalNotes',
    name: 'Consultation Attachment',
    accessRight: '',
  },
  {
    id: 2,
    type: 'VisitReferral',
    name: 'Referral Attachment',
    accessRight: '',
  },
  {
    id: 3,
    type: 'Visit',
    name: 'Visit Attachment',
    accessRight: '',
  },
  {
    id: 4,
    type: 'EyeVisualAcuity',
    name: 'Visual Acuity Test',
    accessRight: '2',
  },
]

module.exports = {
  corAttchementTypes,
  ...module.exports,
}
