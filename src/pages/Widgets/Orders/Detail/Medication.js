import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import { formatMessage } from 'umi'
import { isNumber } from 'util'
import { Alert } from 'antd'
import { VISIT_TYPE, CANNED_TEXT_TYPE } from '@/utils/constants'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Select,
  CodeSelect,
  DatePicker,
  Checkbox,
  NumberInput,
  withFormikExtend,
  FastField,
  FieldArray,
  Tooltip,
  Field,
  CommonModal,
  ProgressButton,
  notification,
  EditableTableGrid,
  Switch,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount, getUniqueId } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import Authorized from '@/utils/Authorized'
import { GetOrderItemAccessRight, getDrugAllergy } from '@/pages/Widgets/Orders/utils'
import { DoctorProfileSelect } from '@/components/_medisys'
import moment from 'moment'
import CannedTextButton from '@/pages/Widgets/Orders/Detail/CannedTextButton'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'
import LowStockInfo from './LowStockInfo'
import AddFromPast from './AddMedicationFromPast'
import PrescriptionSet from './PrescriptionSet'
import consultationDocument from '@/models/consultationDocument'
import { SubscriptionsOutlined } from '@material-ui/icons'
import { openCautionAlertPrompt } from '@/pages/Widgets/Orders/utils'

const authorityCfg = {
  '1': 'queue.consultation.order.medication',
  '5': 'queue.consultation.order.openprescription',
}

const drugMixtureItemSchema = Yup.object().shape({
  inventoryMedicationFK: Yup.string().required(),
  quantity: Yup.number().min(0),
  totalPrice: Yup.number().min(0),
})

const showCautions = (
  inventorymedication = [],
  isDrugMixture,
  corPrescriptionItemDrugMixture = [],
  inventoryMedicationFK,
  patient
) => {
  const { entity = {} } = patient
  const { patientAllergy = [] } = entity
  let cautions = []
  let allergys = []

  const insertAllergys = (inventoryMedicationFK) => {
    let drug = inventorymedication.find(
      (medication) => medication.id === inventoryMedicationFK,
    )
    if (!drug) return
    const newAllergys = getDrugAllergy(drug, patientAllergy)
    if (newAllergys.length) {
      allergys = [...allergys, ...newAllergys]
    }
  }

  if (isDrugMixture) {
    corPrescriptionItemDrugMixture
      .filter(o => !o.isDeleted)
      .forEach(item => {
        const selectMedication = inventorymedication.find(
          medication => medication.id === item.inventoryMedicationFK,
        )
        if (selectMedication) {
          if (
            selectMedication.caution &&
            selectMedication.caution.trim().length
          ) {
            cautions.push({
              type: 'Medication',
              subject: selectMedication.displayValue,
              caution: selectMedication.caution,
              id: item.id,
            })
          }

          insertAllergys(item.inventoryMedicationFK)
        }
      })
  } else {
    const selectMedication = inventorymedication.find(
      medication => medication.id === inventoryMedicationFK,
    )
    insertAllergys(inventoryMedicationFK)

    if (
      selectMedication &&
      selectMedication.caution &&
      selectMedication.caution.trim().length
    ) {
      cautions.push({
        type: 'Medication',
        subject: selectMedication.displayValue,
        caution: selectMedication.caution,
        id: inventoryMedicationFK,
      })
    }
  }
  if (cautions.length || allergys.length) {
    openCautionAlertPrompt(cautions, allergys, [], () => { })
  }
}

const getVisitDoctorUserId = props => {
  const { doctorprofile } = props.codetable
  const { doctorProfileFK } = props.visitRegistration.entity.visit
  let visitDoctorUserId
  if (doctorprofile && doctorProfileFK) {
    visitDoctorUserId = doctorprofile.find(d => d.id === doctorProfileFK)
      .clinicianProfile.userProfileFK
  }

  return visitDoctorUserId
}

@connect(({ global, codetable, visitRegistration, user, patient }) => ({
  global,
  codetable,
  visitRegistration,
  user,
  patient,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type, codetable, visitRegistration }) => {
    const isDrugMixture = orders.entity && orders.entity.isDrugMixture
    const editingMedicationFK = []
    if (isDrugMixture) {
      const mixtureItems = orders.entity.corPrescriptionItemDrugMixture || []
      mixtureItems
        .filter(o => !o.isDeleted)
        .map(m => editingMedicationFK.push(m.inventoryMedicationFK))
    } else if (orders.entity && orders.entity.inventoryMedicationFK) {
      editingMedicationFK.push(orders.entity.inventoryMedicationFK)
    }

    const v = {
      ...(orders.entity || orders.defaultMedication),
      type,
      visitPurposeFK: orders.visitPurposeFK,
      isEditMedication: !_.isEmpty(orders.entity),
      editingMedicationFK,
    }
    if (type === '5') {
      v.drugCode = 'MISC'
      v.isDispensedByPharmacy = true
    }
    if (v.uid) {
      if (v.adjAmount <= 0) {
        v.adjValue = Math.abs(v.adjValue || 0)
        v.isMinus = true
      } else {
        v.isMinus = false
      }

      v.isExactAmount = v.adjType !== 'Percentage'
    }

    if (_.isEmpty(orders.entity)) {
      const { doctorprofile } = codetable
      if (visitRegistration && visitRegistration.entity) {
        const { doctorProfileFK } = visitRegistration.entity.visit
        if (doctorprofile && doctorProfileFK) {
          v.performingUserFK = doctorprofile.find(
            d => d.id === doctorProfileFK,
          ).clinicianProfile.userProfileFK
        }
      }
    }

    let sequence = 0
    const newCorPrescriptionItemPrecaution = (
      v.corPrescriptionItemPrecaution || []
    ).map(precaution => {
      sequence += 1
      return {
        ...precaution,
        sequence,
        uid: precaution.uid || getUniqueId()
      }
    })

    let newDrugMixtureRowId = 0
    const newCorPrescriptionItemDrugMixture = (
      v.corPrescriptionItemDrugMixture || []
    ).map(drugMixture => {
      newDrugMixtureRowId -= 1
      return {
        ...drugMixture,
        id: drugMixture.isNew ? newDrugMixtureRowId : drugMixture.id,
      }
    })

    const { inventorymedication = [] } = codetable

    const medication = inventorymedication.find(
      item => item.id === v.inventoryMedicationFK,
    )
    return {
      ...v,
      corPrescriptionItemInstruction: v.corPrescriptionItemInstruction.map(i => {
        return {
          ...i,
          uid: i.uid || getUniqueId()
        }
      }),
      corPrescriptionItemPrecaution:
        newCorPrescriptionItemPrecaution.length > 0
          ? newCorPrescriptionItemPrecaution
          : [{}],
      corPrescriptionItemDrugMixture:
        newCorPrescriptionItemDrugMixture.length > 0
          ? newCorPrescriptionItemDrugMixture
          : [],
      selectedMedication: medication || {
        medicationStock: [],
      },
    }
  },
  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    quantity: Yup.number()
      .min(0.0, 'Quantity must be between 0.0 and 999')
      .max(999, 'Quantity must be between 0.0 and 999')
      .required(),
    dispenseUOMFK: Yup.number().required(),
    totalPrice: Yup.number().required(),
    totalAfterItemAdjustment: Yup.number().min(
      0.0,
      'The amount should be more than 0.00',
    ),
    type: Yup.string(),
    inventoryMedicationFK: Yup.number().when(
      ['type', 'isDrugMixture'],
      (type, isDrugMixture) => {
        if (type === '1' && !isDrugMixture) return Yup.number().required()
        return Yup.number()
      },
    ),

    drugName: Yup.string().when(
      ['type', 'isDrugMixture'],
      (type, isDrugMixture) => {
        if (type === '5') return Yup.string().required()
        if (type === '1' && isDrugMixture) return Yup.string().required()
        return Yup.string()
      },
    ),
    corPrescriptionItemInstruction: Yup.array().of(
      Yup.object().shape({
        sequence: Yup.number().required(),
        stepdose: Yup.string().required(),
      }),
    ),
    corPrescriptionItemDrugMixture: Yup.array().when(
      ['type', 'isDrugMixture'],
      (type, isDrugMixture) => {
        if (type === '1' && isDrugMixture)
          return Yup.array()
            .compact(v => v.isDeleted)
            .of(drugMixtureItemSchema)
        return Yup.array().compact(v => v.isDeleted)
      },
    ),
    performingUserFK: Yup.number().required(),
  }),

  handleSubmit: (values, { props, onConfirm, setValues }) => {
    const { dispatch, currentType, getNextSequence, user, orders } = props

    const getInstruction = instructions => {
      let instruction = ''
      let nextStepdose = ''
      const activeInstructions = instructions
        ? instructions.filter(item => !item.isDeleted)
        : undefined
      if (activeInstructions) {
        for (let index = 0; index < activeInstructions.length; index++) {
          let item = activeInstructions[index]
          if (instruction !== '') {
            instruction += ' '
          }

          if (index < activeInstructions.length - 1) {
            nextStepdose = ` ${activeInstructions[index + 1].stepdose}`
          } else {
            nextStepdose = ''
          }

          const itemDuration = item.duration
            ? ` For ${item.duration} day(s)`
            : ''

          instruction += `${item.usageMethodDisplayValue ? item.usageMethodDisplayValue : ''
            } ${item.dosageDisplayValue ? item.dosageDisplayValue : ''} ${item.prescribeUOMDisplayValue ? item.prescribeUOMDisplayValue : ''
            } ${item.drugFrequencyDisplayValue ? item.drugFrequencyDisplayValue : ''
            }${itemDuration}${nextStepdose}`
        }
      }
      return instruction
    }

    const instruction = getInstruction(values.corPrescriptionItemInstruction)

    const corPrescriptionItemPrecaution = values.corPrescriptionItemPrecaution.filter(
      i => i.medicationPrecautionFK !== undefined,
    )

    const activeInstruction = values.corPrescriptionItemInstruction.filter(
      item => !item.isDeleted,
    )

    // reorder and overwrite sequence
    corPrescriptionItemPrecaution.forEach((item, index) => {
      if (!item.isDeleted) item.sequence = index + 1
    })

    // reorder and overwrite sequence
    activeInstruction.forEach((item, index) => {
      item.sequence = index + 1
    })

    if (values.corPrescriptionItemDrugMixture) {
      const activeDrugMixtureItems = values.corPrescriptionItemDrugMixture.filter(
        item => !item.isDeleted,
      )
      // reorder and overwrite sequence, get combined drug name
      activeDrugMixtureItems.forEach((item, index) => {
        if (item.isNew && item.id < 0) item.id = undefined
      })
    }

    const data = {
      isOrderedByDoctor:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
      sequence: getNextSequence(),
      ...values,
      corPrescriptionItemPrecaution,
      instruction,
      subject: currentType.getSubject({ ...values }),
      isDeleted: false,
      adjValue:
        values.adjAmount < 0
          ? -Math.abs(values.adjValue)
          : Math.abs(values.adjValue),
      adjType: values.isExactAmount ? 'ExactAmount' : 'Percentage',
      packageGlobalId:
        values.packageGlobalId !== undefined ? values.packageGlobalId : '',
    }

    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })

    if (onConfirm) onConfirm()

    setValues({
      ...orders.defaultMedication,
      type: orders.type,
      visitPurposeFK: orders.visitPurposeFK,
      drugCode: orders.type === '5' ? 'MISC' : undefined,
      selectedMedication: {
        medicationStock: [],
      },
      performingUserFK: getVisitDoctorUserId(props),
    })
    return true
  },
  displayName: 'OrderPage',
})
class Medication extends PureComponent {
  state = {
    showAddFromPastModal: false,
    showAddFromPrescriptionSetModal: false,
  }

  getActionItem = (i, arrayHelpers, prop, tooltip, defaultValue) => {
    const { theme, values, setFieldValue } = this.props
    const activeRows = values[prop].filter(item => !item.isDeleted) || []
    return (
      <div style={{ position: 'absolute', bottom: 4, right: 0 }}>
        {activeRows.length > 1 && (
          <Button justIcon color='danger'>
            <Delete
              onClick={() => {
                setFieldValue(`${prop}[${i}].isDeleted`, true)
                if (prop === 'corPrescriptionItemInstruction') {
                  setTimeout(() => {
                    this.calculateQuantity()
                  }, 1)
                }
              }}
            />
          </Button>
        )}
        {activeRows.length < 3 && (
          <Button
            justIcon
            color='info'
            onClick={() => {
              this.handleAddStepdose(arrayHelpers, defaultValue, prop)
            }}
          >
            <Tooltip title={tooltip}>
              <Add />
            </Tooltip>
          </Button>
        )}
      </div>
    )
  }

  calculateQuantity = medication => {
    const { codetable, setFieldValue, values } = this.props
    if (values.isDrugMixture || values.isPackage) return
    let currentMedication = medication || values.selectedMedication

    const { form } = this.descriptionArrayHelpers
    let newTotalQuantity = 0

    // when select medication, TotalQuantity = dispensingQuantity, else calculate quantity by Instructions

    const prescriptionItem = form.values.corPrescriptionItemInstruction.filter(
      item => !item.isDeleted,
    )
    const dosageUsageList = codetable.ctmedicationdosage
    const medicationFrequencyList = codetable.ctmedicationfrequency
    for (let i = 0; i < prescriptionItem.length; i++) {
      if (
        prescriptionItem[i].dosageFK &&
        prescriptionItem[i].drugFrequencyFK &&
        prescriptionItem[i].duration
      ) {
        const dosage = dosageUsageList.find(
          o => o.id === prescriptionItem[i].dosageFK,
        )

        const frequency = medicationFrequencyList.find(
          o => o.id === prescriptionItem[i].drugFrequencyFK,
        )

        newTotalQuantity +=
          dosage.multiplier *
          frequency.multiplier *
          prescriptionItem[i].duration
      }
    }

    newTotalQuantity = Math.ceil(newTotalQuantity * 10) / 10 || 0
    const { prescriptionToDispenseConversion } = currentMedication
    if (prescriptionToDispenseConversion)
      newTotalQuantity = Math.ceil(
        newTotalQuantity / prescriptionToDispenseConversion,
      )
    setFieldValue(`quantity`, newTotalQuantity)

    if (
      values.isExternalPrescription === undefined ||
      values.isExternalPrescription === false
    ) {
      let unitprice = currentMedication.sellingPrice || 0
      setFieldValue('unitPrice', unitprice)
      this.updateTotalPrice(unitprice * newTotalQuantity)
    }
  }

  setTotalPrice = () => {
    const { values, disableEdit } = this.props
    if (values.isDrugMixture || values.isPackage) return

    if (disableEdit === false) {
      const total = (values.quantity || 0) * (values.unitPrice || 0)
      this.updateTotalPrice(total)
    }
  }

  handleAddStepdose = (arrayHelpers, defaultValue, prop) => {
    const { values } = this.props
    arrayHelpers.push(defaultValue)
    if (prop === 'corPrescriptionItemInstruction') {
      this.setInstruction(values.corPrescriptionItemInstruction.length)

      setTimeout(() => {
        this.calculateQuantity()
      }, 1)
    }
  }

  setInstruction = (index = 0) => {
    const { setFieldValue, codetable, values } = this.props
    const { selectedMedication } = values
    let op = selectedMedication

    if (!selectedMedication || !selectedMedication.id) {
      op = codetable.inventorymedication.find(
        o => o.id === values.inventoryMedicationFK,
      )
    }

    if (!op) return

    setFieldValue(
      `corPrescriptionItemInstruction[${index}].usageMethodFK`,
      op.medicationUsage ? op.medicationUsage.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].usageMethodCode`,
      op.medicationUsage ? op.medicationUsage.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].usageMethodDisplayValue`,
      op.medicationUsage ? op.medicationUsage.name : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].dosageFK`,
      op.prescribingDosage ? op.prescribingDosage.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].dosageCode`,
      op.prescribingDosage ? op.prescribingDosage.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].dosageDisplayValue`,
      op.prescribingDosage ? op.prescribingDosage.name : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].prescribeUOMFK`,
      op.prescribingUOM ? op.prescribingUOM.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].prescribeUOMCode`,
      op.prescribingUOM ? op.prescribingUOM.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].prescribeUOMDisplayValue`,
      op.prescribingUOM ? op.prescribingUOM.name : undefined,
    )

    setFieldValue(
      `corPrescriptionItemInstruction[${index}].drugFrequencyFK`,
      op.medicationFrequency ? op.medicationFrequency.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].drugFrequencyCode`,
      op.medicationFrequency ? op.medicationFrequency.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].drugFrequencyDisplayValue`,
      op.medicationFrequency ? op.medicationFrequency.name : undefined,
    )
    if (op.duration)
      setFieldValue(
        `corPrescriptionItemInstruction[${index}].duration`,
        op.duration,
      )
  }

  getMedicationOptions = () => {
    const {
      codetable: { inventorymedication = [] },
    } = this.props

    return inventorymedication.reduce((p, c) => {
      const { code, displayValue, sellingPrice = 0, dispensingUOM = {} } = c
      const { name: uomName = '' } = dispensingUOM
      let opt = {
        ...c,
        combinDisplayValue: `${displayValue} - ${code} (${currencySymbol}${sellingPrice.toFixed(
          2,
        )} / ${uomName})`,
      }
      return [...p, opt]
    }, [])
  }

  changeMedication = (
    v,
    op = {
      medicationStock: [],
    },
  ) => {
    const { setFieldValue, values, codetable, visitRegistration, patient, orders = {} } = this.props
    const { corVitalSign = [] } = orders
    setFieldValue('isDispensedByPharmacy', op.isDispensedByPharmacy)
    setFieldValue('isNurseActualizeRequired', op.isNurseActualizable)
    setFieldValue('isExclusive', op.isExclusive)
    setFieldValue('costPrice', op.averageCostPrice || 0)
    const {
      corPrescriptionItemInstruction = [],
      corPrescriptionItemPrecaution = [],
      visitPurposeFK,
    } = values
    let defaultInstruction = {
      sequence: 0,
      stepdose: 'AND',
      uid: getUniqueId()
    }

    let matchInstruction
    if (op.id) {
      let weightKG
      const activeVitalSign = corVitalSign.find(vs => !vs.isDeleted)
      if (activeVitalSign) {
        weightKG = activeVitalSign.weightKG
      }
      else {
        weightKG = visitRegistration.entity.visit.weightKG
      }
      const { dob } = patient.entity
      const { medicationInstructionRule = [] } = op
      let age
      if (dob) {
        age = Math.floor(moment.duration(moment().diff(dob)).asYears())
      }
      matchInstruction = medicationInstructionRule.find(i => isMatchInstructionRule(i, age, weightKG))
      const medicationfrequency = matchInstruction?.medicationFrequency
      const medicationdosage = matchInstruction?.medicationFrequency

      defaultInstruction = {
        ...defaultInstruction,
        usageMethodFK: op.medicationUsage ? op.medicationUsage.id : undefined,
        usageMethodCode: op.medicationUsage
          ? op.medicationUsage.code
          : undefined,
        usageMethodDisplayValue: op.medicationUsage
          ? op.medicationUsage.name
          : undefined,
        dosageFK: medicationdosage ? medicationdosage.id : undefined,
        dosageCode: medicationdosage
          ? medicationdosage.code
          : undefined,
        dosageDisplayValue: medicationdosage
          ? medicationdosage.name
          : undefined,
        prescribeUOMFK: op.prescribingUOM ? op.prescribingUOM.id : undefined,
        prescribeUOMCode: op.prescribingUOM
          ? op.prescribingUOM.code
          : undefined,
        prescribeUOMDisplayValue: op.prescribingUOM
          ? op.prescribingUOM.name
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

    const isEdit = !!values.id
    const newPrescriptionInstruction = isEdit
      ? [
        ...corPrescriptionItemInstruction.map(i => ({
          ...i,
          isDeleted: true,
        })),
        defaultInstruction,
      ]
      : [defaultInstruction]

    setFieldValue('corPrescriptionItemInstruction', newPrescriptionInstruction)
    setFieldValue('isActive', op.isActive)
    setFieldValue('selectedMedication', op)

    if (
      op.inventoryMedication_MedicationPrecaution &&
      op.inventoryMedication_MedicationPrecaution.length > 0
    ) {
      op.inventoryMedication_MedicationPrecaution.forEach((im, i) => {
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`,
          im.medicationPrecautionFK,
        )
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].precaution`,
          im.medicationPrecautionName,
        )
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].precautionCode`,
          im.medicationPrecautionCode,
        )
        setFieldValue(`corPrescriptionItemPrecaution[${i}].sequence`, i)
      })
    } else {
      const defaultPrecaution = {
        precaution: '',
        sequence: 0,
        uid: getUniqueId()
      }
      const newPrescriptionPrecaution = isEdit
        ? [
          ...corPrescriptionItemPrecaution.map(i => ({
            ...i,
            isDeleted: true,
          })),
          defaultPrecaution,
        ]
        : [defaultPrecaution]

      setFieldValue(`corPrescriptionItemPrecaution`, newPrescriptionPrecaution)
    }

    setFieldValue('dispenseUOMFK', op.dispensingUOM ? op.dispensingUOM.id : [])
    setFieldValue(
      'dispenseUOMCode',
      op.dispensingUOM ? op.dispensingUOM.code : [],
    )
    setFieldValue(
      'dispenseUOMDisplayValue',
      op.dispensingUOM ? op.dispensingUOM.name : [],
    )

    if (!values.isDrugMixture) {
      setFieldValue('drugCode', op.code)
      setFieldValue('drugName', op.displayValue)

      setFieldValue('isMinus', true)
      setFieldValue('isExactAmount', true)
      setFieldValue('adjValue', 0)
      setFieldValue('quantity', matchInstruction?.dispensingQuantity || 0)
      let unitprice = op.sellingPrice || 0
      setFieldValue('unitPrice', unitprice)
      this.updateTotalPrice(unitprice * (matchInstruction?.dispensingQuantity || 0))

      if (op) {
        const { codetable } = this.props
        const { inventorymedication = [] } = codetable

        showCautions(
          inventorymedication,
          values.isDrugMixture,
          values.corPrescriptionItemDrugMixture,
          op.id,
          patient,
        )
      }
    }
  }

  updateTotalPrice = v => {
    if (v || v === 0) {
      const { isExactAmount, isMinus, adjValue } = this.props.values
      let value = adjValue
      if (!isMinus) {
        value = Math.abs(adjValue)
      } else {
        value = -Math.abs(adjValue)
      }

      const finalAmount = calculateAdjustAmount(
        isExactAmount,
        v,
        value || adjValue,
      )
      this.props.setFieldValue('totalAfterItemAdjustment', finalAmount.amount)
      this.props.setFieldValue('adjAmount', finalAmount.adjAmount)
      this.props.setFieldValue(
        'adjType',
        isExactAmount ? 'ExactAmount' : 'Percentage',
      )
      this.props.setFieldValue('totalPrice', v)
    } else {
      this.props.setFieldValue('totalPrice', v)
      this.props.setFieldValue('totalAfterItemAdjustment', undefined)
      this.props.setFieldValue('adjAmount', undefined)
    }
  }

  handleReset = () => {
    const { setValues, orders } = this.props

    setValues({
      ...orders.defaultMedication,
      type: orders.type,
      visitPurposeFK: orders.visitPurposeFK,
      drugCode: orders.type === '5' ? 'MISC' : undefined,
      selectedMedication: {
        medicationStock: [],
      },
      performingUserFK: getVisitDoctorUserId(this.props),
    })
  }

  filterOptions = (input = '', option) => {
    let match = false
    try {
      const lowerCaseInput = input.toLowerCase()

      const { props } = option
      const { code, name, displayValue } = props.data
      let title = name ? name.toLowerCase() : displayValue.toLowerCase()
      match =
        code.toLowerCase().indexOf(lowerCaseInput) >= 0 ||
        title.toLowerCase().indexOf(lowerCaseInput) >= 0
    } catch (error) {
      console.log(error)
      match = false
    }
    return match
  }

  componentDidMount = async () => {
    const { codetable, dispatch } = this.props
    const { inventorymedication = [] } = codetable
    if (inventorymedication.length <= 0) {
      await dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'inventorymedication' },
      })
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.orders.type === this.props.type)
      if (
        (!this.props.global.openAdjustment &&
          nextProps.global.openAdjustment) ||
        nextProps.orders.shouldPushToState
      ) {
        nextProps.dispatch({
          type: 'orders/updateState',
          payload: {
            entity: nextProps.values,
            shouldPushToState: false,
          },
        })
      }
  }

  onSearchMedicationHistory = async () => {
    this.toggleAddFromPastModal()
  }

  toggleAddFromPastModal = () => {
    const { showAddFromPastModal } = this.state
    this.setState({ showAddFromPastModal: !showAddFromPastModal })
  }

  onSearchPrescriptionSet = async () => {
    this.toggleAddFromPrescriptionSetModal()
  }

  toggleAddFromPrescriptionSetModal = () => {
    const { showAddFromPrescriptionSetModal } = this.state
    this.setState({ showAddFromPrescriptionSetModal: !showAddFromPrescriptionSetModal })
  }

  validateAndSubmitIfOk = async () => {
    const { handleSubmit, validateForm, values, codetable } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)
    if (isFormValid) {
      const {
        type,
        isDrugMixture,
        corPrescriptionItemDrugMixture = [],
      } = values

      let drugMixtureItems
      if (type === '1' && isDrugMixture) {
        const { inventorymedication = [] } = codetable
        drugMixtureItems = corPrescriptionItemDrugMixture
          .filter(o => !o.isDeleted)
          .map(m => {
            let drug =
              inventorymedication.find(f => f.id === m.inventoryMedicationFK) ||
              {}
            return { ...m, subject: m.drugName, caution: drug.caution }
          })
        if (drugMixtureItems.length < 2) {
          notification.warn({
            message: 'At least two medications are required',
          })
          return false
        }
      }
      handleSubmit()
      return true
    }
    handleSubmit()
    return false
  }

  handleDrugMixtureItemOnChange = (e, a) => {
    const { option, row } = e
    const { values, setFieldValue, visitRegistration, patient, corVitalSign = [], codetable } = this.props
    const { drugName = '' } = values
    const rs = values.corPrescriptionItemDrugMixture.filter(
      o =>
        !o.isDeleted &&
        o.inventoryMedicationFK === option.id &&
        o.id !== row.id,
    )
    if (rs.length > 0) {
      e.row.inventoryMedicationFK = undefined
      notification.warn({
        message: 'The medication already exist in the list',
      })
      e.onValueChange()
    } else {
      setFieldValue(
        'drugName',
        (drugName === ''
          ? option.displayValue
          : `${drugName}/${option.displayValue}`
        ).substring(0, 60),
      )
      const { inventorymedication = [] } = codetable
      showCautions(
        inventorymedication,
        values.isDrugMixture,
        [...values.corPrescriptionItemDrugMixture.filter(o => o.id !== e.row.id),
        { inventoryMedicationFK: option.id }],
        null,
        patient,
      )
    }

    let weightKG
    const activeVitalSign = corVitalSign.find(vs => !vs.isDeleted)
    if (activeVitalSign) {
      weightKG = activeVitalSign.weightKG
    }
    else {
      weightKG = visitRegistration.entity.visit.weightKG
    }

    const { dob } = patient.entity
    const { medicationInstructionRule = [] } = option
    let age
    if (dob) {
      age = Math.floor(moment.duration(moment().diff(dob)).asYears())
    }
    const matchInstruction = medicationInstructionRule.find(i => isMatchInstructionRule(i, age, weightKG))

    row.quantity = matchInstruction?.dispensingQuantity || 0
    row.uomfk = option.dispensingUOM.id
    row.uomCode = option.dispensingUOM.code
    row.uomDisplayValue = option.dispensingUOM.name
    row.costPrice = option.averageCostPrice || 0
    row.unitPrice = option.sellingPrice || 0
    row.totalPrice = row.unitPrice * row.quantity
    row.drugCode = option.code
    row.drugName = option.displayValue
    row.revenueCategoryFK = option.revenueCategory.id
    row.isDispensedByPharmacy = option.isDispensedByPharmacy
    row.isNurseActualizeRequired = option.isNurseActualizable
  }

  handleDrugMixtureItemQuantityOnChange = e => {
    const { row } = e
    row.totalPrice = row.unitPrice * row.quantity
  }

  checkIsDrugMixtureItemUnique = ({ rows, changed }) => {
    if (!changed) return rows
    const key = Object.keys(changed)[0]
    const obj = changed[key]
    if (obj.inventoryMedicationFK !== undefined) {
      const hasDuplicate = rows.filter(
        i =>
          !i.isDeleted && i.inventoryMedicationFK === obj.inventoryMedicationFK,
      )
      if (hasDuplicate.length >= 2) {
        return rows.map(row =>
          row.id === parseInt(key, 10)
            ? { ...row, inventoryMedicationFK: undefined }
            : row,
        )
      }
    }
    return rows
  }

  commitDrugMixtureItemChanges = ({ rows, deleted, added, changed }) => {
    const { setFieldValue, values, codetable } = this.props
    let tempDrugMixtureRows = []

    if (deleted) {
      const tempArray = [...values.corPrescriptionItemDrugMixture]

      const newArray = tempArray.map(o => {
        if (o.id === deleted[0]) {
          return {
            ...o,
            isDeleted: true,
          }
        }
        return {
          ...o,
        }
      })

      tempDrugMixtureRows = newArray
      setFieldValue('corPrescriptionItemDrugMixture', newArray)
    } else {
      let _rows = this.checkIsDrugMixtureItemUnique({ rows, changed })
      if (added) {
        _rows = [...values.corPrescriptionItemDrugMixture, rows[0]]
      }

      tempDrugMixtureRows = _rows
      setFieldValue('corPrescriptionItemDrugMixture', _rows)
    }

    let totalQuantity = 0
    let totalPrice = 0
    const activeDrugMixtureRows = tempDrugMixtureRows.filter(
      item => !item.isDeleted,
    )

    activeDrugMixtureRows.forEach(item => {
      totalQuantity += item.quantity || 0
      totalPrice += item.totalPrice || 0
    })

    // If add first medication, set the mixed drug's details (instruction, precaution, uom, batchNo and etc.)
    if (
      !deleted &&
      activeDrugMixtureRows.length === 1 &&
      activeDrugMixtureRows[0].inventoryMedicationFK
    ) {
      const { inventorymedication = [] } = codetable
      const currentMedication = inventorymedication.find(
        o => o.id === activeDrugMixtureRows[0].inventoryMedicationFK,
      )
      if (currentMedication) {
        this.changeMedication(
          activeDrugMixtureRows[0].inventoryMedicationFK,
          currentMedication,
        )
      }
    }

    if (activeDrugMixtureRows.find(r => r.isDispensedByPharmacy)) {
      setFieldValue('isDispensedByPharmacy', true)
    }
    else {
      setFieldValue('isDispensedByPharmacy', false)
    }

    if (activeDrugMixtureRows.find(r => r.isNurseActualizeRequired)) {
      setFieldValue('isNurseActualizeRequired', true)
    }
    else {
      setFieldValue('isNurseActualizeRequired', false)
    }

    setFieldValue('quantity', totalQuantity)
    this.updateTotalPrice(totalPrice)
  }

  onAdjustmentConditionChange = v => {
    const { values } = this.props
    const { isMinus, adjValue, isExactAmount } = values
    if (!isNumber(adjValue)) return

    let value = adjValue
    if (!isExactAmount && adjValue > 100) {
      value = 100
      this.props.setFieldValue('adjValue', 100)
    }

    if (!isMinus) {
      value = Math.abs(value)
    } else {
      value = -Math.abs(value)
    }
    v = value

    this.getFinalAmount({ value })
  }

  getFinalAmount = ({ value } = {}) => {
    const { values, setFieldValue } = this.props
    const { isExactAmount, adjValue, totalPrice = 0 } = values
    const finalAmount = calculateAdjustAmount(
      isExactAmount,
      totalPrice,
      value || adjValue,
    )

    setFieldValue('totalAfterItemAdjustment', finalAmount.amount)
    setFieldValue('adjAmount', finalAmount.adjAmount)
    setFieldValue('adjType', isExactAmount ? 'ExactAmount' : 'Percentage')
  }

  drugMixtureTableParas = () => {
    return {
      columns: [
        { name: 'inventoryMedicationFK', title: 'Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'uomfk', title: 'UOM' },
        { name: 'totalPrice', title: 'Total' },
      ],
      columnExtensions: [
        {
          columnName: 'inventoryMedicationFK',
          type: 'codeSelect',
          labelField: 'combinDisplayValue',
          options: this.getMedicationOptions,
          handleFilter: (input, option) => {
            return this.filterMedicationOptions(input, option)
          },
          dropdownMatchSelectWidth: false,
          dropdownStyle: {
            width: 600,
          },
          renderDropdown: (option) => {
            return this.renderMedication(option)
          },
          sortingEnabled: false,
          onChange: e => {
            const { values, setFieldValue } = this.props
            const { row = {} } = e
            if (e.option) {
              this.handleDrugMixtureItemOnChange(e)
              const {
                codetable: { inventorymedication = [] },
              } = this.props
            }
          },
        },
        {
          columnName: 'quantity',
          width: 100,
          type: 'number',
          format: '0.0',
          sortingEnabled: false,
          onChange: e => {
            this.handleDrugMixtureItemQuantityOnChange(e)
          },
          isDisabled: row => row.inventoryMedicationFK === undefined,
        },
        {
          columnName: 'uomfk',
          width: 100,
          type: 'codeSelect',
          code: 'ctMedicationUnitOfMeasurement',
          labelField: 'name',
          sortingEnabled: false,
          disabled: true,
        },
        {
          columnName: 'totalPrice',
          width: 100,
          type: 'number',
          currency: true,
          sortingEnabled: false,
          isDisabled: row => row.inventoryMedicationFK === undefined,
        },
      ],
    }
  }

  filterMedicationOptions = (input = '', option) => {
    let match = false
    try {
      const lowerCaseInput = input.toLowerCase()

      const { props } = option
      const { combinDisplayValue = '', medicationGroup = {} } = props.data
      match = combinDisplayValue.toLowerCase().indexOf(lowerCaseInput) >= 0
        || (medicationGroup.name || '').toLowerCase().indexOf(lowerCaseInput) >= 0
    } catch (error) {
      match = false
    }
    return match
  }

  renderMedication = (option) => {
    const { combinDisplayValue = '', medicationGroup = {}, stock = 0, dispensingUOM = {}, isExclusive } = option
    const { name: uomName = '' } = dispensingUOM
    return <div style={{ height: 22 }} >
      <div style={{ width: 320, display: 'inline-block', }}>
        <div style={{
          maxWidth: isExclusive ? 280 : 320, display: 'inline-block',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          height: '100%',
        }} title={combinDisplayValue}>{combinDisplayValue}</div>

        {isExclusive &&
          <div style={{
            display: 'inline-block', height: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}>
            <div style={{
              backgroundColor: 'green', color: 'white',
              height: 22, borderRadius: 4,
              padding: '1px 5px',
              fontWeight: 500,
            }}>Excl.</div>
          </div>
        }
      </div>
      <div style={{
        width: 120, display: 'inline-block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginLeft: 6,
        height: '100%',
        color: stock < 0 ? 'red' : 'black'
      }} title={medicationGroup.name || ''} > {stock} {uomName}</div>
      <div style={{
        width: 120, display: 'inline-block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginLeft: 6,
        height: '100%',
      }} title={medicationGroup.name || ''} > {medicationGroup.name || ''}</div>
    </div >
  }

  render () {
    const {
      theme,
      classes,
      values,
      openPrescription,
      footer,
      setFieldValue,
      setDisable,
      from,
      orders = {}
    } = this.props

    const { corVitalSign = [] } = orders
    const { isEditMedication, drugName, remarks, drugLabelRemarks } = values
    const { showAddFromPastModal, showAddFromPrescriptionSetModal } = this.state

    const commonSelectProps = {
      handleFilter: this.filterOptions,
      dropdownMatchSelectWidth: false,
      dropdownStyle: {
        width: 300,
      },
    }

    const totalPriceReadonly =
      Authorized.check('queue.consultation.modifyorderitemtotalprice')
        .rights !== 'enable'
    const accessRight = authorityCfg[values.type]

    const generalAccessRight = Authorized.check('queue.consultation.order.medication.generalprescriptionset') || { rights: 'hidden' }
    const personalAccessRight = Authorized.check('queue.consultation.order.medication.personalprescriptionset') || { rights: 'hidden' }
    const showPrescriptionSet = generalAccessRight.rights !== 'hidden' || personalAccessRight.rights !== 'hidden'
    return (
      <Authorized authority={GetOrderItemAccessRight(from, accessRight)}>
        <div>
          <GridContainer>
            {!openPrescription && !values.isDrugMixture && (
              <GridItem xs={6}>
                <Field
                  name='inventoryMedicationFK'
                  render={args => {
                    return (
                      <div
                        id={`autofocus_${values.type}`}
                        style={{ position: 'relative' }}
                      >
                        <CodeSelect
                          temp
                          label='Medication Name, Drug Group'
                          labelField='combinDisplayValue'
                          onChange={this.changeMedication}
                          options={this.getMedicationOptions()}
                          handleFilter={this.filterMedicationOptions}
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{
                            width: 600,
                          }}
                          renderDropdown={this.renderMedication}
                          {...args}
                          style={{ paddingRight: 20 }}
                          disabled={values.isPackage}
                        />
                        <LowStockInfo sourceType='medication' {...this.props} corVitalSign={corVitalSign} />
                      </div>
                    )
                  }}
                />
              </GridItem>
            )}
            {openPrescription && (
              <GridItem xs={6}>
                <FastField
                  name='drugName'
                  render={args => {
                    return (
                      <div id={`autofocus_${values.type}`}>
                        <TextField
                          label='Open Prescription Name'
                          {...args}
                          autocomplete='nope'
                        />
                      </div>
                    )
                  }}
                />
              </GridItem>
            )}
            {values.isDrugMixture && (
              <GridItem xs={6} style={{ paddingRight: 115 }}>
                <div style={{ position: 'relative' }}>
                  <FastField
                    name='drugName'
                    render={args => {
                      return (
                        <div id={`autofocus_${values.type}`}>
                          <TextField
                            label='Drug Mixture'
                            {...args}
                            autocomplete='nope'
                            maxLength={60}
                          />
                        </div>
                      )
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: -115,
                      top: 24,
                      marginLeft: 'auto',
                    }}
                  >
                    <span
                      style={{
                        color: 'red',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {`Characters left: ${60 -
                        (drugName ? drugName.length : 0)}`}
                    </span>
                  </div>
                </div>
              </GridItem>
            )}
            <GridItem xs={6} style={{ marginTop: theme.spacing(2) }}>
              <div style={{ position: "relative" }}>
                <div>
                  {!openPrescription && (
                    <Field
                      name='isDrugMixture'
                      render={args => {
                        return (
                          <Checkbox
                            label='Drug Mixture'
                            disabled={isEditMedication}
                            {...args}
                            onChange={e => {
                              const { setValues, orders } = this.props
                              setValues({
                                ...orders.defaultMedication,
                                isDrugMixture: e.target.value,
                                type: orders.type,
                                visitPurposeFK: orders.visitPurposeFK,
                                selectedMedication: {
                                  medicationStock: [],
                                },
                                performingUserFK: getVisitDoctorUserId(this.props),
                              })

                              if (e.target.value) {
                                this.props.setFieldValue('drugCode', 'DrugMixture')
                                this.props.setFieldValue('isClaimable', false)
                              } else {
                                this.props.setFieldValue('drugCode', undefined)
                                this.props.setFieldValue('drugName', undefined)
                                this.props.setFieldValue('isClaimable', undefined)
                              }

                              setDisable(false)

                              this.props.dispatch({
                                type: 'global/updateState',
                                payload: {
                                  disableSave: false,
                                },
                              })
                            }}
                          />
                        )
                      }}
                    />
                  )}
                </div>
                {!openPrescription && !isEditMedication && (
                  <div
                    style={{ position: 'absolute', left: 110, top: 0 }}>
                    <Tooltip title={`Add Medication From patient's History`}>
                      <ProgressButton
                        color='primary'
                        icon={<Add />}
                        onClick={this.onSearchMedicationHistory}
                      >
                        History
                      </ProgressButton>
                    </Tooltip>
                    {showPrescriptionSet && < Tooltip title='Add Medication From Prescription Set'>
                      <ProgressButton
                        color='primary'
                        icon={<Add />}
                        onClick={this.onSearchPrescriptionSet}
                      >
                        Prescription Set
                      </ProgressButton>
                    </Tooltip>
                    }
                  </div>
                )}
              </div>
            </GridItem>
          </GridContainer>
          {values.isDrugMixture && (
            <GridContainer>
              <GridItem xs={12}>
                <EditableTableGrid
                  forceRender
                  style={{
                    margin: theme.spacing(1),
                  }}
                  getRowId={r => r.id}
                  rows={values.corPrescriptionItemDrugMixture}
                  FuncProps={{
                    pager: false,
                  }}
                  EditingProps={{
                    showAddCommand: true,
                    onCommitChanges: this.commitDrugMixtureItemChanges,
                  }}
                  schema={drugMixtureItemSchema}
                  {...this.drugMixtureTableParas()}
                />
              </GridItem>
            </GridContainer>
          )}
          <GridContainer gutter={0}>
            <GridItem xs={12}>
              <div>
                <div
                  style={{
                    position: 'relative',
                    paddingLeft: 90,
                    marginLeft: 10,
                    marginTop: 4,
                    fontSize: '0.85rem',
                    height: 26,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      paddingTop: 3,
                      paddingBottom: 3,
                      lineHeight: '25px',
                    }}
                  >
                    Instructions
                  </div>
                </div>
                <FieldArray
                  name='corPrescriptionItemInstruction'
                  render={arrayHelpers => {
                    this.descriptionArrayHelpers = arrayHelpers
                    if (!values || !values.corPrescriptionItemInstruction)
                      return null
                    const activeRows = values.corPrescriptionItemInstruction.filter(
                      val => !val.isDeleted,
                    )
                    return activeRows.map((val, activeIndex) => {
                      if (val && val.isDeleted) return null
                      const i = values.corPrescriptionItemInstruction.findIndex(
                        item =>
                          val.id
                            ? item.id === val.id
                            : val.uid === item.uid,
                      )

                      return (
                        <div key={i}>
                          <GridContainer>
                            {activeIndex > 0 && (
                              <GridItem xs={3}>
                                <FastField
                                  name={`corPrescriptionItemInstruction[${i}].stepdose`}
                                  render={args => {
                                    return (
                                      <Select
                                        style={{
                                          paddingLeft: 15,
                                          marginBottom: theme.spacing(1),
                                        }}
                                        allowClear={false}
                                        simple
                                        options={[
                                          { value: 'AND', name: 'And' },
                                          { value: 'THEN', name: 'Then' },
                                        ]}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                            )}
                            {activeIndex > 0 && <GridItem xs={9} />}
                            <GridItem xs={3}>
                              <Field
                                name={`corPrescriptionItemInstruction[${i}].usageMethodFK`}
                                render={args => {
                                  return (
                                    <div style={{ position: 'relative' }}>
                                      <span
                                        style={{
                                          position: 'absolute',
                                          bottom: 4,
                                        }}
                                      >
                                        {activeIndex + 1}.
                                      </span>
                                      <CodeSelect
                                        label={formatMessage({
                                          id: 'inventory.master.setting.usage',
                                        })}
                                        allowClear={false}
                                        style={{
                                          marginLeft: 15,
                                          paddingRight: 15,
                                        }}
                                        code='ctMedicationUsage'
                                        onChange={(v, op = {}) => {
                                          setFieldValue(
                                            `corPrescriptionItemInstruction[${i}].usageMethodCode`,
                                            op ? op.code : undefined,
                                          )
                                          setFieldValue(
                                            `corPrescriptionItemInstruction[${i}].usageMethodDisplayValue`,
                                            op ? op.name : undefined,
                                          )
                                        }}
                                        {...commonSelectProps}
                                        {...args}
                                      />
                                    </div>
                                  )
                                }}
                              />
                            </GridItem>
                            <GridItem xs={2}>
                              <FastField
                                name={`corPrescriptionItemInstruction[${i}].dosageFK`}
                                render={args => {
                                  return (
                                    <CodeSelect
                                      label={formatMessage({
                                        id: 'inventory.master.setting.dosage',
                                      })}
                                      allowClear={false}
                                      code='ctMedicationDosage'
                                      labelField='displayValue'
                                      {...commonSelectProps}
                                      {...args}
                                      onChange={(v, op = {}) => {
                                        setFieldValue(
                                          `corPrescriptionItemInstruction[${i}].dosageCode`,
                                          op ? op.code : undefined,
                                        )
                                        setFieldValue(
                                          `corPrescriptionItemInstruction[${i}].dosageDisplayValue`,
                                          op ? op.displayValue : undefined,
                                        )
                                        setTimeout(() => {
                                          this.calculateQuantity()
                                        }, 1)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </GridItem>
                            <GridItem xs={2}>
                              <Field
                                name={`corPrescriptionItemInstruction[${i}].prescribeUOMFK`}
                                render={args => {
                                  return (
                                    <CodeSelect
                                      label={formatMessage({
                                        id:
                                          'inventory.master.setting.prescribeUOM',
                                      })}
                                      allowClear={false}
                                      code='ctMedicationUnitOfMeasurement'
                                      onChange={(v, op = {}) => {
                                        setFieldValue(
                                          `corPrescriptionItemInstruction[${i}].prescribeUOMCode`,
                                          op ? op.code : undefined,
                                        )
                                        setFieldValue(
                                          `corPrescriptionItemInstruction[${i}].prescribeUOMDisplayValue`,
                                          op ? op.name : undefined,
                                        )
                                      }}
                                      disabled={!openPrescription && !values.isDrugMixture}
                                      {...commonSelectProps}
                                      {...args}
                                    />
                                  )
                                }}
                              />
                            </GridItem>
                            <GridItem xs={2}>
                              <FastField
                                name={`corPrescriptionItemInstruction[${i}].drugFrequencyFK`}
                                render={args => {
                                  return (
                                    <CodeSelect
                                      label={formatMessage({
                                        id:
                                          'inventory.master.setting.frequency',
                                      })}
                                      labelField='displayValue'
                                      allowClear={false}
                                      code='ctMedicationFrequency'
                                      {...commonSelectProps}
                                      {...args}
                                      onChange={(v, op = {}) => {
                                        setFieldValue(
                                          `corPrescriptionItemInstruction[${i}].drugFrequencyCode`,
                                          op ? op.code : undefined,
                                        )
                                        setFieldValue(
                                          `corPrescriptionItemInstruction[${i}].drugFrequencyDisplayValue`,
                                          op ? op.displayValue : undefined,
                                        )
                                        setTimeout(() => {
                                          this.calculateQuantity()
                                        }, 1)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </GridItem>
                            <GridItem xs={3} >
                              <div style={{ position: 'relative' }}>
                                <FastField
                                  name={`corPrescriptionItemInstruction[${i}].duration`}
                                  render={args => {
                                    return (
                                      <NumberInput
                                        style={{ paddingRight: 80 }}
                                        precision={0}
                                        label={formatMessage({
                                          id: 'inventory.master.setting.duration',
                                        })}
                                        formatter={v =>
                                          `${v} Day${v > 1 ? 's' : ''}`
                                        }
                                        step={1}
                                        min={0}
                                        {...args}
                                        onChange={() => {
                                          setTimeout(() => {
                                            this.calculateQuantity()
                                          }, 1)
                                        }}
                                      />
                                    )
                                  }}
                                />
                                {this.getActionItem(
                                  i,
                                  arrayHelpers,
                                  'corPrescriptionItemInstruction',
                                  'Add step dose',
                                  {
                                    stepdose: 'AND',
                                    sequence: activeRows.length + 1,
                                    uid: getUniqueId()
                                  },
                                )}
                              </div>
                            </GridItem>
                          </GridContainer>
                        </div>
                      )
                    })
                  }}
                />
              </div>
            </GridItem>
          </GridContainer>

          <GridContainer gutter={0}>
            <GridItem xs={12}>
              <div>
                <div
                  style={{
                    marginLeft: 10,
                    marginTop: 8,
                    paddingTop: 3,
                    paddingBottom: 3,
                    fontSize: '0.85rem',
                    height: 26,
                  }}
                >
                  Precaution
                </div>
                <FieldArray
                  name='corPrescriptionItemPrecaution'
                  render={arrayHelpers => {
                    if (!values || !values.corPrescriptionItemPrecaution)
                      return null
                    const activeRows = values.corPrescriptionItemPrecaution.filter(
                      val => !val.isDeleted,
                    )

                    const maxSeq = _.maxBy(
                      values.corPrescriptionItemPrecaution,
                      'sequence',
                    )

                    let newMaxSeq = maxSeq
                      ? maxSeq.sequence + 1
                      : values.corPrescriptionItemPrecaution.length + 1

                    return activeRows.map((val, activeIndex) => {
                      if (val && val.isDeleted) return null
                      const i = values.corPrescriptionItemPrecaution.findIndex(
                        cor =>
                          val.id
                            ? cor.id === val.id
                            : val.uid === cor.uid,
                      )

                      return (
                        <div key={i}>
                          <GridContainer>
                            <GridItem xs={12}>
                              <Field
                                name={`corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`}
                                render={args => {
                                  return (
                                    <div
                                      style={{
                                        position: 'relative',
                                      }}
                                    >
                                      <span
                                        style={{
                                          position: 'absolute',
                                          bottom: 4,
                                        }}
                                      >
                                        {activeIndex + 1}.
                                      </span>
                                      <CodeSelect
                                        style={{
                                          paddingLeft: 15,
                                          paddingRight: 80,
                                        }}
                                        code='ctmedicationprecaution'
                                        labelField='displayValue'
                                        onChange={(v, option = {}) => {
                                          setFieldValue(
                                            `corPrescriptionItemPrecaution[${i}].precaution`,
                                            option.displayValue,
                                          )
                                          setFieldValue(
                                            `corPrescriptionItemPrecaution[${i}].precautionCode`,
                                            option.code,
                                          )
                                        }}
                                        {...args}
                                      />
                                      {this.getActionItem(
                                        i,
                                        arrayHelpers,
                                        'corPrescriptionItemPrecaution',
                                        'Add precaution',
                                        {
                                          action: '1',
                                          count: 1,
                                          unit: '1',
                                          drugFrequencyFK: '1',
                                          day: 1,
                                          precaution: '1',
                                          sequence: newMaxSeq,
                                          uid: getUniqueId()
                                        },
                                      )}
                                    </div>
                                  )
                                }}
                              />
                            </GridItem>
                          </GridContainer>
                        </div>
                      )
                    })
                  }}
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor} style={{ paddingRight: 35 }}>
              <div style={{ position: 'relative' }}>
                <FastField
                  name='remarks'
                  render={args => {
                    return <TextField rowsMax='5' label='Remarks' {...args} />
                  }}
                /><CannedTextButton
                  cannedTextTypeFK={CANNED_TEXT_TYPE.MEDICATIONREMARKS}
                  style={{
                    position: 'absolute', bottom: 0,
                    right: -35,
                  }}
                  handleSelectCannedText={(cannedText) => {
                    const newRemaks = `${remarks ? (remarks + ' ') : ''}${cannedText.text || ''}`.substring(0, 2000)
                    setFieldValue('remarks', newRemaks)
                  }}
                />
              </div>
            </GridItem>
            {values.isPackage && (
              <React.Fragment>
                <GridItem xs={1} className={classes.editor}>
                  <Field
                    name='packageConsumeQuantity'
                    render={args => {
                      return (
                        <NumberInput
                          label='Consumed Quantity'
                          step={1}
                          min={0}
                          max={values.remainingQuantity}
                          disabled={
                            this.props.visitRegistration.entity.visit
                              .isInvoiceFinalized
                          }
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={1} className={classes.editor}>
                  <Field
                    name='remainingQuantity'
                    render={args => {
                      return (
                        <NumberInput
                          style={{
                            marginTop: theme.spacing(3),
                          }}
                          formatter={v => `/ ${parseFloat(v).toFixed(1)}`}
                          text
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              </React.Fragment>
            )}
            {!values.isPackage && (
              <GridItem xs={2} className={classes.editor}>
                <Field
                  name='quantity'
                  render={args => {
                    return (
                      <NumberInput
                        label='Quantity'
                        step={1}
                        min={0}
                        onChange={() => {
                          setTimeout(() => {
                            this.setTotalPrice()
                          }, 1)
                        }}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            )}
            <GridItem xs={2} className={classes.editor}>
              <Field
                name='dispenseUOMFK'
                render={args => {
                  return (
                    <CodeSelect
                      disabled={!openPrescription && !values.isDrugMixture}
                      label='Dispense UOM'
                      allowClear={false}
                      code='ctMedicationUnitOfMeasurement'
                      onChange={(v, op = {}) => {
                        setFieldValue(
                          'dispenseUOMCode',
                          op ? op.code : undefined,
                        )
                        setFieldValue(
                          'dispenseUOMDisplayValue',
                          op ? op.name : undefined,
                        )
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor} style={{ paddingRight: 115 }}>
              <div style={{ position: 'relative' }}>
                <FastField
                  name='drugLabelRemarks'
                  render={args => {
                    return <TextField maxLength={60} label='Drug Label Remarks' {...args} />
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: -115,
                    top: 24,
                    marginLeft: 'auto',
                  }}
                >
                  <span
                    style={{
                      color: 'red',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    {`Characters left: ${60 -
                      (drugLabelRemarks ? drugLabelRemarks.length : 0)}`}
                  </span>
                </div>
              </div>
            </GridItem>
            <GridItem xs={4} className={classes.editor}>
              <Field
                name='totalPrice'
                render={args => {
                  return (
                    <NumberInput
                      label='Total'
                      onChange={e => {
                        this.updateTotalPrice(e.target.value)
                      }}
                      min={0}
                      disabled={
                        values.isExternalPrescription ||
                        (totalPriceReadonly && !openPrescription) ||
                        values.isPackage
                      }
                      currency
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor}>
              {values.visitPurposeFK !== VISIT_TYPE.RETAIL &&
                !values.isDrugMixture &&
                !values.isPackage ? (
                  <div style={{ position: 'absolute', bottom: 2 }}>
                    <div style={{ display: 'inline-block' }}>
                      <FastField
                        name='isExternalPrescription'
                        render={args => {
                          if (args.field.value) {
                            setDisable(true)
                          } else {
                            setDisable(false)
                          }
                          return (
                            <Checkbox
                              label='External Prescription'
                              {...args}
                              onChange={e => {
                                if (e.target.value) {
                                  this.props.setFieldValue('adjAmount', 0)
                                  this.props.setFieldValue(
                                    'totalAfterItemAdjustment',
                                    0,
                                  )
                                  this.props.setFieldValue('totalPrice', 0)
                                  this.props.setFieldValue('isMinus', true)
                                  this.props.setFieldValue('isExactAmount', true)
                                  this.props.setFieldValue('adjValue', 0)
                                } else {
                                  setTimeout(() => {
                                    this.calculateQuantity()
                                  }, 1)
                                }
                                setDisable(e.target.value)
                              }}
                            />
                          )
                        }}
                      />
                    </div>
                    {values.type === '1' && <div style={{ display: 'inline-block' }}>
                      <FastField
                        name='isPreOrder'
                        render={args => {
                          return (
                            <Checkbox
                              label='Pre-Order'
                              {...args}
                              onChange={e => {
                                if (!e.target.value) {
                                  setFieldValue('isChargeToday', false)
                                }
                              }}
                            />
                          )
                        }}
                      />
                    </div>
                    }
                    {values.isPreOrder && <div style={{ display: 'inline-block' }}>
                      <FastField
                        name='isChargeToday'
                        render={args => {
                          return (
                            <Checkbox
                              label='Charge Today'
                              {...args}
                            />
                          )
                        }}
                      />
                    </div>
                    }
                  </div>
              ) : (
                ''
              )}
              {values.isDrugMixture && (
                <FastField
                  name='isClaimable'
                  render={args => {
                    return <Checkbox style={{ position: 'absolute', bottom: 2 }} label='Claimable' {...args} />
                  }}
                />
              )}
              {values.isPackage && (
                <Field
                  name='performingUserFK'
                  render={args => (
                    <DoctorProfileSelect
                      label='Performed By'
                      {...args}
                      valueField='clinicianProfile.userProfileFK'
                    />
                  )}
                />
              )}
            </GridItem>
            <GridItem xs={3} className={classes.editor}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{ marginTop: theme.spacing(2), position: 'absolute' }}
                >
                  <Field
                    name='isMinus'
                    render={args => {
                      return (
                        <Switch
                          checkedChildren='-'
                          unCheckedChildren='+'
                          label=''
                          disabled={
                            values.isExternalPrescription ||
                            (totalPriceReadonly && !openPrescription) ||
                            values.isPackage
                          }
                          onChange={() => {
                            setTimeout(() => {
                              this.onAdjustmentConditionChange()
                            }, 1)
                          }}
                          {...args}
                        />
                      )
                    }}
                  />
                </div>
                <Field
                  name='adjValue'
                  render={args => {
                    args.min = 0
                    if (values.isExactAmount) {
                      return (
                        <NumberInput
                          style={{
                            marginLeft: theme.spacing(7),
                            paddingRight: theme.spacing(6),
                          }}
                          currency
                          label='Adjustment'
                          disabled={
                            values.isExternalPrescription ||
                            (totalPriceReadonly && !openPrescription) ||
                            values.isPackage
                          }
                          onChange={() => {
                            setTimeout(() => {
                              this.onAdjustmentConditionChange()
                            }, 1)
                          }}
                          {...args}
                        />
                      )
                    }
                    return (
                      <NumberInput
                        style={{
                          marginLeft: theme.spacing(7),
                          paddingRight: theme.spacing(6),
                        }}
                        percentage
                        max={100}
                        label='Adjustment'
                        disabled={
                          values.isExternalPrescription ||
                          (totalPriceReadonly && !openPrescription) ||
                          values.isPackage
                        }
                        onChange={() => {
                          setTimeout(() => {
                            this.onAdjustmentConditionChange()
                          }, 1)
                        }}
                        {...args}
                      />
                    )
                  }}
                />
              </div>
            </GridItem>
            <GridItem xs={1} className={classes.editor}>
              <div style={{ marginTop: theme.spacing(2) }}>
                <Field
                  name='isExactAmount'
                  render={args => {
                    return (
                      <Switch
                        checkedChildren='$'
                        unCheckedChildren='%'
                        label=''
                        disabled={
                          values.isExternalPrescription ||
                          (totalPriceReadonly && !openPrescription) ||
                          values.isPackage
                        }
                        onChange={() => {
                          setTimeout(() => {
                            this.onAdjustmentConditionChange()
                          }, 1)
                        }}
                        {...args}
                      />
                    )
                  }}
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor} />
            <GridItem xs={4}>
              <Field
                name='totalAfterItemAdjustment'
                render={args => {
                  return (
                    <NumberInput
                      label='Total After Adj'
                      disabled
                      currency
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          {footer({
            onSave: this.validateAndSubmitIfOk,
            onReset: this.handleReset,
          })}
          <CommonModal
            open={showAddFromPastModal}
            title="Add Medication From Patient's History"
            onClose={this.toggleAddFromPastModal}
            onConfirm={this.toggleAddFromPastModal}
            maxWidth='md'
            showFooter={false}
            overrideLoading
            cancelText='Cancel'
          >
            <AddFromPast
              isRetail={values.visitPurposeFK === VISIT_TYPE.RETAIL}
              {...this.props}
            />
          </CommonModal>

          <CommonModal
            open={showAddFromPrescriptionSetModal}
            title='Add Medication From Prescription Set'
            onClose={this.toggleAddFromPrescriptionSetModal}
            onConfirm={this.toggleAddFromPrescriptionSetModal}
            maxWidth='md'
            showFooter={false}
            overrideLoading
            cancelText='Cancel'
          >
            <PrescriptionSet isRetail={values.visitPurposeFK === VISIT_TYPE.RETAIL} {...this.props} />
          </CommonModal>
        </div>
      </Authorized>
    )
  }
}
export default Medication
