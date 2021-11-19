import _ from 'lodash'
import { consultationDocumentTypes, formTypes } from '@/utils/codes'
import Medication from '@/pages/Widgets/Orders/Detail/Medication'
import Vaccination from '@/pages/Widgets/Orders/Detail/Vaccination'
import Service from '@/pages/Widgets/Orders/Detail/Service'
import Consumable from '@/pages/Widgets/Orders/Detail/Consumable'
import OrderSet from '@/pages/Widgets/Orders/Detail/OrderSet'
import Treatment from '@/pages/Widgets/Orders/Detail/Treatment'
import Package from '@/pages/Widgets/Orders/Detail/Package'
import Radiology from '@/pages/Widgets/Orders/Detail/Radiology'
import { SERVICE_CENTER_CATEGORY, RADIOLOGY_CATEGORY } from '@/utils/constants'

import moment from 'moment'
import { getUniqueId, getTranslationValue } from '@/utils/utils'
import {
  DOSAGE_RULE,
  DOSAGE_RULE_OPERATOR,
  ALLERGY_TYPE,
  PATIENT_ALLERGY_TYPE,
} from '@/utils/constants'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'

const orderTypes = [
  {
    name: 'Medication',
    value: '1',
    prop: 'corPrescriptionItem',
    accessRight: 'queue.consultation.order.medication',
    filter: r => r.inventoryMedicationFK || r.isDrugMixture,
    getSubject: r => {
      return r.drugName
    },
    component: props => <Medication {...props} />,
  },
  {
    name: 'Service',
    value: '3',
    prop: 'corService',
    accessRight: 'queue.consultation.order.service',
    filter: r => RADIOLOGY_CATEGORY.indexOf(r.serviceCenterCategoryFK) < 0,
    getSubject: r => r.serviceName,
    component: props => <Service {...props} />,
  },
  {
    name: 'Radiology',
    value: '10',
    prop: 'corService',
    accessRight: 'queue.consultation.order.radiology',
    getSubject: r => r.serviceName,
    filter: r => RADIOLOGY_CATEGORY.indexOf(r.serviceCenterCategoryFK) >= 0,
    component: props => <Radiology {...props} />,
  },
  {
    name: 'Vaccination',
    value: '2',
    prop: 'corVaccinationItem',
    accessRight: 'queue.consultation.order.vaccination',
    getSubject: r => r.vaccinationName,
    component: props => <Vaccination {...props} />,
  },
  {
    name: 'Consumable',
    value: '4',
    prop: 'corConsumable',
    accessRight: 'queue.consultation.order.consumable',
    getSubject: r => r.consumableName,
    component: props => <Consumable {...props} />,
  },
  {
    name: 'Open Prescription',
    value: '5',
    prop: 'corPrescriptionItem',
    accessRight: 'queue.consultation.order.openprescription',
    filter: r => !r.inventoryMedicationFK && !r.isDrugMixture,
    getSubject: r => r.drugName,
    component: props => <Medication openPrescription {...props} />,
  },
  {
    name: 'Order Set',
    value: '6',
    accessRight: 'queue.consultation.order.orderset',
    component: props => <OrderSet {...props} />,
  },
  {
    name: 'Treatment',
    value: '7',
    prop: 'corDentalTreatments',
    accessRight: 'queue.consultation.order.treatment',
    getSubject: r => r.itemName,
    component: props => <Treatment {...props} />,
  },
  {
    name: 'Package',
    value: '8',
    accessRight: 'queue.consultation.order.package',
    component: props => <Package {...props} />,
  },
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
    values[p.prop] = rows.filter(o => o.type === p.value && !o.vaccinationUFK)
  })
  const {
    rows: orderRows = [],
    finalAdjustments = [],
    isGSTInclusive,
    corPackage = [],
  } = orders
  values.corOrderAdjustment = finalAdjustments
  orderTypes.forEach((p, i) => {
    if (p.prop) {
      if (p.value === '5' || p.value === '10') {
        values[p.prop] = (values[p.prop] || []).concat(
          orderRows.filter(o => o.type === p.value),
        )
      } else if (p.value === '2') {
        // merge auto generated certificate from document to orders
        values[p.prop] = orderRows
          .filter(o => o.type === p.value)
          .map(o => {
            return {
              ...o,
              corVaccinationCert: o.corVaccinationCert.map(vc => {
                const certificate = rows.find(cvc => cvc.uid === vc.uid)
                return { ...vc, ...certificate }
              }),
            }
          })
      } else {
        values[p.prop] = orderRows.filter(o => o.type === p.value)
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
  }

  values = convertEyeForms(values)

  const formRows = forms.rows
  formTypes.forEach(p => {
    values[p.prop] = formRows
      ? formRows
          .filter(o => o.type === p.value)
          .map(val => {
            return {
              ...val,
              formData: JSON.stringify({
                ...val.formData,
                otherDiagnosis: val.formData.otherDiagnosis.map(d => {
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

  values.corPackage = corPackage

  return {
    ...values,
    isGSTInclusive,
  }
}

const cleanConsultation = values => {
  // remove irrelevant to api values
  const {
    visitConsultationTemplate,
    corPrescriptionItem,
    corDoctorNote,
    ...rest
  } = values

  const prescriptionWithoutSelect = corPrescriptionItem.map(pi => {
    return {
      selectedMedication: {},
      ...pi,
    }
  })

  // ordering
  return {
    corDoctorNote,
    corPrescriptionItem: prescriptionWithoutSelect,
    ...rest,
  }
}

const isPharmacyOrderUpdated = orders => {
  const { rows, _originalRows } = orders

  let isUpdatedPharmacy = false
  const isPushToPharmacy = item => {
    let isPushToPharmacy = false
    if (item.type === '1' || item.type === '4' || item.type === '5') {
      isPushToPharmacy = item.isDispensedByPharmacy
    }
    return isPushToPharmacy
  }

  const generateMedication = item => {
    if (!item) return {}
    return {
      adjAmount: item.adjAmount,
      adjType: item.adjType,
      adjValue: item.adjValue,
      costPrice: item.costPrice,
      dispenseUOMCode: item.dispenseUOMCode,
      dispenseUOMDisplayValue: item.dispenseUOMDisplayValue,
      dispenseUOMFK: item.dispenseUOMFK,
      drugCode: item.drugCode,
      drugName: item.drugName,
      instruction: item.instruction,
      inventoryMedicationFK: item.inventoryMedicationFK,
      isChargeToday: item.isChargeToday,
      isClaimable: item.isClaimable,
      isDeleted: item.isDeleted,
      isDispensedByPharmacy: item.isDispensedByPharmacy,
      isDrugMixture: item.isDrugMixture,
      isExclusive: item.isExclusive,
      isNurseActualizeRequired: item.isNurseActualizeRequired,
      isPreOrder: item.isPreOrder,
      performingUserFK: item.performingUserFK,
      quantity: item.quantity,
      remarks: item.remarks,
      secondInstruction: item.secondInstruction,
      seconDispenseUOMDisplayValue: item.seconDispenseUOMDisplayValue,
      totalAfterItemAdjustment: item.totalAfterItemAdjustment,
      totalAfterOverallAdjustment: item.totalAfterOverallAdjustment,
      totalPrice: item.totalPrice,
      unitPrice: item.unitPrice,
      drugLabelRemarks: item.drugLabelRemarks,
    }
  }

  const generateConsumable = item => {
    if (!item) return {}
    return {
      adjAmount: item.adjAmount,
      adjType: item.adjType,
      adjValue: item.adjValue,
      batchNo: item.batchNo,
      consumableCode: item.consumableCode,
      consumableName: item.consumableName,
      inventoryConsumableFK: item.inventoryConsumableFK,
      isChargeToday: item.isChargeToday,
      isDeleted: item.isDeleted,
      isDispensedByPharmacy: item.isDispensedByPharmacy,
      isNurseActualizeRequired: item.isNurseActualizeRequired,
      isPreOrder: item.isPreOrder,
      performingUserFK: item.performingUserFK,
      quantity: item.quantity,
      remark: item.remark,
      totalAfterItemAdjustment: item.totalAfterItemAdjustment,
      totalAfterOverallAdjustment: item.totalAfterOverallAdjustment,
      totalPrice: item.totalPrice,
      unitOfMeasurement: item.unitOfMeasurement,
      unitPrice: item.unitPrice,
    }
  }

  const generateDrudMixture = item => {
    return {
      costPrice: item.costPrice,
      drugCode: item.drugCode,
      drugName: item.drugName,
      inventoryMedicationFK: item.inventoryMedicationFK,
      isDeleted: item.isDeleted,
      isDispensedByPharmacy: item.isDispensedByPharmacy,
      isNurseActualizeRequired: item.isNurseActualizeRequired,
      prescribeUOMCode: item.prescribeUOMCode,
      prescribeUOMDisplayValue: item.prescribeUOMDisplayValue,
      prescribeUOMFK: item.prescribeUOMFK,
      quantity: item.quantity,
      revenueCategoryFK: item.revenueCategoryFK,
      totalPrice: item.totalPrice,
      unitPrice: item.unitPrice,
      uomCode: item.uomCode,
      uomDisplayValue: item.uomDisplayValue,
      uomfk: item.uomfk,
      secondUOMDisplayValue: item.secondUOMDisplayValue,
    }
  }

  const isItemUpdate = item => {
    const currentRow = rows.find(r => r.id === item.id && r.type === item.type)
    const isEqual =
      item.type === '1'
        ? _.isEqual(generateMedication(item), generateMedication(currentRow))
        : _.isEqual(generateConsumable(item), generateConsumable(currentRow))
    return !isEqual
  }

  const isItemDrugMixtureUpdate = (item, drugMixture) => {
    const currentDrugMixture = drugMixture.find(r => r.id === item.id)
    const isEqual = _.isEqual(
      generateDrudMixture(item),
      generateDrudMixture(currentDrugMixture),
    )
    return !isEqual
  }

  const pharmacyOrder = _originalRows.filter(r => isPushToPharmacy(r))
  for (let index = 0; index < pharmacyOrder.length; index++) {
    if (pharmacyOrder[index].type === '1') {
      if (isItemUpdate(pharmacyOrder[index])) {
        isUpdatedPharmacy = true
        break
      }

      if (pharmacyOrder[index].isDrugMixture) {
        const currentRow = rows.find(
          r =>
            r.id === pharmacyOrder[index].id &&
            r.type === pharmacyOrder[index].type,
        )

        if (currentRow.corPrescriptionItemDrugMixture.find(d => !d.id)) {
          isUpdatedPharmacy = true
          break
        }
        const drugMixture = pharmacyOrder[index].corPrescriptionItemDrugMixture
        for (let i = 0; i < drugMixture.length; i++) {
          if (
            isItemDrugMixtureUpdate(
              drugMixture[i],
              currentRow.corPrescriptionItemDrugMixture,
            )
          ) {
            isUpdatedPharmacy = true
            return
          }
        }
      }
    } else {
      if (isItemUpdate(pharmacyOrder[index])) {
        isUpdatedPharmacy = true
        break
      }
    }
  }

  if (!isUpdatedPharmacy) {
    isUpdatedPharmacy =
      rows.filter(r => !r.id && isPushToPharmacy(r)).length > 0
  }
  return isUpdatedPharmacy
}

const getOrdersData = val => {
  const {
    selectPreOrder,
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
  const { corVitalSign = [], rows } = orders
  const {
    inventoryconsumable,
    inventorymedication,
    inventoryvaccination,
    ctservice,
  } = codetable
  selectPreOrder.forEach(po => {
    if (po.preOrderItemType === 'Medication') {
      const { preOrderMedicationItem = {} } = po

      const medicationStock = inventorymedication.filter(
        x => x.id === preOrderMedicationItem.inventoryMedicationFK,
      )
      const {
        dispensingUOM = [],
        prescribingUOM = [],
        medicationUsage = [],
        corPrescriptionItemInstruction = [],
        inventoryMedication_MedicationPrecaution = [],
        medicationInstructionRule = [],
      } = medicationStock[0]

      let defaultInstruction = {
        sequence: 0,
        stepdose: 'AND',
        uid: getUniqueId(),
      }
      let matchInstruction
      if (preOrderMedicationItem.inventoryMedicationFK) {
        let weightKG
        const activeVitalSign = corVitalSign.find(vs => !vs.isDeleted)
        if (activeVitalSign) {
          weightKG = activeVitalSign.weightKG
        } else {
          weightKG = visitRegistration.entity.visit.weightKG
        }
        const { dob } = patient.entity
        let age
        if (dob) {
          age = Math.floor(moment.duration(moment().diff(dob)).asYears())
        }
        matchInstruction = medicationInstructionRule.find(i =>
          isMatchInstructionRule(i, age, weightKG),
        )
        const medicationfrequency = matchInstruction?.medicationFrequency
        const medicationdosage = matchInstruction?.prescribingDosage

        defaultInstruction = {
          ...defaultInstruction,
          usageMethodFK: medicationUsage ? medicationUsage.id : undefined,
          usageMethodCode: medicationUsage ? medicationUsage.code : undefined,
          usageMethodDisplayValue: medicationUsage
            ? medicationUsage.name
            : undefined,
          dosageFK: medicationdosage ? medicationdosage.id : undefined,
          dosageCode: medicationdosage ? medicationdosage.code : undefined,
          dosageDisplayValue: medicationdosage
            ? medicationdosage.name
            : undefined,
          prescribeUOMFK: prescribingUOM ? prescribingUOM.id : undefined,
          prescribeUOMCode: prescribingUOM ? prescribingUOM.code : undefined,
          prescribeUOMDisplayValue: prescribingUOM
            ? prescribingUOM.name
            : undefined,
          drugFrequencyFK: medicationfrequency
            ? medicationfrequency.id
            : undefined,
          drugFrequencyCode: medicationfrequency
            ? medicationfrequency.code
            : undefined,
          drugFrequencyDisplayValue: medicationfrequency
            ? medicationfrequency.name
            : undefined,
          duration: matchInstruction?.duration,
        }
      }

      const instruction = getInstruction(
        [defaultInstruction],
        primaryPrintoutLanguage,
        codetable,
      )
      const secondInstruction =
        secondaryPrintoutLanguage !== ''
          ? getInstruction(
              [defaultInstruction],
              secondaryPrintoutLanguage,
              codetable,
            )
          : ''

      data.push({
        actualizedPreOrderItemFK: po.id,
        adjAmount: preOrderMedicationItem?.adjAmount || 0,
        adjType: preOrderMedicationItem?.adjType || 'ExactAmount',
        adjValue: preOrderMedicationItem?.adjValue || 0,
        corPrescriptionItemInstruction: preOrderMedicationItem.length
          ? preOrderMedicationItem?.corPrescriptionItemInstruction
          : [defaultInstruction],
        corPrescriptionItemPrecaution: inventoryMedication_MedicationPrecaution,
        costPrice: medicationStock[0].averageCostPrice || 0,
        dispenseUOMCode: dispensingUOM?.code,
        dispenseUOMDisplayValue: dispensingUOM?.name,
        dispenseUOMFK: dispensingUOM?.id,
        drugCode: medicationStock[0].code,
        drugName: medicationStock[0].displayValue,
        inventoryDispenseUOMFK: dispensingUOM?.id,
        inventoryMedicationFK: preOrderMedicationItem.inventoryMedicationFK,
        inventoryPrescribingUOMFK: prescribingUOM?.id,
        isActive: medicationStock[0].isActive,
        isClaimable: true,
        isDeleted: false,
        isDispensedByPharmacy: medicationStock[0].isDispensedByPharmacy,
        isDrugMixture: false,
        isExclusive: medicationStock[0].isExclusive,
        isNurseActualizeRequired: medicationStock[0].isNurseActualizable,
        performingUserFK: user.data.clinicianProfile.userProfile.id,
        quantity: po.quantity,
        sequence: 0,
        remarks: po?.remarks,
        subject: medicationStock[0].displayValue,
        totalAfterGST: po.amount,
        totalAfterItemAdjustment:
          preOrderMedicationItem?.totalAfterItemAdjustment || po.amount,
        totalAfterOverallAdjustment:
          preOrderMedicationItem?.totalAfterOverallAdjustment || po.amount,
        totalPrice: preOrderMedicationItem?.totalPrice || po.amount,
        type: '1',
        unitPrice: medicationStock[0].sellingPrice || 0,
        instruction: po?.instruction || instruction,
        hasPaid: po?.hasPaid,
        isOrderedByDoctor: true,
        isOnlyClinicInternalUsage: true,
        isEditMedication: false,
        isExactAmount: true,
      })
    } else if (po.preOrderItemType === 'Vaccination') {
      const { preOrderVaccinationItem = {} } = po

      const vacinnationStock = inventoryvaccination.filter(
        x => x.id === preOrderVaccinationItem.inventoryVaccinationFK,
      )

      const {
        dispensingUOM = [],
        prescribingUOM = [],
        prescribingDosage = [],
        vaccinationUsage = [],
      } = vacinnationStock[0]

      data.push({
        actualizedPreOrderItemFK: po.id,
        adjAmount: preOrderVaccinationItem?.adjAmount || 0,
        adjType: preOrderVaccinationItem?.adjType || 'ExactAmount',
        adjValue: preOrderVaccinationItem?.adjValue || 0,
        dosageCode:
          preOrderVaccinationItem?.dosageCode || prescribingDosage?.code,
        dosageDisplayValue:
          preOrderVaccinationItem?.dosageDisplayValue ||
          prescribingDosage?.name,
        dosageFK: preOrderVaccinationItem?.dosageFK || prescribingDosage?.id,
        instruction: po?.instruction,
        inventoryVaccinationFK: preOrderVaccinationItem.inventoryVaccinationFK,
        isActive: true,
        isDeleted: false,
        isExactAmount:
          preOrderVaccinationItem?.adjType === 'ExactAmount'
            ? true
            : false || true,
        isNurseActualizeRequired: vacinnationStock[0].isNurseActualizable,
        performingUserFK: user.data.clinicianProfile.userProfile.id,
        quantity: po?.quantity,
        remarks: po?.remark,
        sequence: 0,
        subject: vacinnationStock[0].displayValue,
        totalAfterItemAdjustment:
          preOrderVaccinationItem?.totalAfterItemAdjustment ||
          po?.quantity * vacinnationStock[0].sellingPrice,
        totalAfterOverallAdjustment:
          preOrderVaccinationItem?.totalAfterOverallAdjustment ||
          po?.quantity * vacinnationStock[0].sellingPrice,
        totalPrice:
          preOrderVaccinationItem?.totalPrice ||
          po?.quantity * vacinnationStock[0].sellingPrice,
        type: '2',
        unitPrice: vacinnationStock[0].sellingPrice,
        uomCode:
          preOrderVaccinationItem?.prescribingUOMCode || prescribingUOM?.code,
        uomDisplayValue:
          preOrderVaccinationItem?.prescribingUOMDisplayValue ||
          prescribingUOM?.name,
        uomfk: preOrderVaccinationItem?.prescribingUOMFK || prescribingUOM?.id,
        usageMethodCode:
          preOrderVaccinationItem?.usageMethodCode || vaccinationUsage?.code,
        usageMethodDisplayValue:
          preOrderVaccinationItem?.usageMethodDisplayValue ||
          vaccinationUsage?.name,
        usageMethodFK:
          preOrderVaccinationItem?.usageMethodFK || vaccinationUsage?.id,
        vaccinationCode: vacinnationStock[0].code,
        vaccinationName: vacinnationStock[0].displayValue,
        hasPaid: po?.hasPaid,
        isOrderedByDoctor: true,
        vaccinationGivenDate: moment(),
      })
    } else if (po.preOrderItemType === 'Consumable') {
      const { preOrderConsumableItem = {} } = po
      const consumableStock = inventoryconsumable.filter(
        x => x.id === preOrderConsumableItem.inventoryConsumableFK,
      )
      const { uom } = consumableStock[0]

      data.push({
        actualizedPreOrderItemFK: po.id,
        adjAmount: preOrderConsumableItem?.adjAmount || 0,
        adjType: preOrderConsumableItem?.adjType || 'ExactAmount',
        adjValue: preOrderConsumableItem?.adjValue || 0,
        consumableCode:
          preOrderConsumableItem.consumableCode || consumableStock[0].code,
        consumableName:
          preOrderConsumableItem.consumableName ||
          consumableStock[0].displayValue,
        inventoryConsumableFK: preOrderConsumableItem.inventoryConsumableFK,
        isActive: true,
        isDeleted: false,
        isDispensedByPharmacy: consumableStock[0].isDispensedByPharmacy,
        isExactAmount:
          preOrderConsumableItem?.adjType === 'ExactAmount'
            ? true
            : false || true,
        isNurseActualizeRequired: consumableStock[0].isNurseActualizable,
        performingUserFK: user.data.clinicianProfile.userProfile.id,
        quantity: po?.quantity,
        remark: po?.remarks,
        sequence: 0,
        subject:
          preOrderConsumableItem?.consumableName ||
          consumableStock[0].displayValue,
        totalAfterItemAdjustment:
          preOrderConsumableItem?.totalAfterItemAdjustment ||
          consumableStock[0].sellingPrice * po.quantity,
        totalAfterOverallAdjustment:
          preOrderConsumableItem?.totalAfterOverallAdjustment ||
          consumableStock[0].sellingPrice * po.quantity,
        totalPrice:
          preOrderConsumableItem?.totalPrice ||
          consumableStock[0].sellingPrice * po.quantity,
        type: '4',
        unitOfMeasurement: uom.name,
        unitPrice: consumableStock[0].sellingPrice * po.quantity,
        hasPaid: po?.hasPaid,
      })
    } else {
      const { preOrderServiceItem = {} } = po

      const service = ctservice.filter(
        x => x.serviceId === preOrderServiceItem.serviceFK,
      )
      data.push({
        actualizedPreOrderItemFK: po.id,
        adjAmount: preOrderServiceItem?.adjAmount || 0,
        adjType: preOrderServiceItem?.adjType || 'ExactAmount',
        adjValue: preOrderServiceItem?.adjValue || 0,
        instruction: po?.instruction,
        isActive: true,
        isDeleted: false,
        isDisplayValueChangable: true,
        isExactAmount:
          preOrderServiceItem?.adjType === 'ExactAmount' ? true : false || true,
        isMinus: true,
        isNurseActualizeRequired: service[0].isNurseActualizable,
        newServiceName: preOrderServiceItem?.newServiceName || undefined,
        performingUserFK: user.data.clinicianProfile.userProfile.id,
        quantity: po.quantity,
        remark: po?.remarks,
        sequence: 1,
        serviceCenterFK:
          preOrderServiceItem?.serviceCenterFK || service[0].serviceCenterId,
        serviceCenterServiceFK:
          preOrderServiceItem?.serviceCenterServiceFK ||
          service[0].serviceCenter_ServiceId,
        serviceCode: preOrderServiceItem?.serviceCode || service[0].code,
        serviceFK: preOrderServiceItem?.serviceFK || service[0].serviceId,
        serviceName:
          preOrderServiceItem?.serviceName || service[0].displayValue,
        subject: preOrderServiceItem?.serviceName || service[0].displayValue,
        total:
          preOrderServiceItem?.totalPrice || service[0].unitPrice * po.quantity,
        totalAfterItemAdjustment:
          preOrderServiceItem?.totalAfterItemAdjustment ||
          service[0].unitPrice * po.quantity,
        totalAfterOverallAdjustment:
          preOrderServiceItem?.totalAfterOverallAdjustment ||
          service[0].unitPrice * po.quantity,
        type: po.preOrderItemType === 'Radiology' ? '10' : '3',
        unitPrice: service[0].unitPrice || 0,
        hasPaid: po?.hasPaid,
      })
    }
  })
  return data
}

const getInstruction = (instructions, language, codetable) => {
  const {
    ctmedicationunitofmeasurement = [],
    ctmedicationusage = [],
    ctmedicationfrequency = [],
    ctmedicationdosage = [],
  } = codetable
  let instruction = ''
  let nextStepdose = ''
  const activeInstructions = instructions
    ? instructions.filter(item => !item.isDeleted)
    : undefined
  if (activeInstructions) {
    for (let index = 0; index < activeInstructions.length; index++) {
      let item = activeInstructions[index]
      const usage = ctmedicationusage.find(
        usage => usage.id === item.usageMethodFK,
      )
      const uom = ctmedicationunitofmeasurement.find(
        uom => uom.id === item.prescribeUOMFK,
      )
      const frequency = ctmedicationfrequency.find(
        frequency => frequency.id === item.drugFrequencyFK,
      )
      const dosage = ctmedicationdosage.find(
        dosage => dosage.id === item.dosageFK,
      )
      if (instruction !== '') {
        instruction += ' '
      }

      if (index < activeInstructions.length - 1) {
        nextStepdose = ` ${activeInstructions[index + 1].stepdose}`
      } else {
        nextStepdose = ''
      }

      const itemDuration = item.duration ? ` For ${item.duration} day(s)` : ''

      instruction += `${getTranslationValue(
        usage?.translationData,
        language,
        'displayValue',
      )} ${getTranslationValue(
        dosage?.translationData,
        language,
        'displayValue',
      )} ${getTranslationValue(
        uom?.translationData,
        language,
        'displayValue',
      )} ${getTranslationValue(
        frequency?.translationData,
        language,
        'displayValue',
      )}${itemDuration}${nextStepdose}`
    }
  }
  return instruction
}

export {
  orderTypes,
  cleanConsultation,
  convertToConsultation,
  convertConsultationDocument,
  cleanFields,
  isPharmacyOrderUpdated,
  getOrdersData,
}
