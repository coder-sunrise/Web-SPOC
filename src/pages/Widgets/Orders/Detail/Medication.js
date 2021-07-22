import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import { formatMessage } from 'umi'
import { isNumber } from 'util'
import { Alert } from 'antd'
import { VISIT_TYPE } from '@/utils/constants'
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
import { calculateAdjustAmount } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import Authorized from '@/utils/Authorized'
import { GetOrderItemAccessRight } from '@/pages/Widgets/Orders/utils'
import { DoctorProfileSelect } from '@/components/_medisys'
import moment from 'moment'
import LowStockInfo from './LowStockInfo'
import AddFromPast from './AddMedicationFromPast'

const authorityCfg = {
  '1': 'queue.consultation.order.medication',
  '5': 'queue.consultation.order.openprescription',
}

const drugMixtureItemSchema = Yup.object().shape({
  inventoryMedicationFK: Yup.string().required(),
  quantity: Yup.number().min(0),
  totalPrice: Yup.number().min(0),
})

const getCautions = (
  inventorymedication = [],
  openPrescription,
  isDrugMixture,
  corPrescriptionItemDrugMixture = [],
  inventoryMedicationFK,
) => {
  let Cautions = []
  if (isDrugMixture) {
    corPrescriptionItemDrugMixture
      .filter(o => !o.isDeleted)
      .forEach(item => {
        const selectMedication = inventorymedication.find(
          medication => medication.id === item.inventoryMedicationFK,
        )
        if (
          selectMedication &&
          selectMedication.caution &&
          selectMedication.caution.trim().length
        ) {
          Cautions.push({
            id: item.id,
            name: selectMedication.displayValue || '',
            message: selectMedication.caution,
          })
        }
      })
  } else if (!openPrescription) {
    const selectMedication = inventorymedication.find(
      medication => medication.id === inventoryMedicationFK,
    )
    if (
      selectMedication &&
      selectMedication.caution &&
      selectMedication.caution.trim().length
    ) {
      Cautions.push({ message: selectMedication.caution })
    }
  }
  return Cautions
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

@connect(({ global, codetable, visitRegistration, user }) => ({
  global,
  codetable,
  visitRegistration,
  user,
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

    let cautions = getCautions(
      inventorymedication,
      type === '5',
      isDrugMixture,
      newCorPrescriptionItemDrugMixture,
      v.inventoryMedicationFK,
    )

    const medication = inventorymedication.find(
      item => item.id === v.inventoryMedicationFK,
    )
    return {
      ...v,
      corPrescriptionItemPrecaution:
        newCorPrescriptionItemPrecaution.length > 0
          ? newCorPrescriptionItemPrecaution
          : [{}],
      corPrescriptionItemDrugMixture:
        newCorPrescriptionItemDrugMixture.length > 0
          ? newCorPrescriptionItemDrugMixture
          : [],
      cautions,
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
    expiryDate: Yup.date().min(moment(), 'EXPIRED!'),
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

          instruction += `${
            item.usageMethodDisplayValue ? item.usageMethodDisplayValue : ''
          } ${item.dosageDisplayValue ? item.dosageDisplayValue : ''} ${
            item.prescribeUOMDisplayValue ? item.prescribeUOMDisplayValue : ''
          } ${
            item.drugFrequencyDisplayValue ? item.drugFrequencyDisplayValue : ''
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
    let { batchNo } = values
    if (batchNo instanceof Array) {
      if (batchNo && batchNo.length > 0) {
        batchNo = batchNo[0]
      }
    }

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
      batchNo,
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
    batchNo: '',
    expiryDate: '',
    showAddFromPastModal: false,
  }

  getActionItem = (i, arrayHelpers, prop, tooltip, defaultValue) => {
    const { theme, values, setFieldValue } = this.props
    const activeRows = values[prop].filter(item => !item.isDeleted) || []
    return (
      <GridItem
        xs={2}
        gutter={theme.spacing(1)}
        style={{
          textAlign: 'center',
        }}
      >
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
      </GridItem>
    )
  }

  calculateQuantity = medication => {
    const { codetable, setFieldValue, values } = this.props
    if (values.isDrugMixture || values.isPackage) return
    let currentMedication = medication || values.selectedMedication

    const { form } = this.descriptionArrayHelpers
    let newTotalQuantity = 0

    // when select medication, TotalQuantity = dispensingQuantity, else calculate quantity by Instructions
    if (
      medication &&
      currentMedication &&
      currentMedication.dispensingQuantity
    ) {
      newTotalQuantity = currentMedication.dispensingQuantity
    } else {
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
    }
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
    const { setFieldValue, values } = this.props

    let defaultBatch
    if (op.medicationStock) {
      defaultBatch = op.medicationStock.find(o => o.isDefault === true)
      if (defaultBatch)
        this.setState({
          batchNo: defaultBatch.batchNo,
          expiryDate: defaultBatch.expiryDate,
        })
    }
    setFieldValue('costPrice', op.averageCostPrice || 0)
    const {
      corPrescriptionItemInstruction = [],
      corPrescriptionItemPrecaution = [],
    } = values
    let defaultInstruction = {
      sequence: 0,
      stepdose: 'AND',
    }

    if (op.id) {
      defaultInstruction = {
        ...defaultInstruction,
        usageMethodFK: op.medicationUsage ? op.medicationUsage.id : undefined,
        usageMethodCode: op.medicationUsage
          ? op.medicationUsage.code
          : undefined,
        usageMethodDisplayValue: op.medicationUsage
          ? op.medicationUsage.name
          : undefined,
        dosageFK: op.prescribingDosage ? op.prescribingDosage.id : undefined,
        dosageCode: op.prescribingDosage
          ? op.prescribingDosage.code
          : undefined,
        dosageDisplayValue: op.prescribingDosage
          ? op.prescribingDosage.name
          : undefined,
        prescribeUOMFK: op.prescribingUOM ? op.prescribingUOM.id : undefined,
        prescribeUOMCode: op.prescribingUOM
          ? op.prescribingUOM.code
          : undefined,
        prescribeUOMDisplayValue: op.prescribingUOM
          ? op.prescribingUOM.name
          : undefined,
        drugFrequencyFK: op.medicationFrequency
          ? op.medicationFrequency.id
          : undefined,
        drugFrequencyCode: op.medicationFrequency
          ? op.medicationFrequency.code
          : undefined,
        drugFrequencyDisplayValue: op.medicationFrequency
          ? op.medicationFrequency.name
          : undefined,
        duration: op.duration,
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

    if (
      values.isExternalPrescription === undefined ||
      values.isExternalPrescription === false
    ) {
      setFieldValue('batchNo', defaultBatch ? defaultBatch.batchNo : undefined)
      setFieldValue(
        'expiryDate',
        defaultBatch ? defaultBatch.expiryDate : undefined,
      )
    }
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
          im.medicationPrecaution.name,
        )
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].precautionCode`,
          im.medicationPrecaution.code,
        )
        setFieldValue(`corPrescriptionItemPrecaution[${i}].sequence`, i)
      })
    } else {
      const defaultPrecaution = {
        precaution: '',
        sequence: 0,
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

      setTimeout(() => {
        this.calculateQuantity(op)
      }, 1)

      if (op) {
        const { codetable, openPrescription } = this.props
        const { inventorymedication = [] } = codetable
        let cautions = getCautions(
          inventorymedication,
          openPrescription,
          values.isDrugMixture,
          values.corPrescriptionItemDrugMixture,
          op.id,
        )
        setFieldValue('cautions', cautions)
      } else {
        setFieldValue('cautions', [])
      }
      this.onExpiryDateChange()
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  validateAndSubmitIfOk = async () => {
    const { handleSubmit, validateForm, values, codetable } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)
    console.log(validateResult)
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

  getMixtureItemBatchStock = row => {
    let batchNoOptions = []

    const { codetable } = this.props
    const { inventorymedication = [] } = codetable
    const currentItem = inventorymedication.find(
      o => o.id === row.inventoryMedicationFK,
    )
    if (currentItem) {
      batchNoOptions = currentItem.medicationStock
    }

    return batchNoOptions
  }

  handleDrugMixtureItemOnChange = e => {
    const { option, row } = e
    const { values, setFieldValue } = this.props
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
    }

    row.quantity = option.dispensingQuantity || 0
    row.uomfk = option.dispensingUOM.id
    row.uomCode = option.dispensingUOM.code
    row.uomDisplayValue = option.dispensingUOM.name
    row.costPrice = option.averageCostPrice || 0
    row.unitPrice = option.sellingPrice || 0
    row.totalPrice = row.unitPrice * row.quantity
    row.drugCode = option.code
    row.drugName = option.displayValue
    row.revenueCategoryFK = option.revenueCategory.id

    const defaultBatch = this.getMixtureItemBatchStock(row).find(
      batch => batch.isDefault,
    )
    if (defaultBatch) {
      row.batchNo = defaultBatch.batchNo
      row.batchNoId = defaultBatch.id
      row.expiryDate = defaultBatch.expiryDate
    }
    this.onExpiryDateChange()
  }

  handleDrugMixtureItemQuantityOnChange = e => {
    const { row } = e
    row.totalPrice = row.unitPrice * row.quantity
  }

  handleMixtureItemSelectedBatch = e => {
    const { option, row, val } = e

    if (option.length > 0) {
      const { expiryDate, id, batchNo } = option[0]
      row.batchNo = batchNo
      row.expiryDate = expiryDate
      row.batchNoId = id
    } else {
      row.batchNo = val[0]
      row.batchNoId = undefined
      row.expiryDate = undefined
    }
    this.onExpiryDateChange()
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
      const newCautions = [...values.cautions].filter(o => o.id !== deleted[0])
      setFieldValue('cautions', newCautions)
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
        { name: 'batchNo', title: 'Batch No.' },
        { name: 'expiryDate', title: 'Expiry Date' },
      ],
      columnExtensions: [
        {
          columnName: 'inventoryMedicationFK',
          type: 'codeSelect',
          labelField: 'combinDisplayValue',
          options: this.getMedicationOptions,
          sortingEnabled: false,
          onChange: e => {
            const { values, setFieldValue } = this.props
            const { row = {} } = e
            let newCautions = [...values.cautions]
            if (e.option) {
              this.handleDrugMixtureItemOnChange(e)

              const {
                codetable: { inventorymedication = [] },
              } = this.props
              const selectMedication = inventorymedication.find(
                medication => medication.id === e.row.inventoryMedicationFK,
              )
              if (
                selectMedication &&
                selectMedication.caution &&
                selectMedication.caution.trim().length
              ) {
                const existsCaution = newCautions.find(o => o.id === row.id)
                if (existsCaution) {
                  newCautions = newCautions.map(o => {
                    return {
                      ...o,
                      name: selectMedication.displayValue || '',
                      message:
                        o.id === row.id ? selectMedication.caution : o.message,
                    }
                  })
                } else {
                  newCautions = [
                    ...newCautions,
                    {
                      id: row.id,
                      name: selectMedication.displayValue || '',
                      message: selectMedication.caution,
                    },
                  ]
                }
              } else {
                newCautions = newCautions.filter(o => o.id !== row.id)
              }
            } else {
              newCautions = newCautions.filter(o => o.id !== row.id)
            }

            setFieldValue('cautions', newCautions)
          },
        },
        {
          columnName: 'quantity',
          width: 70,
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
          width: 70,
          type: 'codeSelect',
          code: 'ctMedicationUnitOfMeasurement',
          labelField: 'name',
          sortingEnabled: false,
          disabled: true,
        },
        {
          columnName: 'totalPrice',
          width: 95,
          type: 'number',
          currency: true,
          sortingEnabled: false,
          isDisabled: row => row.inventoryMedicationFK === undefined,
        },
        {
          columnName: 'batchNo',
          type: 'select',
          width: 115,
          sortingEnabled: false,
          mode: 'tags',
          maxSelected: 1,
          labelField: 'batchNo',
          valueField: 'batchNo',
          disableAll: true,
          options: this.getMixtureItemBatchStock,
          onChange: e => {
            this.handleMixtureItemSelectedBatch(e)
          },
          render: row => {
            return <TextField text value={row.batchNo} />
          },
          isDisabled: row => row.inventoryMedicationFK === undefined,
        },
        {
          columnName: 'expiryDate',
          type: 'date',
          width: 110,
          sortingEnabled: false,
          isDisabled: row => row.inventoryMedicationFK === undefined,
        },
      ],
    }
  }

  onExpiryDateChange = async () => {
    window.setTimeout(async () => {
      const { handleSubmit, validateForm } = this.props
      const validateResult = await validateForm()
      const isFormValid = _.isEmpty(validateResult)
      if (!isFormValid) {
        handleSubmit()
      }
    }, 300)
  }

  render() {
    const {
      theme,
      classes,
      values,
      openPrescription,
      footer,
      setFieldValue,
      setDisable,
      from,
    } = this.props

    const { isEditMedication, cautions = [], drugName } = values
    const { showAddFromPastModal } = this.state

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
                          label='Medication Name'
                          labelField='combinDisplayValue'
                          onChange={this.changeMedication}
                          options={this.getMedicationOptions()}
                          {...args}
                          style={{ paddingRight: 20 }}
                          disabled={values.isPackage}
                        />
                        <LowStockInfo sourceType='medication' {...this.props} />
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
            <GridItem xs={2} style={{ marginTop: theme.spacing(2) }}>
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
                          this.props.setFieldValue('cautions', [])

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
            </GridItem>
            <GridItem xs={4}>
              {!openPrescription && !isEditMedication && (
                <Tooltip title='Add From Past'>
                  <ProgressButton
                    color='primary'
                    icon={<Add />}
                    style={{
                      marginTop: theme.spacing(2),
                    }}
                    onClick={this.onSearchMedicationHistory}
                  >
                    Add From Past
                  </ProgressButton>
                </Tooltip>
              )}
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
                  {cautions.length > 0 && (
                    <Alert
                      message={
                        <Tooltip
                          useTooltip2
                          title={
                            <div>
                              <div style={{ fontWeight: 500 }}>Cautions:</div>
                              {cautions.map(o => {
                                if (values.isDrugMixture) {
                                  return (
                                    <div style={{ marginLeft: 10 }}>
                                      <span>
                                        <span
                                          style={{
                                            fontWeight: 500,
                                          }}
                                        >
                                          {`${o.name} - `}
                                        </span>
                                        <span>{o.message}</span>
                                      </span>
                                    </div>
                                  )
                                }
                                return (
                                  <div style={{ marginLeft: 10 }}>
                                    <span>{o.message}</span>
                                  </div>
                                )
                              })}
                            </div>
                          }
                        >
                          <span>
                            {[...cautions].reverse().map((o, index) => {
                              if (values.isDrugMixture) {
                                return (
                                  <span>
                                    <span
                                      style={{
                                        fontWeight: 500,
                                      }}
                                    >
                                      {`${o.name} - `}
                                    </span>
                                    <span>
                                      {`${o.message}${
                                        index < cautions.length - 1 ? '; ' : ''
                                      }`}
                                    </span>
                                  </span>
                                )
                              }
                              return <span>{o.message}</span>
                            })}
                          </span>
                        </Tooltip>
                      }
                      banner
                      style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        display: 'inline-block',
                        width: '100%',
                        overflow: 'hidden',
                        paddingTop: 3,
                        paddingBottom: 3,
                        lineHeight: '25px',
                        fontSize: '0.85rem',
                      }}
                    />
                  )}
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
                        item => _.isEqual(item, val),
                      )

                      return (
                        <div key={i}>
                          <GridContainer>
                            {activeIndex > 0 && (
                              <GridItem xs={2}>
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
                            {activeIndex > 0 && <GridItem xs={10} />}
                            <GridItem xs={2}>
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
                              <FastField
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
                            <GridItem xs={2}>
                              <FastField
                                name={`corPrescriptionItemInstruction[${i}].duration`}
                                render={args => {
                                  return (
                                    <NumberInput
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
                            </GridItem>
                            {this.getActionItem(
                              i,
                              arrayHelpers,
                              'corPrescriptionItemInstruction',
                              'Add step dose',
                              {
                                stepdose: 'AND',
                                sequence: activeRows.length + 1,
                              },
                            )}
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
                            : val.sequence === cor.sequence,
                      )

                      return (
                        <div key={i}>
                          <GridContainer>
                            <GridItem xs={10}>
                              <Field
                                name={`corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`}
                                render={args => {
                                  return (
                                    <div
                                      style={{
                                        position: 'relative',
                                        marginBottom: theme.spacing(1),
                                      }}
                                    >
                                      <span
                                        style={{
                                          position: 'absolute',
                                          top: 3,
                                        }}
                                      >
                                        {activeIndex + 1}.
                                      </span>
                                      <CodeSelect
                                        style={{
                                          paddingLeft: 15,
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
                                    </div>
                                  )
                                }}
                              />
                            </GridItem>
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
                              },
                            )}
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
            <GridItem xs={4} className={classes.editor}>
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
            <GridItem xs={2} className={classes.editor}>
              <Field
                name='batchNo'
                render={args => {
                  return (
                    <CodeSelect
                      mode='tags'
                      maxSelected={1}
                      disableAll
                      label='Batch No.'
                      labelField='batchNo'
                      valueField='batchNo'
                      options={values.selectedMedication.medicationStock}
                      onChange={(e, op = {}) => {
                        if (op && op.length > 0) {
                          const { expiryDate } = op[0]
                          setFieldValue(`expiryDate`, expiryDate)
                        } else {
                          setFieldValue(`expiryDate`, undefined)
                        }
                        this.onExpiryDateChange()
                      }}
                      disabled={values.isExternalPrescription}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={2} className={classes.editor}>
              <FastField
                name='expiryDate'
                render={args => {
                  return (
                    <DatePicker
                      label='Expiry Date'
                      onChange={() => {
                        this.onExpiryDateChange()
                      }}
                      disabled={values.isExternalPrescription}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {values.isPackage && (
              <React.Fragment>
                <GridItem xs={3} className={classes.editor}>
                  <Field
                    name='packageConsumeQuantity'
                    render={args => {
                      return (
                        <NumberInput
                          label='Consumed Quantity'
                          style={{
                            marginLeft: theme.spacing(7),
                            paddingRight: theme.spacing(6),
                          }}
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
              <GridItem xs={3} className={classes.editor}>
                <Field
                  name='quantity'
                  render={args => {
                    return (
                      <NumberInput
                        label='Quantity'
                        style={{
                          marginLeft: theme.spacing(7),
                          paddingRight: theme.spacing(6),
                        }}
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
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor}>
              <FastField
                name='remarks'
                render={args => {
                  return <TextField rowsMax='5' label='Remarks' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={3} className={classes.editor}>
              <Field
                name='totalPrice'
                render={args => {
                  return (
                    <NumberInput
                      label='Total'
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
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
                            this.props.setFieldValue('expiryDate', undefined)
                            this.props.setFieldValue('batchNo', undefined)
                            this.props.setFieldValue('isMinus', true)
                            this.props.setFieldValue('isExactAmount', true)
                            this.props.setFieldValue('adjValue', 0)
                          } else {
                            this.props.setFieldValue(
                              'expiryDate',
                              this.state.expiryDate,
                            )
                            this.props.setFieldValue(
                              'batchNo',
                              this.state.batchNo,
                            )
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
              ) : (
                ''
              )}
              {values.isDrugMixture && (
                <FastField
                  name='isClaimable'
                  render={args => {
                    return <Checkbox label='Claimable' {...args} />
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
            <GridItem xs={3}>
              <Field
                name='totalAfterItemAdjustment'
                render={args => {
                  return (
                    <NumberInput
                      label='Total After Adj'
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
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
            title='Add Medication From Past'
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
        </div>
      </Authorized>
    )
  }
}
export default Medication
