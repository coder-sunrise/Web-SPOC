const corAttchementTypes = [
  {
    id: 1,
    type: 'ClinicalNotes',
    name: 'Consultation Attachment',
    accessRight: 'queue.consultation.widgets.attachment',
  },
  {
    id: 2,
    type: 'VisitReferral',
    name: 'Referral Attachment',
    accessRight: 'queue.consultation.widgets.attachment',
  },
  {
    id: 3,
    type: 'Visit',
    name: 'Visit Attachment',
    accessRight: 'queue.consultation.widgets.attachment',
  },
  {
    id: 4,
    type: 'EyeVisualAcuity',
    name: 'Visual Acuity Test',
    accessRight: 'queue.consultation.widgets.eyevisualacuity',
  },
]

module.exports = {
  corAttchementTypes,
  ...module.exports,
}
