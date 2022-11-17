import _ from 'lodash'
import { consultationDocumentTypes, formTypes } from '@/utils/codes'
import Service from '@/pages/Widgets/Orders/Detail/Service'
import Consumable from '@/pages/Widgets/Orders/Detail/Consumable'
// import OrderSet from '@/pages/Widgets/Orders/Detail/OrderSet'
// import Treatment from '@/pages/Widgets/Orders/Detail/Treatment'
import { SERVICE_CENTER_CATEGORY } from '@/utils/constants'

import moment from 'moment'
import { getUniqueId, getTranslationValue } from '@/utils/utils'
import { ORDER_TYPES } from '@/utils/constants'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'
import { formConfigs } from '@/pages/Widgets/ClinicalNotes/config'
import { getIn, setIn } from 'formik'

const orderTypes = [
  {
    type: 'Consumable',
    name: 'Product',
    value: ORDER_TYPES.CONSUMABLE,
    prop: 'corConsumable',
    accessRight: 'queue.consultation.order.consumable',
    getSubject: r => r.consumableName,
    component: props => <Consumable {...props} />,
  },
  {
    type: 'Service',
    name: 'Service',
    value: ORDER_TYPES.SERVICE,
    prop: 'corService',
    accessRight: 'queue.consultation.order.service',
    getSubject: r => r.serviceName,
    component: props => <Service {...props} />,
  },
  // {
  //   name: 'Order Set',
  //   value: ORDER_TYPES.ORDER_SET,
  //   accessRight: 'queue.consultation.order.orderset',
  //   component: props => <OrderSet {...props} />,
  // },
  // {
  //   name: 'Treatment',
  //   value: ORDER_TYPES.TREATMENT,
  //   prop: 'corDentalTreatments',
  //   accessRight: 'queue.consultation.order.treatment',
  //   getSubject: r => r.itemName,
  //   component: props => <Treatment {...props} />,
  // },
]

const cleanFields = (obj, dirtyFields = []) => {
  if (Array.isArray(obj)) {
    for (let n = 0; n < obj.length; n++) {
      const isEmptyObj = cleanFields(obj[n], dirtyFields)
      if (isEmptyObj) {
        obj.splice(n, 1)
        n--
      }
    }
    return _.isEmpty(obj)
  }
  if (typeof obj === 'object') {
    let invalidColumns = []
    for (let value in obj) {
      if (obj[value] === undefined || obj[value] === null) {
        invalidColumns.push(value)
      } else if (Array.isArray(obj[value]) || typeof obj[value] === 'object') {
        const isEmpty = cleanFields(obj[value], dirtyFields)
        if (isEmpty || !obj[value] || _.isEmpty(obj[value])) {
          invalidColumns.push(value)
        }
      } else if (typeof obj[value] === 'boolean' && obj[value] === false) {
        invalidColumns.push(value)
      } else if (typeof obj[value] === 'string' && obj[value].trim() === '') {
        invalidColumns.push(value)
      }
    }

    invalidColumns.concat(dirtyFields).forEach(o => {
      delete obj[o]
    })

    let isEmptyObj = !Object.keys(obj).find(f => f !== 'id')
    return isEmptyObj
  }
  return false
}

const convertEyeForms = values => {
  const {
    corEyeRefractionForm,
    corEyeExaminationForm,
    corEyeVisualAcuityTest,
  } = values

  const durtyFields = [
    'isDeleted',
    'isNew',
    'IsSelected',
    'rowIndex',
    '_errors',
  ]
  if (corEyeRefractionForm) {
    let { formData = {} } = values.corEyeRefractionForm
    cleanFields(formData, [...durtyFields, 'OD', 'OS'])

    values.corEyeRefractionForm.formData = _.isEmpty(formData)
      ? undefined
      : JSON.stringify(formData)
  }
  if (corEyeExaminationForm) {
    let { formData = {} } = corEyeExaminationForm
    cleanFields(formData, durtyFields)

    const examinations = formData.EyeExaminations || []
    const ignoreColumns = ['id', 'EyeExaminationTypeFK', 'EyeExaminationType']
    const validObjects = examinations.filter(
      f => _.difference(Object.keys(f), ignoreColumns).length > 0,
    )
    formData.EyeExaminations = validObjects
    values.corEyeExaminationForm.formData =
      validObjects.length === 0 ? undefined : JSON.stringify(formData)
  }

  if (typeof corEyeVisualAcuityTest === 'object') {
    const { eyeVisualAcuityTestForms: testForm } = corEyeVisualAcuityTest
    const clone = _.cloneDeep(testForm)
    cleanFields(clone)

    const newTestForm = testForm.reduce((p, c) => {
      let newItem = clone.find(i => i.id === c.id)
      if (!newItem) {
        if (c.id > 0 && c.concurrencyToken && c.isDeleted === false) {
          return [
            ...p,
            {
              ...c,
              isDeleted: true,
            },
          ]
        }
      } else {
        return [
          ...p,
          {
            ...newItem,
            isDeleted: c.isDeleted,
          },
        ]
      }

      return p
    }, [])

    values.corEyeVisualAcuityTest.eyeVisualAcuityTestForms = newTestForm
  }
  return values
}
const convertConsultationDocument = consultationDocument => {
  let result = {}
  const { rows = [] } = consultationDocument
  consultationDocumentTypes.forEach(p => {
    result[p.prop] = rows.filter(o => o.type === p.value)
  })
  return result
}

const convertToConsultation = (
  values,
  { consultationDocument, orders, forms },
) => {
  const { rows = [] } = consultationDocument
  consultationDocumentTypes.forEach(p => {
    values[p.prop] = rows.filter(o => o.type === p.value)
  })
  const { rows: orderRows = [], finalAdjustments = [], isGSTInclusive } = orders

  values.corOrderAdjustment = finalAdjustments
  orderTypes.forEach((p, i) => {
    if (p.prop) {
      values[p.prop] = (values[p.prop] || []).concat(
        orderRows.filter(o => o.type === p.value),
      )
    }
  })

  values = convertClinicalNotesForms(values)
  values = convertEyeForms(values)

  const formRows = forms.rows
  formTypes.forEach(p => {
    values[p.prop] = formRows
      ? formRows
          .filter(o => o.type === p.value)
          .map(val => {
            return { ...val, formData: JSON.stringify(val.formData) }
          })
      : []
  })

  return {
    ...values,
    isGSTInclusive,
  }
}

const convertClinicalNotesForms = values => {
  formConfigs.forEach(form => {
    var list = getIn(values, form.prop) || []
    var entity = getIn(values, form.prefixProp)
    var oldList = list.map(x => ({ ...x }))
    //check list any old item
    if (list && list.length > 0) {
      //unticked form
      if (!entity) {
        list[0].isDeleted = true
      } else {
        //add new after unticked
        if (!entity.id) {
          list[0].isDeleted = true
          entity.lastChangeDate = moment()
          list.push({ ...entity })
        }
        //update old item
        else {
          list[0] = {
            ...list[0],
            ...entity,
          }
        }
      }
    }
    //fist add
    else if (entity) {
      entity.lastChangeDate = moment()
      list.push(entity)
      values = setIn(values, form.prop, list)
    }

    values = setIn(values, form.prefixProp, undefined)
    list.forEach(item => {
      item.rightScribbleNote = undefined
      item.leftScribbleNote = undefined
      item.ocularMotilityScribbleNote = undefined
    })
  })

  return values
}

const cleanConsultation = values => {
  // remove irrelevant to api values
  const { visitConsultationTemplate, corDoctorNote, ...rest } = values

  // ordering
  return {
    corDoctorNote,
    ...rest,
  }
}

const generateConsumable = item => {
  if (!item) return {}
  return {
    consumableCode: item.consumableCode,
    consumableName: item.consumableName,
    inventoryConsumableFK: item.inventoryConsumableFK,
    isDeleted: item.isDeleted,
    quantity: item.quantity,
    remark: item.remark,
    unitOfMeasurement: item.unitOfMeasurement,
  }
}

const isItemUpdate = item => {
  let isEqual = true
  const currentRow = rows.find(r => r.id === item.id && r.type === item.type)
  if (item.type === '4') {
    isEqual = _.isEqual(
      generateConsumable(item),
      generateConsumable(currentRow),
    )
  }
  return !isEqual
}

const getOrdersData = val => {
  const {
    orders,
    codetable,
    visitRegistration,
    patient,
    user,
    clinicSettings,
  } = val

  const data = []
  const {
    primaryPrintoutLanguage = 'EN',
    secondaryPrintoutLanguage = '',
  } = clinicSettings
  const { rows } = orders

  return data
}

export {
  orderTypes,
  cleanConsultation,
  convertToConsultation,
  convertConsultationDocument,
  cleanFields,
  getOrdersData,
  convertClinicalNotesForms,
}
