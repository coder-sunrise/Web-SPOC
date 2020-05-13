import { consultationDocumentTypes } from '@/utils/codes'
import Medication from '@/pages/Widgets/Orders/Detail/Medication'
import Vaccination from '@/pages/Widgets/Orders/Detail/Vaccination'
import Service from '@/pages/Widgets/Orders/Detail/Service'
import Consumable from '@/pages/Widgets/Orders/Detail/Consumable'
import OrderSet from '@/pages/Widgets/Orders/Detail/OrderSet'
import Treatment from '@/pages/Widgets/Orders/Detail/Treatment'

const orderTypes = [
  {
    name: 'Medication',
    value: '1',
    prop: 'corPrescriptionItem',
    accessRight: 'queue.consultation.order.medication',
    filter: (r) => !!r.inventoryMedicationFK,
    getSubject: (r) => {
      return r.drugName
    },
    component: (props) => <Medication {...props} />,
  },
  {
    name: 'Vaccination',
    value: '2',
    prop: 'corVaccinationItem',
    accessRight: 'queue.consultation.order.vaccination',
    getSubject: (r) => r.vaccinationName,
    component: (props) => <Vaccination {...props} />,
  },
  {
    name: 'Service',
    value: '3',
    prop: 'corService',
    accessRight: 'queue.consultation.order.service',
    getSubject: (r) => r.serviceName,
    component: (props) => <Service {...props} />,
  },
  {
    name: 'Consumable',
    value: '4',
    prop: 'corConsumable',
    accessRight: 'queue.consultation.order.consumable',
    getSubject: (r) => r.consumableName,
    component: (props) => <Consumable {...props} />,
  },
  {
    name: 'Open Prescription',
    value: '5',
    prop: 'corPrescriptionItem',
    accessRight: 'queue.consultation.order.openprescription',
    filter: (r) => !r.inventoryMedicationFK,
    getSubject: (r) => r.drugName,
    component: (props) => <Medication openPrescription {...props} />,
  },
  {
    name: 'Order Set',
    value: '6',
    accessRight: 'queue.consultation.order.orderset',
    component: (props) => <OrderSet {...props} />,
  },
  {
    name: 'Treatment',
    value: '7',
    prop: 'corDentalTreatments',
    accessRight: 'queue.consultation.order.treatment',
    getSubject: (r) => r.itemName,
    component: (props) => <Treatment {...props} />,
  },
]

const convertToConsultation = (values, { consultationDocument, orders }) => {
  const { rows = [] } = consultationDocument
  consultationDocumentTypes.forEach((p) => {
    values[p.prop] = rows.filter((o) => o.type === p.value)
  })
  const { rows: orderRows = [], finalAdjustments = [], isGSTInclusive } = orders
  values.corOrderAdjustment = finalAdjustments
  orderTypes.forEach((p, i) => {
    if (p.prop) {
      if (p.value === '5') {
        values[p.prop] = (values[p.prop] || [])
          .concat(orderRows.filter((o) => o.type === p.value))
      } else {
        values[p.prop] = orderRows.filter((o) => o.type === p.value)
      }
    }
  })
  const { dentalChartComponent } = window.g_app._store.getState()

  if (dentalChartComponent) {
    const { isPedoChart, isSurfaceLabel, data } = dentalChartComponent
    values.corDentalCharts = [
      {
        ...(values.corDentalCharts || [])[0],
        isPedoChart,
        isSurfaceLabel,
        dentalChart: JSON.stringify(data),
      },
    ]
    // values.corDentalCharts = data.map(o=>)
  }

  const { corEyeRefractionForm, corEyeExaminationForm } = values
  if (
    corEyeRefractionForm &&
    corEyeRefractionForm.formData &&
    typeof corEyeRefractionForm.formData === 'object'
  ) {
    values.corEyeRefractionForm.formData = JSON.stringify(
      corEyeRefractionForm.formData,
    )
  }
  if (
    corEyeExaminationForm &&
    corEyeExaminationForm.formData &&
    typeof corEyeExaminationForm.formData === 'object'
  ) {
    values.corEyeExaminationForm.formData = JSON.stringify(
      corEyeExaminationForm.formData,
    )
  }

  return {
    ...values,
    isGSTInclusive,
  }
}

module.exports = {
  ...module.exports,
  orderTypes,
  convertToConsultation,
}
