import { consultationDocumentTypes, formTypes } from '@/utils/codes'
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

const convertEyeForms = (values) => {
  const { corEyeRefractionForm, corEyeExaminationForm } = values

  const removeFields = (obj, fields = []) => {
    if (Array.isArray(obj)) {
      for (let n = 0; n < obj.length; n++) {
        const isEmpty = removeFields(obj[n], fields)
        if (isEmpty) {
          obj.splice(n, 1)
          n--
        }
      }
    } else if (typeof obj === 'object') {
      for (let value in obj) {
        if (Array.isArray(obj[value])) {
          removeFields(obj[value], fields)
        }
      }
      fields.forEach((o) => {
        delete obj[o]
      })

      // check all of fields is empty
      let allFieldIsEmtpy = true
      for (let i in obj) {
        if (i !== 'id' && obj[i] !== undefined && obj[i] !== '') {
          allFieldIsEmtpy = false
          break
        }
      }

      return allFieldIsEmtpy
    }
  }

  const durtyFields = [
    'isDeleted',
    'isNew',
    'IsSelected',
    'rowIndex',
    '_errors',
    'OD',
    'OS',
  ]
  if (
    corEyeRefractionForm &&
    corEyeRefractionForm.formData &&
    typeof corEyeRefractionForm.formData === 'object'
  ) {
    let { formData } = values.corEyeRefractionForm
    removeFields(formData, durtyFields)

    values.corEyeRefractionForm.formData = JSON.stringify(formData)
  }
  if (
    corEyeExaminationForm &&
    corEyeExaminationForm.formData &&
    typeof corEyeExaminationForm.formData === 'object'
  ) {
    let { formData } = corEyeExaminationForm
    removeFields(formData, durtyFields)
    const { EyeExaminations = [] } = formData
    console.log('EyeExaminations', EyeExaminations)
    if (
      EyeExaminations.find(
        (ee) =>
          (ee.LeftEye !== undefined &&
            ee.LeftEye !== null &&
            ee.LeftEye !== '') ||
          (ee.RightEye !== undefined &&
            ee.RightEye !== null &&
            ee.RightEye !== ''),
      )
    ) {
      values.corEyeExaminationForm.formData = JSON.stringify(formData)
    } else {
      values.corEyeExaminationForm.formData = JSON.stringify({})
    }
  }
  return values
}
const convertConsultationDocument = (consultationDocument) => {
  let result = {}
  const { rows = [] } = consultationDocument
  consultationDocumentTypes.forEach((p) => {
    result[p.prop] = rows.filter((o) => o.type === p.value)
  })
  return result
}

const convertToConsultation = (
  values,
  { consultationDocument, orders, forms },
) => {
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

  values = convertEyeForms(values)

  const formRows = forms.rows
  formTypes.forEach((p) => {
    values[p.prop] = formRows
      ? formRows.filter((o) => o.type === p.value).map((val) => {
          return {
            ...val,
            formData: JSON.stringify({
              ...val.formData,
              otherDiagnosis: val.formData.otherDiagnosis.map((d) => {
                const { diagnosiss, ...retainData } = d
                return {
                  ...retainData,
                }
              }),
            }),
          }
        })
      : []
  })
  return {
    ...values,
    isGSTInclusive,
  }
}

module.exports = {
  ...module.exports,
  orderTypes,
  convertToConsultation,
  convertConsultationDocument,
}
