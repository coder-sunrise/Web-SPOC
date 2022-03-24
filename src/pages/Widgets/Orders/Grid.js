import React, { useState, useEffect, Fragment } from 'react'
import _ from 'lodash'
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Divider } from '@material-ui/core'
import Cross from '@material-ui/icons/HighlightOff'
import VisitOrderTemplateIndicateString from './VisitOrderTemplateIndicateString'
import {
  isMatchInstructionRule,
  ReplaceCertificateTeplate,
} from '@/pages/Widgets/Orders/utils'
import {
  calculateAdjustAmount,
  getUniqueId,
  getTranslationValue,
} from '@/utils/utils'
import { currencySymbol, currencyFormat } from '@/utils/config'
import { Link } from 'umi'

import numeral from 'numeral'
import {
  RADIOLOGY_WORKITEM_STATUS,
  NURSE_WORKITEM_STATUS,
  LAB_WORKITEM_STATUS,
  ORDER_TYPES,
  INVENTORY_TYPE,
  SERVICE_CENTER_CATEGORY,
  VISIT_TYPE,
} from '@/utils/constants'
import {
  CommonTableGrid,
  Tooltip,
  CommonModal,
  NumberInput,
  Checkbox,
  notification,
  Switch,
  AuthorizedContext,
} from '@/components'
import { Button } from 'antd'
import { orderTypes } from '@/pages/Consultation/utils'
import Authorized from '@/utils/Authorized'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'
import VisitOrderTemplateRevert from './VisitOrderTemplateRevert'
import moment from 'moment'
export default ({
  orders,
  dispatch,
  classes,
  from = 'Consultation',
  codetable,
  theme,
  user,
  patient,
  isFullScreen = false,
  isEnableEditOrder = true,
  visitRegistration,
}) => {
  const { rows, summary, finalAdjustments, isGSTInclusive, gstValue } = orders
  const { total, gst, totalWithGST, subTotal } = summary
  const [checkedStatusIncldGST, setCheckedStatusIncldGST] = useState(
    isGSTInclusive,
  )

  const [isExistPackage, setIsExistPackage] = useState(false)
  const [
    removedVisitOrderTemplateItem,
    setRemovedVisitOrderTemplateItem,
  ] = useState([])

  const [showRevertVisitPurposeItem, setShowRevertVisitPurposeItem] = useState(
    false,
  )

  const [expandedGroups, setExpandedGroups] = useState([])

  const getOrderAccessRight = accessRight => {
    let right = Authorized.check(accessRight) || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }

  const handleExpandedGroupsChange = e => {
    setExpandedGroups(e)
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

        let itemDuration = item.duration ? ` For ${item.duration} day(s)` : ''
        let separator = nextStepdose
        if (language === 'JP') {
          separator = nextStepdose === '' ? '<br>' : ''
          itemDuration = item.duration ? `${item.duration} �շ�` : ''
        }
        let usagePrefix = ''
        if (language === 'JP' && item.dosageFK) {
          usagePrefix = '1��'
        } else {
          usagePrefix = getTranslationValue(
            usage?.translationData,
            language,
            'displayValue',
          )
        }
        instruction += `${usagePrefix} ${getTranslationValue(
          uom?.translationData,
          language,
          'displayValue',
        )} ${getTranslationValue(
          frequency?.translationData,
          language,
          'displayValue',
        )}${itemDuration}${separator}`
      }
    }
    return instruction
  }
  const GetNewMedication = currentVisitOrderTemplate => {
    const inventoryMedicationFK =
      currentVisitOrderTemplate.visitOrderTemplateMedicationItemDto
        .inventoryMedicationFK
    const { entity } = visitRegistration
    const { visit } = entity
    const { visitOrderTemplate } = visit
    const { visitOrderTemplateItemDtos } = visitOrderTemplate

    const settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const { corVitalSign = [] } = orders
    let matchInstruction
    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = settings
    const {
      inventorymedication,
      ctmedicationusage,
      ctmedicationdosage,
      ctmedicationunitofmeasurement,
      ctmedicationfrequency,
    } = codetable

    const drug = inventorymedication.find(t => t.id == inventoryMedicationFK)

    let weightKG
    const activeVitalSign = corVitalSign.find(vs => !vs.isDeleted)
    if (activeVitalSign) {
      weightKG = activeVitalSign.weightKG
    } else {
      const visitBasicExaminations =
        visitRegistration.entity?.visit?.visitBasicExaminations || []
      if (visitBasicExaminations.length) {
        weightKG = visitBasicExaminations[0].weightKG
      }
    }
    const { dob } = patient.entity
    const { medicationInstructionRule = [] } = drug
    let age
    if (dob) {
      age = Math.floor(moment.duration(moment().diff(dob)).asYears())
    }
    matchInstruction = medicationInstructionRule.find(i =>
      isMatchInstructionRule(i, age, weightKG),
    )

    let data = {}
    let currentSequence =
      (_.max(rows.filter(t => !t.isDeleted).map(t => t.sequence)) || 0) + 1

    const medicationfrequency = matchInstruction?.medicationFrequency
    const medicationdosage = matchInstruction?.prescribingDosage

    let defaultInstruction = {
      usageMethodFK: drug.medicationUsage ? drug.medicationUsage.id : undefined,
      usageMethodCode: drug.medicationUsage
        ? drug.medicationUsage.code
        : undefined,
      usageMethodDisplayValue: drug.medicationUsage
        ? drug.medicationUsage.name
        : undefined,
      dosageFK: medicationdosage ? medicationdosage.id : undefined,
      dosageCode: medicationdosage ? medicationdosage.code : undefined,
      dosageDisplayValue: medicationdosage ? medicationdosage.name : undefined,
      prescribeUOMFK: drug.prescribingUOM ? drug.prescribingUOM.id : undefined,
      prescribeUOMCode: drug.prescribingUOM
        ? drug.prescribingUOM.code
        : undefined,
      prescribeUOMDisplayValue: drug.prescribingUOM
        ? drug.prescribingUOM.name
        : undefined,
      drugFrequencyFK: medicationfrequency ? medicationfrequency.id : undefined,
      drugFrequencyCode: medicationfrequency
        ? medicationfrequency.code
        : undefined,
      drugFrequencyDisplayValue: medicationfrequency
        ? medicationfrequency.name
        : undefined,
      duration: matchInstruction?.duration,
      sequence: 0,
      stepdose: 'AND',
      uid: getUniqueId(),
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

    let itemCostPrice
    let itemUnitPrice
    let itemDispenseUOMCode
    let itemDispenseUOMDisplayValue
    let itemSecondDispenseUOMDisplayValue
    let itemDispenseUOMFK
    let itemInventoryDispenseUOMFK
    let itemInventoryPrescribingUOMFK
    let itemDrugCode
    let itemDrugName
    let itemTotalPrice
    let newTotalQuantity
    let ItemPrecautions = []
    let itemDrugCaution
    let isDispensedByPharmacy
    let isNurseActualizeRequired
    let isExclusive
    let precautionIndex = 0
    if (
      drug.inventoryMedication_MedicationPrecaution &&
      drug.inventoryMedication_MedicationPrecaution.length > 0
    ) {
      ItemPrecautions = ItemPrecautions.concat(
        drug.inventoryMedication_MedicationPrecaution.map(o => {
          let currentPrecautionSequence = precautionIndex
          precautionIndex += 1
          return {
            medicationPrecautionFK: o.medicationPrecautionFK,
            precaution: o.medicationPrecautionName,
            precautionCode: o.medicationPrecautionCode,
            sequence: currentPrecautionSequence,
            isDeleted: false,
            uid: getUniqueId(),
          }
        }),
      )
    } else {
      ItemPrecautions = [
        {
          precaution: '',
          sequence: 0,
          uid: getUniqueId(),
        },
      ]
    }

    newTotalQuantity =
      currentVisitOrderTemplate.quantity ||
      matchInstruction?.dispensingQuantity ||
      0
    itemTotalPrice = currentVisitOrderTemplate.total
    itemCostPrice = drug.averageCostPrice
    itemUnitPrice = currentVisitOrderTemplate.unitPrice
    itemDispenseUOMCode = drug.dispensingUOM
      ? drug.dispensingUOM.code
      : undefined
    const uom = ctmedicationunitofmeasurement.find(
      uom => uom.id === drug?.dispensingUOM?.id,
    )
    itemDispenseUOMDisplayValue = getTranslationValue(
      uom?.translationData,
      primaryPrintoutLanguage,
      'displayValue',
    )
    itemSecondDispenseUOMDisplayValue =
      secondaryPrintoutLanguage !== ''
        ? getTranslationValue(
            uom?.translationData,
            secondaryPrintoutLanguage,
            'displayValue',
          )
        : ''

    itemDispenseUOMFK = drug.dispensingUOM ? drug.dispensingUOM.id : undefined
    itemInventoryDispenseUOMFK = drug?.dispensingUOM?.id
    itemInventoryPrescribingUOMFK = drug?.prescribingUOM?.id
    itemDrugCode = drug.code
    itemDrugName = drug.displayValue
    itemDrugCaution = drug.caution
    isDispensedByPharmacy = drug.isDispensedByPharmacy
    isNurseActualizeRequired = drug.isNurseActualizable
    isExclusive = drug.isExclusive

    return {
      type: ORDER_TYPES.MEDICATION,
      adjAmount: 0,
      adjType: 'ExactAmount',
      adjValue: 0,
      corPrescriptionItemInstruction: [defaultInstruction],
      corPrescriptionItemPrecaution: ItemPrecautions,
      corPrescriptionItemDrugMixture: [],
      costPrice: itemCostPrice,
      unitPrice: itemUnitPrice,
      dispenseUOMCode: itemDispenseUOMCode,
      dispenseUOMDisplayValue: itemDispenseUOMDisplayValue,
      secondDispenseUOMDisplayValue: itemSecondDispenseUOMDisplayValue,
      dispenseUOMFK: itemDispenseUOMFK,
      inventoryDispenseUOMFK: itemInventoryDispenseUOMFK,
      inventoryPrescribingUOMFK: itemInventoryPrescribingUOMFK,
      drugCode: itemDrugCode,
      drugName: itemDrugName,
      name: itemDrugName,
      instruction,
      secondInstruction,
      inventoryMedicationFK: drug.id,
      isActive: true,
      isDeleted: false,
      quantity: newTotalQuantity,
      remarks: '',
      sequence: currentSequence,
      subject: itemDrugName,
      totalPrice: itemTotalPrice,
      totalAfterItemAdjustment: itemTotalPrice,
      isExternalPrescription: false,
      visitPurposeFK: currentVisitOrderTemplate.visitOrderTemplateFK,
      isDrugMixture: false,
      isClaimable: false,
      caution: itemDrugCaution,
      performingUserFK: user.data.clinicianProfile.userProfile.id,
      packageGlobalId: '',
      isDispensedByPharmacy,
      isNurseActualizeRequired,
      isExclusive,
      visitOrderTemplateItemFK: currentVisitOrderTemplate.id,
    }
  }

  const GetNewVaccination = currentVisitOrderTemplate => {
    const inventoryVaccinationFK =
      currentVisitOrderTemplate.visitOrderTemplateVaccinationItemDto
        .inventoryVaccinationFK
    const { entity } = visitRegistration
    const { visit } = entity
    const { visitOrderTemplate } = visit
    const { visitOrderTemplateItemDtos } = visitOrderTemplate
    let sequence =
      (_.max(rows.filter(t => !t.isDeleted).map(t => t.sequence)) || 0) + 1

    const { entity: visitEntity } = visitRegistration
    const { name, patientAccountNo, genderFK, dob } = patient.entity
    const {
      ctgender = [],
      inventoryvaccination,
      ctvaccinationusage,
      ctmedicationdosage,
      ctvaccinationunitofmeasurement,
    } = codetable
    const gender = ctgender.find(o => o.id === genderFK) || {}
    const allDocs = rows.filter(s => !s.isDeleted)
    let nextSequence = 1
    if (allDocs && allDocs.length > 0) {
      const { sequence: documentSequence } = _.maxBy(allDocs, 'sequence')
      nextSequence = documentSequence + 1
    }
    let vaccination = inventoryvaccination.find(
      vacc => vacc.id === inventoryVaccinationFK,
    )
    let defaultBatch = vaccination.vaccinationStock.find(
      o => o.isDefault === true,
    )

    let usage = ctvaccinationusage.find(
      vaccUsage => vaccUsage.id === vaccination.vaccinationUsageFK,
    )

    let dosage = ctmedicationdosage.find(
      vaccdosage => vaccdosage.id === vaccination.prescribingDosageFK,
    )

    let uom = ctvaccinationunitofmeasurement.find(
      vaccuom => vaccuom.id === vaccination.prescribingUOMFK,
    )
    let dispenseUOM = ctvaccinationunitofmeasurement.find(
      vaccuom => vaccuom.id === vaccination.dispensingUOMFK,
    )

    const totalPrice =
      currentVisitOrderTemplate.visitOrderTemplateVaccinationItemDto.total

    let newVaccination = {
      type: ORDER_TYPES.VACCINATION,
      inventoryVaccinationFK: vaccination.id,
      vaccinationGivenDate: moment(),
      vaccinationCode: vaccination.code,
      vaccinationName: vaccination.displayValue,
      usageMethodFK: vaccination.vaccinationUsage?.id,
      usageMethodCode: vaccination.vaccinationUsage?.code,
      usageMethodDisplayValue: vaccination.vaccinationUsage?.name,
      dosageFK: vaccination.prescribingDosage?.id,
      dosageCode: vaccination.prescribingDosage?.code,
      dosageDisplayValue: vaccination.prescribingDosage?.name,
      uomfk: vaccination.prescribingUOM?.id,
      uomCode: vaccination.prescribingUOM?.code,
      uomDisplayValue: vaccination.prescribingUOM?.name,
      dispenseUOMFK: vaccination.dispensingUOM?.id,
      dispenseUOMCode: vaccination.dispensingUOM?.code,
      dispenseUOMDisplayValue: vaccination.dispensingUOM?.name,
      quantity: currentVisitOrderTemplate.quantity,
      unitPrice: currentVisitOrderTemplate.unitPrice,
      totalPrice: currentVisitOrderTemplate.total,
      adjAmount: 0.0,
      adjType: 'ExactAmount',
      adjValue: 0,
      totalAfterItemAdjustment: currentVisitOrderTemplate.total,
      sequence: sequence,
      expiryDate: defaultBatch ? defaultBatch.expiryDate : undefined,
      batchNo: defaultBatch ? defaultBatch.batchNo : undefined,
      remarks: vaccination.remarks,
      isActive: true,
      isDeleted: false,
      subject: vaccination.displayValue,
      caution: vaccination.caution,
      isGenerateCertificate: vaccination.isAutoGenerateCertificate,
      performingUserFK: user.data.clinicianProfile.userProfile.id,
      isNurseActualizeRequired: vaccination.isNurseActualizable,
      instruction: `${usage?.name || ''} ${dosage?.displayValue ||
        ''} ${uom?.name || ''}`,
      visitOrderTemplateItemFK: currentVisitOrderTemplate.id,
    }
    let newCORVaccinationCert = []
    if (newVaccination.isGenerateCertificate) {
      const { documenttemplate = [] } = codetable
      const defaultTemplate = documenttemplate.find(
        dt => dt.isDefaultTemplate === true && dt.documentTemplateTypeFK === 3,
      )
      if (defaultTemplate) {
        newCORVaccinationCert = [
          {
            type: '3',
            certificateDate: moment().date(),
            issuedByUserFK: user.data.clinicianProfile.userProfile.id,
            subject: `Vaccination Certificate - ${name}, ${patientAccountNo}, ${gender.code ||
              ''}, ${Math.floor(
              moment.duration(moment().diff(dob)).asYears(),
            )}`,
            content: ReplaceCertificateTeplate(
              defaultTemplate.templateContent,
              newVaccination,
            ),
            sequence: nextSequence,
            uid: getUniqueId(),
          },
        ]
        nextSequence += 1
      } else {
        showNoTemplate = true
      }
    }
    return {
      ...newVaccination,
      corVaccinationCert: newCORVaccinationCert,
    }
  }
  const GetService = currentVisitOrderTemplate => {
    const { fullService } = orders
    var service = fullService.find(
      t =>
        t.serviceCenter_ServiceId ===
        currentVisitOrderTemplate.visitOrderTemplateServiceItemDto
          .serviceCenterServiceFK,
    )
    let sequence =
      (_.max(rows.filter(t => !t.isDeleted).map(t => t.sequence)) || 0) + 1
    let type = ORDER_TYPES.SERVICE
    if (
      service.serviceCenterCategoryFK ===
      SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER
    ) {
      type = ORDER_TYPES.RADIOLOGY
    } else if (
      service.serviceCenterCategoryFK ===
      SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER
    ) {
      type = ORDER_TYPES.LAB
    }
    return {
      adjAmount: 0,
      adjType: 'ExactAmount',
      adjValue: 0,
      isActive: true,
      isDeleted: false,
      isDisplayValueChangable: service.isDisplayValueChangable,
      isExactAmount: true,
      isMinus: true,
      isNurseActualizeRequired: service.isNurseActualizable,
      isOrderedByDoctor:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
      performingUserFK: user.data.clinicianProfile.userProfile.id,
      quantity: currentVisitOrderTemplate.quantity,
      sequence: sequence,
      serviceCenterFK: service.serviceCenterId,
      serviceCenterServiceFK: service.serviceCenter_ServiceId,
      serviceCode: service.code,
      serviceFK: service.id,
      serviceName: service.displayValue,
      subject: service.displayValue,
      total: currentVisitOrderTemplate.total,
      totalAfterItemAdjustment: currentVisitOrderTemplate.total,
      type: type,
      unitPrice: currentVisitOrderTemplate.unitPrice,
      visitPurposeFK: currentVisitOrderTemplate.visitOrderTemplateFK,
      visitOrderTemplateItemFK: currentVisitOrderTemplate.id,
    }
  }
  const GetConsumable = currentVisitOrderTemplate => {
    const { inventoryconsumable = [] } = codetable
    var consumable = inventoryconsumable.find(
      t =>
        t.id ===
        currentVisitOrderTemplate.visitOrderTemplateConsumableItemDto
          .inventoryConsumableFK,
    )
    let defaultBatch = consumable?.consumableStock.find(
      o => o.isDefault === true,
    )
    return {
      adjAmount: 0,
      adjType: 'ExactAmount',
      adjValue: 0,
      batchNo: defaultBatch?.batchNo,
      consumableCode: consumable.code,
      consumableName: consumable.displayValue,
      inventoryConsumableFK: consumable.id,
      isActive: true,
      isDeleted: false,
      isDispensedByPharmacy: consumable.isDispensedByPharmacy,
      isExactAmount: true,
      isMinus: true,
      isNurseActualizeRequired: consumable.isNurseActualizable,
      isOrderedByDoctor: true,
      packageGlobalId: '',
      performingUserFK:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
      quantity: currentVisitOrderTemplate.quantity,
      sequence:
        (_.max(rows.filter(t => !t.isDeleted).map(t => t.sequence)) || 0) + 1,
      subject: consumable.displayValue,
      totalAfterItemAdjustment: currentVisitOrderTemplate.total,
      totalPrice: currentVisitOrderTemplate.total,
      type: ORDER_TYPES.CONSUMABLE,
      unitOfMeasurement: consumable.uom?.name,
      unitPrice: currentVisitOrderTemplate.unitPrice,
      visitOrderTemplateItemFK: currentVisitOrderTemplate.id,
    }
  }
  useEffect(() => {
    setCheckedStatusIncldGST(orders.isGSTInclusive)

    const settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const { isEnablePackage = false } = settings

    const packageItems = rows.filter(item => item.isPackage && !item.isDeleted)
    const existPackage = isEnablePackage && packageItems.length > 0
    setIsExistPackage(existPackage)

    if (existPackage && rows) {
      const groups = rows.reduce(
        (distinct, data) =>
          distinct.includes(data.packageGlobalId)
            ? [...distinct]
            : [...distinct, data.packageGlobalId],
        [],
      )

      setExpandedGroups(groups)
    }
  }, [orders])

  const adjustments = finalAdjustments.filter(o => !o.isDeleted)

  const OrderAccessRight = () => {
    let editAccessRight = ''
    if (from === 'EditOrder') {
      editAccessRight = 'queue.dispense.editorder'
    } else if (from === 'Consultation') {
      editAccessRight = 'queue.consultation.widgets.order'
    }
    return editAccessRight
  }

  const OrderItemAccessRight = row => {
    let editAccessRight
    const orderType = orderTypes.find(item => item.value === row.type) || {
      accessRight: '',
    }
    editAccessRight = orderType.accessRight

    if (from === 'EditOrder') {
      const EditOrderAccessRight = Authorized.check('queue.dispense.editorder')
      if (!EditOrderAccessRight || EditOrderAccessRight.rights !== 'enable')
        editAccessRight = 'queue.dispense.editorder'
      else if (row.isOrderedByDoctor) {
        const itemAccessRight = Authorized.check(editAccessRight)
        if (itemAccessRight && itemAccessRight.rights === 'enable') {
          editAccessRight = 'queue.dispense.editorder.modifydoctororder'
        }
      }
    } else if (from === 'Consultation') {
      const consultaionAccessRight = Authorized.check(
        'queue.consultation.widgets.order',
      )
      if (!consultaionAccessRight || consultaionAccessRight.rights !== 'enable')
        editAccessRight = 'queue.consultation.widgets.order'
    }
    return editAccessRight
  }

  const editRow = row => {
    if (!isEnableEditOrder) return
    const { workitem = {} } = row
    const { nurseWorkitem = {}, radiologyWorkitem = {} } = workitem
    const { nuseActualize = [] } = nurseWorkitem
    if (!row.isPreOrder) {
      if (
        (row.type === ORDER_TYPES.RADIOLOGY &&
          radiologyWorkitem.statusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED) ||
        nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
      ) {
        return
      }
    }

    if (row.isPreOrderActualize) return
    if (
      !row.isActive &&
      row.type !== ORDER_TYPES.OPEN_PRESCRIPTION &&
      !row.isDrugMixture
    )
      return

    if (row.type === ORDER_TYPES.TREATMENT && from !== 'EditOrder') return

    const editAccessRight = OrderItemAccessRight(row)

    const accessRight = Authorized.check(editAccessRight)
    if (!accessRight || accessRight.rights !== 'enable') return
    if (row.type === ORDER_TYPES.RADIOLOGY) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: {
            radiologyItems: [{ ...row }],
            editServiceId: row.serviceFK,
            selectCategory: 'All',
            selectTag: 'All',
            filterService: '',
            serviceCenterFK: row.serviceCenterFK,
            quantity: row.quantity,
            total: row.total,
            totalAfterItemAdjustment: row.totalAfterItemAdjustment,
          },
          type: row.type,
        },
      })
    } else if (row.type === ORDER_TYPES.LAB) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: {
            labItems: [{ ...row }],
            editServiceId: row.serviceFK,
            selectCategory: 'All',
            selectTag: 'All',
            filterService: '',
            serviceCenterFK: row.serviceCenterFK,
            quantity: row.quantity,
            total: row.total,
            totalAfterItemAdjustment: row.totalAfterItemAdjustment,
          },
          type: row.type,
        },
      })
    } else {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: row,
          isPreOrderItemExists: false,
          type: row.type,
        },
      })
    }
    if (row.type === '7') {
      const treatment =
        (codetable.cttreatment || []).find(
          o => o.isActive && o.id === row.treatmentFK,
        ) || {}
      const action = (codetable.ctchartmethod || []).find(
        o => o.id === treatment.chartMethodFK,
      )
      dispatch({
        type: 'dentalChartComponent/updateState',
        payload: {
          mode: 'treatment',
          action,
        },
      })
    }
  }
  const addAdjustment = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackConfig: {
            model: 'orders',
            reducer: 'addFinalAdjustment',
          },
          showRemark: true,
          showAmountPreview: false,
          rows,
          adjustments,
          editAdj: undefined,
          defaultValues: {
            initialAmout: total,
          },
        },
      },
    })
  }

  const editAdjustment = adj => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackConfig: {
            model: 'orders',
            reducer: 'editFinalAdjustment',
          },
          showRemark: true,
          showAmountPreview: false,
          rows,
          adjustments,
          editAdj: adj,
          defaultValues: {
            ...adj,
            initialAmout: total,
          },
        },
      },
    })
  }
  const totalItems = [
    ...adjustments.map(o => ({
      columnName: 'currentTotal',
      type: `${o.uid}`,
    })),
  ]
  const messages = {
    total: (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 192,
        }}
      >
        <div>Total</div>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput
            value={totalWithGST}
            text
            currency
            style={{ width: 90 }}
          />
        </div>
      </div>
    ),
    subTotal: (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 192,
        }}
      >
        <div>Sub Total</div>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput value={subTotal} text currency style={{ width: 90 }} />
        </div>
      </div>
    ),
  }

  if (gstValue >= 0) {
    messages.gst = (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 175,
        }}
      >
        <AuthorizedContext.Provider
          value={getOrderAccessRight(OrderAccessRight())}
        >
          <Checkbox
            simple
            label={`Inclusive GST (${numeral(gstValue).format('0.00')}%)`}
            controlStyle={{ fontWeight: 500 }}
            checked={checkedStatusIncldGST}
            onChange={e => {
              dispatch({
                type: 'orders/updateState',
                payload: {
                  isGSTInclusive: e.target.value,
                },
              })
              dispatch({
                type: 'orders/calculateAmount',
              })
            }}
          />
        </AuthorizedContext.Provider>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput value={gst} text currency style={{ width: 90 }} />
        </div>
      </div>
    )
  }
  totalItems.push({ columnName: 'currentTotal', type: 'gst' })

  totalItems.push({ columnName: 'currentTotal', type: 'total' })
  totalItems.push({ columnName: 'currentTotal', type: 'subTotal' })
  adjustments.forEach(adj => {
    messages[adj.uid] = (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 225,
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'right',
            margin: '6px 0px',
          }}
        >
          <Tooltip title={adj.adjRemark}>
            <span>{adj.adjRemark}</span>
          </Tooltip>
        </div>
        <AuthorizedContext.Provider
          value={getOrderAccessRight(OrderAccessRight())}
        >
          <div
            style={{
              position: 'absolute',
              right: 160,
              top: 0,
            }}
          >
            <Tooltip title='Edit Adjustment'>
              <Button
                size='small'
                type='primary'
                style={{
                  top: -1,
                }}
                onClick={() => editAdjustment(adj)}
                icon={<EditFilled />}
              ></Button>
            </Tooltip>
            <Tooltip title='Delete Adjustment'>
              <Button
                size='small'
                type='danger'
                style={{
                  top: -1,
                  marginLeft: 8,
                }}
                onClick={() =>
                  dispatch({
                    type: 'orders/deleteFinalAdjustment',
                    payload: {
                      uid: adj.uid,
                    },
                  })
                }
                icon={<DeleteFilled />}
              ></Button>
            </Tooltip>
          </div>
        </AuthorizedContext.Provider>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput
            value={adj.adjAmount}
            text
            currency
            style={{ width: 90 }}
          />
        </div>
      </div>
    )
  })

  const isEditingEntity = !_.isEmpty(orders.entity)

  const wrapCellTextStyle = {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }

  const drugMixtureIndicator = (row, right) => {
    if (row.type !== '1' || !row.isDrugMixture) return null
    const activePrescriptionItemDrugMixture = row.corPrescriptionItemDrugMixture.filter(
      item => !item.isDeleted,
    )

    return (
      <DrugMixtureInfo
        values={activePrescriptionItemDrugMixture}
        isShowTooltip={true}
        right={right}
      />
    )
  }

  const packageDrawdownIndicator = row => {
    if (!row.isPackage) return null

    return (
      <div style={{ position: 'relative' }}>
        <PackageDrawdownInfo
          drawdownData={row}
          asAtDate={row.packageDrawdownAsAtDate}
        />
      </div>
    )
  }

  const packageGroupCellContent = ({ row }) => {
    if (row.value === undefined || row.value === '') {
      return (
        <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
          <strong>Non-Package Items</strong>
        </span>
      )
    }

    let label = 'Package'
    let totalPrice = 0
    if (!rows) return ''
    const data = rows.filter(item => item.packageGlobalId === row.value)
    if (data.length > 0) {
      totalPrice = _.sumBy(data, 'totalAfterItemAdjustment') || 0
      label = `${data[0].packageCode} - ${data[0].packageName} (Total: `
    }
    return (
      <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
        <strong>
          {label}
          <NumberInput text currency value={totalPrice} />)
        </strong>
      </span>
    )
  }

  const getDisplayName = row => {
    if (
      row.type === ORDER_TYPES.RADIOLOGY ||
      row.type === ORDER_TYPES.SERVICE ||
      ORDER_TYPES.LAB
    ) {
      if (row.newServiceName && row.newServiceName.trim() !== '') {
        return row.newServiceName
      }
    }
    return row.subject
  }

  const radiologyWorkitemStatus = radiologyWorkitemStatusFK => {
    if (radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.NEW)
      return (
        <Tooltip title='New'>
          <div
            style={{
              position: 'absolute',
              bottom: 3,
              right: -15,
              borderRadius: 8,
              height: 16,
              width: 16,
              border: '2px solid #4876FF',
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      )

    if (
      radiologyWorkitemStatusFK ===
        RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED ||
      radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
      radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.INPROGRESS
    )
      return (
        <Tooltip
          title={
            radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.INPROGRESS
              ? 'In Progress'
              : radiologyWorkitemStatusFK ===
                RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED
              ? 'Modality Completed'
              : 'Completed'
          }
        >
          <div
            style={{
              position: 'absolute',
              bottom: 3,
              right: -15,
              borderRadius: 8,
              height: 16,
              width: 16,
              backgroundColor:
                radiologyWorkitemStatusFK ===
                RADIOLOGY_WORKITEM_STATUS.INPROGRESS
                  ? '#1890FF'
                  : '#009900',
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      )
    if (radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED)
      return (
        <Tooltip title='Cancelled'>
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -16,
              cursor: 'pointer',
            }}
          >
            <Cross
              style={{ color: 'black', height: 20, width: 20 }}
              color='black'
            />
          </div>
        </Tooltip>
      )
    return ''
  }

  const getVisitOrderTemplateDetails = rows => {
    const { entity } = visitRegistration || {}
    if (!entity) return ''
    const { visit } = entity
    const { visitOrderTemplate = {} } = visit
    const { visitOrderTemplateItemDtos = [] } = visitOrderTemplate
    const remainedTemplateItemIds = rows
      .filter(t => !t.isDeleted && t.visitOrderTemplateItemFK)
      .map(t => t.visitOrderTemplateItemFK)
    let indicateString = visitOrderTemplate.displayValue
    let removedItemString = _.join(
      visitOrderTemplateItemDtos
        .filter(t => remainedTemplateItemIds.indexOf(t.id) < 0)
        .map(t => ' - ' + t.inventoryItemName),
      ' ',
    )
    let newItemString = _.join(
      rows
        .filter(t => !t.isDeleted && !t.visitOrderTemplateItemFK)
        .map(t => {
          return ' + ' + t.subject
        }),
      ' ',
    )
    return {
      indicateString: `${indicateString}`,
      removedItemString: `${removedItemString ? removedItemString : ''}`,
      newItemString: `${newItemString ? newItemString : ''}`,
    }
  }

  const revertVisitPurpose = () => {
    const { entity } = visitRegistration
    const { visit } = entity
    const { visitOrderTemplate } = visit
    const { visitOrderTemplateItemDtos } = visitOrderTemplate

    let removedTemplateItems = visitOrderTemplateItemDtos.filter(t => {
      if (
        rows.filter(
          x => x.isDeleted === false && x.visitOrderTemplateItemFK === t.id,
        ).length > 0
      ) {
        return undefined
      } else return t
    })
    if (visit.visitPurposeFK === VISIT_TYPE.OTC) {
      removedTemplateItems = removedTemplateItems.filter(
        t => t.inventoryItemTypeFK != 3,
      )
    }
    _.sortBy(removedTemplateItems, 'inventoryItemTypeFK')
    setRemovedVisitOrderTemplateItem(removedTemplateItems)
    setShowRevertVisitPurposeItem(true)
  }
  const confirmRevert = data => {
    var newDrugItems = data.map(templateItem => {
      if (templateItem.visitOrderTemplateMedicationItemDto) {
        try {
          const newDrug = GetNewMedication(templateItem)
          dispatch({
            type: 'orders/upsertRow',
            payload: newDrug,
          })
        } catch (error) {
          console.log(error)
          notification.error({
            message: `Revert drug ${templateItem?.inventoryItemName} failed.`,
          })
        }
      } else if (templateItem.visitOrderTemplateVaccinationItemDto) {
        try {
          const newVaccine = GetNewVaccination(templateItem)
          dispatch({
            type: 'orders/upsertRow',
            payload: newVaccine,
          })
        } catch (error) {
          notification.error({
            message: `Revert vaccination ${templateItem?.inventoryItemName} failed.`,
          })
        }
      } else if (templateItem.visitOrderTemplateConsumableItemDto) {
        try {
          const newConsumable = GetConsumable(templateItem)
          dispatch({
            type: 'orders/upsertRow',
            payload: newConsumable,
          })
        } catch (error) {
          console.log(error)
          notification.error({
            message: `Revert consumable ${templateItem?.inventoryItemName} failed.`,
          })
        }
      } else if (templateItem.visitOrderTemplateServiceItemDto) {
        try {
          const newService = GetService(templateItem)
          dispatch({
            type: 'orders/upsertRow',
            payload: newService,
          })
        } catch (error) {
          console.log(error)
          notification.error({
            message: `Revert service ${templateItem?.inventoryItemName} failed.`,
          })
        }
      }
    })
    setShowRevertVisitPurposeItem(false)
  }
  return (
    <Fragment>
      <CommonTableGrid
        size='sm'
        style={{ margin: 0 }}
        forceRender
        rows={(rows || []).map(r => {
          return {
            ...r,
            currentTotal:
              (!r.isPreOrder && !r.hasPaid) || r.isChargeToday
                ? r.totalAfterItemAdjustment
                : 0,
            isEditingEntity: isEditingEntity,
          }
        })}
        onRowDoubleClick={editRow}
        getRowId={r => r.uid}
        columns={[
          { name: 'type', title: 'Type' },
          { name: 'subject', title: 'Name' },
          { name: 'priority', title: 'Urgent' },
          { name: 'description', title: 'Instructions' },
          { name: 'quantity', title: 'Qty.' },
          { name: 'adjAmount', title: 'Adj.' },
          { name: 'currentTotal', title: 'Total' },
          { name: 'actions', title: 'Actions' },
          { name: 'packageGlobalId', title: 'Package' },
        ]}
        defaultSorting={[
          { columnName: 'packageGlobalId', direction: 'asc' },
          { columnName: 'sequence', direction: 'asc' },
        ]}
        FuncProps={{
          pager: false,
          fixedHiddenColumns: ['packageGlobalId'],
          grouping: isExistPackage,
          groupingConfig: {
            state: {
              grouping: [{ columnName: 'packageGlobalId' }],
              expandedGroups: [...expandedGroups],
              onExpandedGroupsChange: handleExpandedGroupsChange,
            },
            row: {
              contentComponent: packageGroupCellContent,
            },
          },
          summary: true,
          summaryConfig: {
            state: {
              totalItems,
            },
            integrated: {
              calculator: (type, r, getValue) => {
                if (type === 'subTotal') {
                  return (
                    <span style={{ float: 'right', paddingRight: 70 }}>
                      <NumberInput value={subTotal} text currency />
                    </span>
                  )
                }

                if (type === 'gst') {
                  return (
                    <span style={{ float: 'right', paddingRight: 70 }}>
                      <NumberInput value={gst} text currency />
                    </span>
                  )
                }

                if (type === 'total') {
                  return (
                    <span style={{ float: 'right', paddingRight: 70 }}>
                      <NumberInput value={totalWithGST} text currency />
                    </span>
                  )
                }
                const adj = adjustments.find(o => `${o.uid}` === type)
                if (adj) {
                  return (
                    <span style={{ float: 'right', paddingRight: 70 }}>
                      <NumberInput value={adj.adjAmount} text currency />
                    </span>
                  )
                }

                return IntegratedSummary.defaultCalculator(type, r, getValue)
              },
            },
            row: {
              messages,
              totalRowComponent: p => {
                const { entity } = visitRegistration || {}
                const { visit } = entity || {}
                const { children, ...restProps } = p
                let newChildren = []
                let indicate = visit?.visitOrderTemplateFK
                  ? getVisitOrderTemplateDetails(rows)
                  : {}
                const indicateStringContent = (
                  <span className='threeline_textblock'>
                    {indicate.indicateString ? (
                      <span>{indicate.indicateString}</span>
                    ) : (
                      <span></span>
                    )}
                    {indicate.removedItemString ? (
                      <span style={{ color: '#FF0000' }}>
                        {indicate.removedItemString}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    {indicate.newItemString ? (
                      <span style={{ color: '#389e0d' }}>
                        {indicate.newItemString}
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </span>
                )
                if (isExistPackage) {
                  newChildren = [
                    <Table.Cell
                      colSpan={4}
                      key={1}
                      style={{ position: 'relative' }}
                    >
                      {visit && visit.visitOrderTemplateFK && (
                        <div>
                          <div>
                            <VisitOrderTemplateIndicateString
                              indicate={indicate}
                            ></VisitOrderTemplateIndicateString>
                          </div>
                          <div>
                            <Link
                              style={{ textDecoration: 'underline' }}
                              onClick={revertVisitPurpose}
                            >
                              Click to Revert Visit Purpose Item
                            </Link>
                          </div>
                        </div>
                      )}
                    </Table.Cell>,
                    React.cloneElement(children[7], {
                      colSpan: 3,
                      ...restProps,
                    }),
                  ]
                } else {
                  newChildren = [
                    <Table.Cell
                      colSpan={3}
                      key={1}
                      style={{
                        position: 'relative',
                        color: 'rgba(0, 0, 0, 0.87)',
                      }}
                    >
                      {visit && visit.visitOrderTemplateFK && (
                        <div>
                          <div>
                            <VisitOrderTemplateIndicateString
                              indicate={indicate}
                            ></VisitOrderTemplateIndicateString>
                          </div>
                          <div>
                            <Link
                              style={{ textDecoration: 'underline' }}
                              onClick={revertVisitPurpose}
                            >
                              Click to Revert Visit Purpose Item
                            </Link>
                          </div>
                        </div>
                      )}
                    </Table.Cell>,
                    React.cloneElement(children[6], {
                      colSpan: 2,
                      ...restProps,
                    }),
                  ]
                }

                return <Table.Row>{newChildren}</Table.Row>
              },
              itemComponent: p => {
                return (
                  <div className={classes.summaryRow}>{messages[p.type]}</div>
                )
              },
              totalCellComponent: p => {
                const { children, column } = p
                if (column.name === 'currentTotal') {
                  const items = children.props.children
                  const itemAdj = items.splice(0, items.length - 3)
                  const itemGST = items.splice(
                    items.length - 3,
                    items.length - 2,
                  )
                  const itemTotal = items.splice(
                    items.length - 2,
                    items.length - 1,
                  )
                  const itemSubTotal = items.splice(items.length - 1)
                  return (
                    <Table.Cell
                      colSpan={5}
                      style={{
                        fontSize: 'inherit',
                        color: 'inherit',
                        fontWeight: 500,
                        border: 'transparent',
                      }}
                    >
                      <div>
                        {itemSubTotal}
                        <div
                          style={{
                            marginBottom: theme.spacing(1),
                            marginLeft: theme.spacing(1),
                            paddingRight: theme.spacing(8),
                          }}
                        >
                          <Divider />
                        </div>
                        <div
                          style={{
                            textAlign: 'right',
                            position: 'relative',
                            paddingRight: 160,
                          }}
                        >
                          <span>
                            Invoice Adjustment
                            <Tooltip title='Add Adjustment'>
                              <AuthorizedContext.Provider
                                value={getOrderAccessRight(OrderAccessRight())}
                              >
                                <Button
                                  size='small'
                                  type='primary'
                                  style={{
                                    top: -1,
                                    marginLeft: theme.spacing(1),
                                  }}
                                  onClick={addAdjustment}
                                  icon={<PlusOutlined />}
                                ></Button>
                              </AuthorizedContext.Provider>
                            </Tooltip>
                          </span>
                        </div>
                        {itemAdj}
                        {gstValue >= 0 && itemGST}
                        <div
                          style={{
                            marginBottom: theme.spacing(1),
                            marginLeft: theme.spacing(1),
                            paddingRight: theme.spacing(8),
                          }}
                        >
                          <Divider />
                        </div>
                        {itemTotal}
                      </div>
                    </Table.Cell>
                  )
                }
                return null
              },
            },
          },
        }}
        columnExtensions={[
          {
            columnName: 'type',
            width: 135,
            render: row => {
              const otype = orderTypes.find(o => o.value === row.type)
              let texts = []

              if (row.type === '1') {
                if (row.isDrugMixture === true) texts = 'Drug Mixture'
                else {
                  texts = [
                    otype.name,
                    row.isExternalPrescription === true ? '(Ext.)' : '',
                    row.isActive ? '' : '(Inactive)',
                  ].join(' ')
                }
              } else {
                texts = [
                  otype.name,
                  row.type === '5' || row.isActive ? '' : '(Inactive)',
                ].join(' ')
              }

              let radiologyWorkitemStatusFK
              if (row.type === '10' && !row.isPreOrder) {
                const { workitem = {} } = row
                const { radiologyWorkitem = {} } = workitem
                radiologyWorkitemStatusFK = radiologyWorkitem.statusFK
              }

              let paddingRight = 0
              if (row.isPreOrder && row.isExclusive) {
                paddingRight = 52
              } else if (row.isPreOrder || row.isExclusive) {
                paddingRight = 24
              }

              if (row.isDrugMixture || radiologyWorkitemStatusFK) {
                paddingRight = 10
              }

              return (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      paddingRight: paddingRight,
                    }}
                  >
                    <Tooltip title={texts}>
                      <span>{texts}</span>
                    </Tooltip>
                    <div style={{ position: 'relative', top: 2 }}>
                      {drugMixtureIndicator(row, -20)}
                      {row.isPreOrder && (
                        <Tooltip title='New Pre-Order'>
                          <div
                            className={classes.rightIcon}
                            style={{
                              right: -30,
                              borderRadius: 4,
                              backgroundColor: '#4255bd',
                            }}
                          >
                            Pre
                          </div>
                        </Tooltip>
                      )}
                      {row.actualizedPreOrderItemFK && (
                        <Tooltip title='Actualized Pre-Order'>
                          <div
                            className={classes.rightIcon}
                            style={{
                              right: -5,
                              borderRadius: 4,
                              backgroundColor: 'green',
                            }}
                          >
                            Pre
                          </div>
                        </Tooltip>
                      )}
                      {row.isExclusive && (
                        <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                          <div
                            className={classes.rightIcon}
                            style={{
                              right:
                                row.isPreOrder || row.actualizedPreOrderItemFK
                                  ? -60
                                  : -30,
                              borderRadius: 4,
                              backgroundColor: 'green',
                            }}
                          >
                            Excl.
                          </div>
                        </Tooltip>
                      )}
                      {radiologyWorkitemStatusFK &&
                        radiologyWorkitemStatus(radiologyWorkitemStatusFK)}
                    </div>
                  </div>
                </div>
              )
            },
          },
          {
            columnName: 'subject',
            render: row => {
              return (
                <div style={{ position: 'relative' }}>
                  <Tooltip
                    title={
                      <div>
                        {`Code: ${row.serviceCode ||
                          row.drugCode ||
                          row.consumableCode ||
                          row.vaccinationCode}`}
                        <br />
                        {`Name: ${getDisplayName(row)}`}
                      </div>
                    }
                  >
                    <div style={wrapCellTextStyle}>
                      {packageDrawdownIndicator(row)}
                      <div
                        style={{
                          position: 'relative',
                          left: row.isPackage ? 22 : 0,
                        }}
                      >
                        {getDisplayName(row)}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              )
            },
          },
          {
            columnName: 'description',
            width: isFullScreen ? 300 : isExistPackage ? 120 : 150,
            observeFields: ['instruction', 'remark', 'remarks'],
            render: row => {
              return (
                <Tooltip title={row.instruction}>
                  <div
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {row.instruction || ''}
                  </div>
                </Tooltip>
              )
            },
          },
          {
            columnName: 'adjAmount',
            type: 'currency',
            width: 80,
          },
          {
            columnName: 'currentTotal',
            type: 'currency',
            width: 90,
          },
          {
            columnName: 'quantity',
            type: 'number',
            width: 100,
            render: row => {
              let qty = '0.0'
              if (row.type === '1' || row.type === '5' || row.type === '2') {
                qty = `${numeral(row.quantity || 0).format(
                  '0,0.0',
                )} ${row.dispenseUOMDisplayValue || ''}`
              } else if (
                row.type === ORDER_TYPES.SERVICE ||
                row.type === ORDER_TYPES.TREATMENT ||
                row.type === ORDER_TYPES.RADIOLOGY ||
                row.type === ORDER_TYPES.LAB
              ) {
                qty = `${numeral(row.quantity || 0).format('0,0.0')}`
              } else if (row.type === ORDER_TYPES.CONSUMABLE) {
                qty = `${numeral(row.quantity || 0).format('0,0.0')} ${
                  row.unitOfMeasurement
                }`
              }
              return (
                <Tooltip title={qty}>
                  <span>{qty}</span>
                </Tooltip>
              )
            },
          },
          {
            columnName: 'actions',
            width: 70,
            align: 'center',
            sortingEnabled: false,
            render: row => {
              if (row.type === '7' && from !== 'EditOrder') return null

              const editAccessRight = OrderItemAccessRight(row)
              const { workitem = {} } = row
              const {
                nurseWorkitem = {},
                radiologyWorkitem = {},
                labWorkitems = [],
              } = workitem
              const { nuseActualize = [] } = nurseWorkitem
              let editMessage = 'Edit'
              let deleteMessage = 'Delete'
              let editEnable = true
              let deleteEnable = true
              if (!row.isPreOrder) {
                if (row.type === ORDER_TYPES.RADIOLOGY) {
                  if (
                    [
                      RADIOLOGY_WORKITEM_STATUS.INPROGRESS,
                      RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED,
                      RADIOLOGY_WORKITEM_STATUS.COMPLETED,
                    ].indexOf(radiologyWorkitem.statusFK) >= 0
                  ) {
                    deleteEnable = false
                    deleteMessage =
                      'No modification is allowed on processed order'
                  }
                  if (
                    radiologyWorkitem.statusFK ===
                    RADIOLOGY_WORKITEM_STATUS.CANCELLED
                  ) {
                    editEnable = false
                  }
                } else if (row.type === ORDER_TYPES.LAB) {
                  if (
                    labWorkitems.filter(
                      item => item.statusFK !== LAB_WORKITEM_STATUS.NEW,
                    ).length > 0
                  ) {
                    deleteEnable = false
                    deleteMessage =
                      'Specimen Collected. No modification is allowed on processed order'
                  }
                } else {
                  if (
                    nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
                  ) {
                    const lastNuseActualize = _.orderBy(
                      nuseActualize,
                      ['actulizeDate'],
                      ['desc'],
                    )[0]
                    if (editEnable) {
                      editEnable = false
                      editMessage = `Item actualized by ${lastNuseActualize.actulizeByUser}. Modification allowed after nurse cancel actualization`
                    }
                    if (deleteEnable) {
                      deleteEnable = false
                      deleteMessage = `Item actualized by ${lastNuseActualize.actulizeByUser}. Modification allowed after nurse cancel actualization`
                    }
                  }
                }
              }
              return (
                <AuthorizedContext.Provider
                  value={getOrderAccessRight(editAccessRight)}
                >
                  <div>
                    <Tooltip title={editMessage}>
                      <Button
                        size='small'
                        onClick={() => {
                          editRow(row)
                        }}
                        type='primary'
                        style={{ marginRight: 5 }}
                        disabled={
                          row.isEditingEntity ||
                          (!row.isActive &&
                            row.type !== '5' &&
                            !row.isDrugMixture) ||
                          row.isPreOrderActualize ||
                          !editEnable
                        }
                        icon={<EditFilled />}
                      ></Button>
                    </Tooltip>
                    <Tooltip title={deleteMessage}>
                      <Button
                        size='small'
                        type='danger'
                        disabled={
                          row.isEditingEntity ||
                          row.isPreOrderActualize ||
                          !deleteEnable
                        }
                        onClick={() => {
                          dispatch({
                            type: 'orders/deleteRow',
                            payload: {
                              uid: row.uid,
                            },
                          })

                          if (row.isPackage === true) {
                            dispatch({
                              type: 'orders/deletePackageItem',
                              payload: {
                                packageGlobalId: row.packageGlobalId,
                              },
                            })
                          }

                          dispatch({
                            type: 'orders/updateState',
                            payload: {
                              entity: undefined,
                            },
                          })
                        }}
                        icon={<DeleteFilled />}
                      ></Button>
                    </Tooltip>
                  </div>
                </AuthorizedContext.Provider>
              )
            },
          },
          {
            columnName: 'priority',
            width: 70,
            align: 'center',
            sortingEnabled: false,
            render: row => {
              if (
                row.type !== ORDER_TYPES.RADIOLOGY &&
                row.type !== ORDER_TYPES.SERVICE &&
                row.type !== ORDER_TYPES.LAB
              )
                return ''
              const editAccessRight = OrderItemAccessRight(row)
              const { workitem = {} } = row
              const {
                nurseWorkitem = {},
                radiologyWorkitem = {
                  statusFK: RADIOLOGY_WORKITEM_STATUS.NEW,
                },
                labWorkitems = [],
              } = workitem
              let editEnable = true
              if (!row.isPreOrder) {
                if (row.type === ORDER_TYPES.RADIOLOGY) {
                  if (
                    radiologyWorkitem.statusFK !== RADIOLOGY_WORKITEM_STATUS.NEW
                  ) {
                    editEnable = false
                  }
                } else if (
                  nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
                ) {
                  editEnable = false
                } else if (row.type === ORDER_TYPES.LAB) {
                  if (
                    labWorkitems.filter(
                      item => item.statusFK !== LAB_WORKITEM_STATUS.NEW,
                    ).length > 0
                  )
                    editEnable = false
                }
              }
              return (
                <AuthorizedContext.Provider
                  value={getOrderAccessRight(editAccessRight)}
                >
                  <Switch
                    checkedValue='Urgent'
                    unCheckedValue='Normal'
                    value={row.priority}
                    className={classes.switchContainer}
                    preventToggle
                    disabled={
                      row.isEditingEntity ||
                      row.isPreOrderActualize ||
                      !editEnable
                    }
                    onClick={checked => {
                      dispatch({
                        type: 'orders/updatePriority',
                        payload: {
                          uid: row.uid,
                          priority: checked ? 'Urgent' : 'Normal',
                        },
                      })
                    }}
                  />
                </AuthorizedContext.Provider>
              )
            },
          },
        ]}
      />
      <CommonModal
        open={showRevertVisitPurposeItem}
        title='Revert Visit Purpose Item(s)'
        cancelText='Cancel'
        maxWidth='sm'
        onClose={() => {
          setShowRevertVisitPurposeItem(false)
        }}
        onConfirm={() => {
          setShowRevertVisitPurposeItem(false)
        }}
      >
        <VisitOrderTemplateRevert
          data={removedVisitOrderTemplateItem}
          confirmRevert={confirmRevert}
        ></VisitOrderTemplateRevert>
      </CommonModal>
    </Fragment>
  )
}
