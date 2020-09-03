import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import { formatMessage } from 'umi/locale'
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
  CustomInputWrapper,
  Popconfirm,
  withFormikExtend,
  FastField,
  FieldArray,
  Tooltip,
  Field,
  CommonModal,
  ProgressButton,
  notification,
  EditableTableGrid,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import Authorized from '@/utils/Authorized'
import LowStockInfo from './LowStockInfo'
import AddFromPast from './AddMedicationFromPast'

const authorityCfg = {
  '1': 'queue.consultation.order.medication',
  '5': 'queue.consultation.order.openprescription',
}

const drugMixtureItemSchema = Yup.object().shape({
  inventoryMedicationFK: Yup.string().required(),
})

@connect(({ global, codetable, visitRegistration, user }) => ({
  global,
  codetable,
  visitRegistration,
  user,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultMedication),
      type,
      visitPurposeFK: orders.visitPurposeFK,
      isEditMedication: !_.isEmpty(orders.entity),
    }
    if (type === '5') {
      v.drugCode = 'MISC'
    }
    // v.corPrescriptionItemPrecaution =
    //   v.corPrescriptionItemPrecaution && v.corPrescriptionItemPrecaution[0]
    //     ? v.corPrescriptionItemPrecaution
    //     : [
    //         {},
    //       ]
    let sequence = 0
    const newCorPrescriptionItemPrecaution = (v.corPrescriptionItemPrecaution ||
      [])
      .map((precaution) => {
        sequence += 1
        return {
          ...precaution,
          sequence,
        }
      })

    return {
      ...v,
      corPrescriptionItemPrecaution:
        newCorPrescriptionItemPrecaution.length > 0
          ? newCorPrescriptionItemPrecaution
          : [
              {},
            ],
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
    type: Yup.string(),
    // inventoryMedicationFK: Yup.number().when('type', {
    //   is: (val) => val !== '5',
    //   then: Yup.number().required(),
    // }),
    inventoryMedicationFK: Yup.number().when(
      [
        'type',
        'isDrugMixture',
      ],
      (type, isDrugMixture) => {
        if (type === '1' && !isDrugMixture) return Yup.number().required()
        return Yup.number()
      },
    ),

    drugName: Yup.string().when('type', {
      is: (val) => val === '5',
      then: Yup.string().required(),
    }),
    // corPrescriptionItemPrecaution: Yup.array().of(
    //   Yup.object().shape({
    //     medicationPrecautionFK: Yup.number().required(),
    //   }),
    // ),
    corPrescriptionItemInstruction: Yup.array().of(
      Yup.object().shape({
        sequence: Yup.number().required(),
        stepdose: Yup.string().required(),
      }),
    ),
    corPrescriptionItemDrugMixture: Yup.array().when(
      [
        'type',
        'isDrugMixture',
      ],
      (type, isDrugMixture) => {
        if (type === '1' && isDrugMixture)
          return Yup.array()
            .compact((v) => v.isDeleted)
            .of(drugMixtureItemSchema)
        return Yup.array().compact((v) => v.isDeleted)
      },
    ),
  }),

  handleSubmit: (values, { props, onConfirm, setValues }) => {
    const { dispatch, currentType, getNextSequence, user, orders } = props

    const getInstruction = (instructions) => {
      let instruction = ''
      let nextStepdose = ''
      const activeInstructions = instructions
        ? instructions.filter((item) => !item.isDeleted)
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

          instruction += `${item.usageMethodDisplayValue
            ? item.usageMethodDisplayValue
            : ''} ${item.dosageDisplayValue
            ? item.dosageDisplayValue
            : ''} ${item.prescribeUOMDisplayValue
            ? item.prescribeUOMDisplayValue
            : ''} ${item.drugFrequencyDisplayValue
            ? item.drugFrequencyDisplayValue
            : ''}${itemDuration}${nextStepdose}`
        }
      }
      return instruction
    }

    const instruction = getInstruction(values.corPrescriptionItemInstruction)
    // const corPrescriptionItemPrecaution = values.corPrescriptionItemPrecaution.filter(
    //   (i) => i.medicationPrecautionFK !== undefined,
    // )

    const corPrescriptionItemPrecaution = values.corPrescriptionItemPrecaution.filter(
      (i) => i.medicationPrecautionFK !== undefined,
    )

    const activeInstruction = values.corPrescriptionItemInstruction.filter(
      (item) => !item.isDeleted,
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

    let drugMixtureName = ''
    const activeDrugMixtureItems = values.corPrescriptionItemDrugMixture.filter(
      (item) => !item.isDeleted,
    )
    // reorder and overwrite sequence, get combined drug name
    activeDrugMixtureItems.forEach((item, index) => {
      item.sequence = index + 1
      drugMixtureName += index === 0 ? item.drugName : `/${item.drugName}`
    })

    const data = {
      isOrderedByDoctor:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
      sequence: getNextSequence(),
      ...values,
      drugName: values.isDrugMixture ? drugMixtureName : values.drugName,
      corPrescriptionItemPrecaution,
      instruction,
      subject: values.isDrugMixture
        ? drugMixtureName
        : currentType.getSubject({ ...values }),
      isDeleted: false,
      batchNo,
    }

    console.log('submit medication', data)

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
    })
    return true
  },
  displayName: 'OrderPage',
})
class Medication extends PureComponent {
  state = {
    selectedMedication: {
      medicationStock: [],
    },
    batchNo: '',
    expiryDate: '',
    showAddFromPastModal: false,
  }

  getActionItem = (i, arrayHelpers, prop, tooltip, defaultValue) => {
    const { theme, values, setFieldValue } = this.props
    const activeRows = values[prop].filter((item) => !item.isDeleted) || []
    return (
      <GridItem
        xs={2}
        gutter={theme.spacing(1)}
        style={{
          textAlign: 'center',
        }}
      >
        {activeRows.length > 1 && (
          <Popconfirm
            title='Are you sure delete this item?'
            onConfirm={() => {
              setFieldValue(`${prop}[${i}].isDeleted`, true)
              if (prop === 'corPrescriptionItemInstruction') {
                setTimeout(() => {
                  this.calculateQuantity()
                }, 1)
              }
            }}
          >
            <Button justIcon color='danger'>
              <Delete />
            </Button>
          </Popconfirm>
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

  calculateQuantity = (medication) => {
    const { codetable, setFieldValue, disableEdit } = this.props
    let currentMedication = medication || this.state.selectedMedication

    const { form } = this.descriptionArrayHelpers
    let newTotalQuantity = 0

    if (currentMedication && currentMedication.dispensingQuantity) {
      newTotalQuantity = currentMedication.dispensingQuantity
    } else {
      const prescriptionItem = form.values.corPrescriptionItemInstruction.filter(
        (item) => !item.isDeleted,
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
            (o) => o.id === prescriptionItem[i].dosageFK,
          )

          const frequency = medicationFrequencyList.find(
            (o) => o.id === prescriptionItem[i].drugFrequencyFK,
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

    if (disableEdit === false) {
      if (currentMedication.sellingPrice) {
        setFieldValue('unitPrice', currentMedication.sellingPrice)
        this.updateTotalPrice(currentMedication.sellingPrice * newTotalQuantity)
      } else {
        setFieldValue('unitPrice', undefined)
        this.updateTotalPrice(undefined)
      }
    }
  }

  setTotalPrice = () => {
    const { values, disableEdit } = this.props
    if (disableEdit === false) {
      if (values.unitPrice) {
        const total = (values.quantity || 0) * values.unitPrice
        this.updateTotalPrice(total)
      }
    }
  }

  handleAddStepdose = (arrayHelpers, defaultValue, prop) => {
    const { values, codetable, setFieldValue } = this.props
    arrayHelpers.push(defaultValue)
    if (prop === 'corPrescriptionItemInstruction') {
      this.setInstruction(values.corPrescriptionItemInstruction.length)
      const op = codetable.inventorymedication.find(
        (o) => o.id === values.inventoryMedicationFK,
      )

      if (op && op.dispensingQuantity) {
        setFieldValue(`quantity`, op.dispensingQuantity)
        setTimeout(() => {
          this.setTotalPrice()
        }, 1)
      } else {
        setTimeout(() => {
          this.calculateQuantity()
        }, 1)
      }
    }
  }

  setInstruction = (index = 0) => {
    const { setFieldValue, codetable, values } = this.props
    const { selectedMedication } = this.state
    let op = selectedMedication

    if (!selectedMedication || !selectedMedication.id) {
      op = codetable.inventorymedication.find(
        (o) => o.id === values.inventoryMedicationFK,
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
    const { codetable: { inventorymedication = [] } } = this.props

    return inventorymedication.reduce((p, c) => {
      const { code, displayValue, sellingPrice = 0, dispensingUOM = {} } = c
      const { name: uomName = '' } = dispensingUOM
      let opt = {
        ...c,
        combinDisplayValue: `${displayValue} - ${code} (${currencySymbol}${sellingPrice.toFixed(
          2,
        )} / ${uomName})`,
      }
      return [
        ...p,
        opt,
      ]
    }, [])
  }

  changeMedication = (v, op = {}) => {
    const { setFieldValue, disableEdit, values } = this.props

    let defaultBatch
    if (op.medicationStock) {
      defaultBatch = op.medicationStock.find((o) => o.isDefault === true)
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
    const defaultInstruction = {
      sequence: 0,
      stepdose: 'AND',
    }
    const isEdit = !!values.id
    const newPrescriptionInstruction = isEdit
      ? [
          ...corPrescriptionItemInstruction.map((i) => ({
            ...i,
            isDeleted: true,
          })),
          defaultInstruction,
        ]
      : [
          defaultInstruction,
        ]

    setFieldValue('corPrescriptionItemInstruction', newPrescriptionInstruction)

    if (disableEdit === false) {
      setFieldValue('batchNo', defaultBatch ? defaultBatch.batchNo : undefined)
      setFieldValue(
        'expiryDate',
        defaultBatch ? defaultBatch.expiryDate : undefined,
      )
    }
    setFieldValue('isActive', op.isActive)

    this.setState(
      {
        selectedMedication: op,
      },
      () => {
        this.setInstruction(newPrescriptionInstruction.length - 1)
      },
    )

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
            ...corPrescriptionItemPrecaution.map((i) => ({
              ...i,
              isDeleted: true,
            })),
            defaultPrecaution,
          ]
        : [
            defaultPrecaution,
          ]

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

    setFieldValue('drugCode', op.code)
    setFieldValue('drugName', op.displayValue)

    setTimeout(() => {
      this.calculateQuantity(op)
    }, 1)
  }

  updateTotalPrice = (v) => {
    if (v || v === 0) {
      const { adjType, adjValue } = this.props.values
      const adjustment = calculateAdjustAmount(
        adjType === 'ExactAmount',
        v,
        adjValue,
      )
      this.props.setFieldValue('totalPrice', v)
      this.props.setFieldValue('totalAfterItemAdjustment', adjustment.amount)
      this.props.setFieldValue('adjAmount', adjustment.adjAmount)
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

    const { values: nextValues } = nextProps
    const { values: currentValues } = this.props
    if (
      !!nextValues.id &&
      nextValues.id !== currentValues.id &&
      nextValues.type === '1' // type === 'Medication'
    ) {
      const { codetable } = this.props
      const { inventorymedication = [] } = codetable
      const { inventoryMedicationFK } = nextValues
      const medication = inventorymedication.find(
        (item) => item.id === inventoryMedicationFK,
      )

      if (medication)
        this.setState({
          selectedMedication: medication,
        })
      else
        this.setState({
          selectedMedication: {
            medicationStock: [],
          },
        })
    }
  }

  onSearchMedicationHistory = async () => {
    const { dispatch, visitRegistration } = this.props
    const { patientProfileFK } = visitRegistration.entity.visit
    await dispatch({
      type: 'medicationHistory/queryMedicationHistory',
      payload: { patientProfileId: patientProfileFK },
    })
    this.toggleAddFromPastModal()
  }

  toggleAddFromPastModal = () => {
    const { showAddFromPastModal } = this.state
    this.setState({ showAddFromPastModal: !showAddFromPastModal })
    if (showAddFromPastModal) {
      this.resetMedicationHistoryResult()
    }
  }

  validateAndSubmitIfOk = async () => {
    const { handleSubmit, validateForm, values } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)

    if (values.type === '1' && values.isDrugMixture) {
      const drugMixtureItems = values.corPrescriptionItemDrugMixture.filter(
        (o) => !o.isDeleted,
      )
      if (drugMixtureItems.length < 2) {
        notification.warn({
          message: 'At least two medications are required',
        })
        return false
      }
    }

    if (isFormValid) {
      handleSubmit()
      return true
    }
    return false
  }

  resetMedicationHistoryResult = () => {
    this.props.dispatch({
      type: 'medicationHistory/updateState',
      payload: {
        filter: {},
        list: [],
      },
    })
  }

  getMixtureItemBatchStock = (row) => {
    let batchNoOptions = []

    const { codetable } = this.props
    const { inventorymedication = [] } = codetable
    const currentItem = inventorymedication.find(
      (o) => o.id === row.inventoryMedicationFK,
    )
    if (currentItem) {
      batchNoOptions = currentItem.medicationStock
    }

    return batchNoOptions
  }

  handleDrugMixtureItemOnChange = (e) => {
    const { option, row } = e
    const { values } = this.props
    const rs = values.corPrescriptionItemDrugMixture.filter(
      (o) =>
        !o.isDeleted &&
        o.inventoryMedicationFK === option.id &&
        o.id !== row.id,
    )
    if (rs.length > 0) {
      notification.warn({
        message: 'The medication already exist in the list',
      })
    }

    row.quantity = option.dispensingQuantity
    row.uOMFK = option.dispensingUOM.id
    row.uOMCode = option.dispensingUOM.code
    row.uOMDisplayValue = option.dispensingUOM.name
    row.total = (option.sellingPrice || 0) * (option.dispensingQuantity || 0)
    row.drugName = option.displayValue

    const defaultBatch = this.getMixtureItemBatchStock(row).find(
      (batch) => batch.isDefault,
    )
    if (defaultBatch) {
      row.batchNo = defaultBatch.batchNo
      row.batchNoId = defaultBatch.id
      row.expiryDate = defaultBatch.expiryDate
    }
  }

  handleMixtureItemSelectedBatch = (e) => {
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
  }

  drugMixtureTableParas = {
    columns: [
      { name: 'inventoryMedicationFK', title: 'Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'uOMFK', title: 'UOM' },
      { name: 'total', title: 'Total' },
      { name: 'batchNo', title: 'Batch No.' },
      { name: 'expiryDate', title: 'Expiry Date' },
    ],
    columnExtensions: [
      {
        columnName: 'inventoryMedicationFK',
        type: 'codeSelect',
        code: 'inventorymedication',
        labelField: 'displayValue',
        sortingEnabled: false,
        onChange: (e) => {
          if (e.option) {
            this.handleDrugMixtureItemOnChange(e)
          }
        },
      },
      {
        columnName: 'quantity',
        width: 70,
        type: 'number',
        format: '0.0',
        sortingEnabled: false,
        isDisabled: (row) => row.inventoryMedicationFK === undefined,
      },
      {
        columnName: 'uOMFK',
        width: 80,
        type: 'codeSelect',
        code: 'ctMedicationUnitOfMeasurement',
        labelField: 'name',
        sortingEnabled: false,
        disabled: true,
      },
      {
        columnName: 'total',
        width: 100,
        type: 'number',
        currency: true,
        sortingEnabled: false,
        isDisabled: (row) => row.inventoryMedicationFK === undefined,
      },
      {
        columnName: 'batchNo',
        type: 'select',
        width: 120,
        sortingEnabled: false,
        mode: 'tags',
        maxSelected: 1,
        labelField: 'batchNo',
        valueField: 'batchNo',
        disableAll: true,
        options: this.getMixtureItemBatchStock,
        onChange: (e) => {
          this.handleMixtureItemSelectedBatch(e)
        },
        render: (row) => {
          return <TextField text value={row.batchNo} />
        },
        isDisabled: (row) => row.inventoryMedicationFK === undefined,
      },
      {
        columnName: 'expiryDate',
        type: 'date',
        width: 120,
        sortingEnabled: false,
        isDisabled: (row) => row.inventoryMedicationFK === undefined,
      },
    ],
  }

  checkIsDrugMixtureItemUnique = ({ rows, changed }) => {
    if (!changed) return rows
    const key = Object.keys(changed)[0]
    const obj = changed[key]
    if (obj.inventoryMedicationFK !== undefined) {
      const hasDuplicate = rows.filter(
        (i) =>
          !i.isDeleted && i.inventoryMedicationFK === obj.inventoryMedicationFK,
      )
      if (hasDuplicate.length >= 2) {
        return rows.map(
          (row) =>
            row.id === parseInt(key, 10)
              ? { ...row, inventoryMedicationFK: undefined }
              : row,
        )
      }
    }
    return rows
  }

  commitDrugMixtureItemChanges = ({ rows, deleted, added, changed }) => {
    const { setFieldValue, values } = this.props
    if (deleted) {
      const tempArray = [
        ...values.corPrescriptionItemDrugMixture,
      ]

      const newArray = tempArray.map((o) => {
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

      setFieldValue('corPrescriptionItemDrugMixture', newArray)
      this.setState(() => {
        return {
          corPrescriptionItemDrugMixture: newArray,
        }
      })
    } else {
      let _rows = this.checkIsDrugMixtureItemUnique({ rows, changed })
      if (added) {
        _rows = [
          ...values.corPrescriptionItemDrugMixture,
          rows[0],
        ]
      }

      // _rows.forEach((val, i) => {
      //   val.prescriptionItemFK = values.id
      //   val.inventoryMedicationFKNavigation = null
      // })

      setFieldValue('corPrescriptionItemDrugMixture', _rows)
    }
  }

  render () {
    const {
      theme,
      classes,
      values,
      openPrescription,
      footer,
      handleSubmit,
      setFieldValue,
      disableEdit,
      setDisable,
    } = this.props

    const { isEditMedication } = values
    const { showAddFromPastModal } = this.state

    const commonSelectProps = {
      handleFilter: this.filterOptions,
      dropdownMatchSelectWidth: false,
      dropdownStyle: {
        width: 300,
      },
    }

    const accessRight = authorityCfg[values.type]
    return (
      <Authorized authority={accessRight}>
        <div>
          <GridContainer>
            <GridItem xs={6}>
              <React.Fragment>
                {openPrescription || values.isDrugMixture ? (
                  <FastField
                    name='drugName'
                    render={(args) => {
                      return (
                        <div id={`autofocus_${values.type}`}>
                          <TextField
                            label={
                              values.isDrugMixture ? (
                                'Drug Mixture'
                              ) : (
                                'Open Prescription Name'
                              )
                            }
                            disabled={!openPrescription && values.isDrugMixture}
                            {...args}
                            autocomplete='nope'
                          />
                        </div>
                      )
                    }}
                  />
                ) : (
                  <Field
                    name='inventoryMedicationFK'
                    render={(args) => {
                      return (
                        <div
                          id={`autofocus_${values.type}`}
                          style={{ position: 'relative' }}
                        >
                          <CodeSelect
                            temp
                            label='Medication Name'
                            // code='inventorymedication'
                            labelField='combinDisplayValue'
                            onChange={this.changeMedication}
                            options={this.getMedicationOptions()}
                            {...args}
                            style={{ paddingRight: 20 }}
                          />
                          <LowStockInfo
                            sourceType='medication'
                            {...this.props}
                          />
                        </div>
                      )
                    }}
                  />
                )}
              </React.Fragment>
            </GridItem>
            <GridItem xs={2} style={{ marginTop: theme.spacing(2) }}>
              {!openPrescription && (
                <Field
                  name='isDrugMixture'
                  render={(args) => {
                    return (
                      <Checkbox
                        label='Drug Mixture'
                        disabled={isEditMedication}
                        {...args}
                        onChange={(e) => {
                          const { setValues, orders } = this.props
                          setValues({
                            ...orders.defaultMedication,
                            isDrugMixture: e.target.value,
                            type: orders.type,
                            visitPurposeFK: orders.visitPurposeFK,
                          })

                          if (e.target.value) {
                            this.props.setFieldValue('drugCode', 'DrugMixture')
                            this.props.setFieldValue('isClaimable', false)
                          } else {
                            this.props.setFieldValue('drugCode', undefined)
                            this.props.setFieldValue('drugName', undefined)
                            this.props.setFieldValue('isClaimable', undefined)
                          }
                        }}
                      />
                    )
                  }}
                />
              )}
            </GridItem>
            <GridItem xs={4}>
              {!openPrescription &&
              !isEditMedication && (
                <Tooltip title='Add From Past'>
                  <ProgressButton
                    color='primary'
                    icon={<Add />}
                    style={{ marginTop: theme.spacing(2) }}
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
                  rows={values.corPrescriptionItemDrugMixture}
                  FuncProps={{
                    pager: false,
                  }}
                  EditingProps={{
                    showAddCommand: true,
                    onCommitChanges: this.commitDrugMixtureItemChanges,
                  }}
                  schema={drugMixtureItemSchema}
                  {...this.drugMixtureTableParas}
                />
              </GridItem>
            </GridContainer>
          )}
          <GridContainer gutter={0}>
            <GridItem xs={12}>
              <CustomInputWrapper
                label='Description'
                style={{ paddingTop: 14 }}
                labelProps={{
                  shrink: true,
                  style: { marginLeft: theme.spacing(1) },
                }}
              />

              <FieldArray
                name='corPrescriptionItemInstruction'
                render={(arrayHelpers) => {
                  this.descriptionArrayHelpers = arrayHelpers
                  if (!values || !values.corPrescriptionItemInstruction)
                    return null
                  const activeRows = values.corPrescriptionItemInstruction.filter(
                    (val) => !val.isDeleted,
                  )
                  return activeRows.map((val, activeIndex) => {
                    if (val && val.isDeleted) return null
                    const i = values.corPrescriptionItemInstruction.findIndex(
                      (item) => _.isEqual(item, val),
                    )

                    return (
                      <div key={i}>
                        <GridContainer>
                          {activeIndex > 0 && (
                            <GridItem xs={2}>
                              <FastField
                                name={`corPrescriptionItemInstruction[${i}].stepdose`}
                                render={(args) => {
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
                              render={(args) => {
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
                              render={(args) => {
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
                              render={(args) => {
                                return (
                                  <CodeSelect
                                    label={formatMessage({
                                      id: 'inventory.master.setting.uom',
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
                              render={(args) => {
                                return (
                                  <CodeSelect
                                    label={formatMessage({
                                      id: 'inventory.master.setting.frequency',
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
                              render={(args) => {
                                return (
                                  <NumberInput
                                    precision={0}
                                    label={formatMessage({
                                      id: 'inventory.master.setting.duration',
                                    })}
                                    formatter={(v) =>
                                      `${v} Day${v > 1 ? 's' : ''}`}
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
                              // drugFrequencyFK: 1,
                              // duration: 1,
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
            </GridItem>
          </GridContainer>

          <GridContainer gutter={0}>
            <GridItem xs={12}>
              <CustomInputWrapper
                label='Precaution'
                style={{ paddingTop: 14 }}
                labelProps={{
                  shrink: true,
                  style: { marginLeft: theme.spacing(1) },
                }}
              >
                <FieldArray
                  name='corPrescriptionItemPrecaution'
                  render={(arrayHelpers) => {
                    if (!values || !values.corPrescriptionItemPrecaution)
                      return null
                    const activeRows = values.corPrescriptionItemPrecaution.filter(
                      (val) => !val.isDeleted,
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
                        (cor) =>
                          val.id
                            ? cor.id === val.id
                            : val.sequence === cor.sequence,
                      )

                      // const i = values.corPrescriptionItemPrecaution.findIndex(
                      //   (item) =>
                      //     !val.id
                      //       ? _.isEqual(item, val)
                      //       : item.sequence === val.sequence,
                      // )

                      return (
                        <div key={i}>
                          <GridContainer>
                            <GridItem xs={10}>
                              <Field
                                name={`corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`}
                                render={(args) => {
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
                                        // label='Precaution'
                                        // simple
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
                                          // setFieldValue(
                                          //   `corPrescriptionItemPrecaution[${i}].sequence`,
                                          //   i,
                                          // )
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
              </CustomInputWrapper>
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={2}>
              <Field
                name='quantity'
                render={(args) => {
                  return (
                    <NumberInput
                      label='Quantity'
                      // formatter={(v) => `${v} Bottle${v > 1 ? 's' : ''}`}
                      step={1}
                      min={0}
                      // currency
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
            <GridItem xs={2}>
              <Field
                name='dispenseUOMFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      disabled={!openPrescription && !values.isDrugMixture}
                      label='UOM'
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
            <GridItem xs={3}>
              <Field
                name='totalPrice'
                render={(args) => {
                  return (
                    <NumberInput
                      label='Total'
                      onChange={(e) => {
                        this.updateTotalPrice(e.target.value)
                      }}
                      min={0}
                      disabled={disableEdit}
                      currency
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={3}>
              <Field
                name='totalAfterItemAdjustment'
                render={(args) => {
                  // if (
                  //   orders.totalAfterItemAdjustment &&
                  //   args.field.value !== orders.totalAfterItemAdjustment
                  // ) {
                  //   args.form.setFieldValue('totalAfterItemAdjustment', orders.totalAfterItemAdjustment)
                  // }
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
          <GridContainer>
            <GridItem xs={2} className={classes.editor}>
              <Field
                name='batchNo'
                render={(args) => {
                  return (
                    <CodeSelect
                      mode='tags'
                      maxSelected={1}
                      disableAll
                      label='Batch No.'
                      labelField='batchNo'
                      valueField='batchNo'
                      options={this.state.selectedMedication.medicationStock}
                      onChange={(e, op = {}) => {
                        if (op && op.length > 0) {
                          const { expiryDate } = op[0]
                          setFieldValue(`expiryDate`, expiryDate)
                        } else {
                          setFieldValue(`expiryDate`, undefined)
                        }
                      }}
                      disabled={disableEdit}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={2} className={classes.editor}>
              <Field
                name='expiryDate'
                render={(args) => {
                  return (
                    <DatePicker
                      label='Expiry Date'
                      disabled={disableEdit}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6} className={classes.editor}>
              {/* <Button link className={classes.editorBtn}>
              Add Diagnosis
            </Button> */}

              <FastField
                name='remarks'
                render={(args) => {
                  // return <RichEditor placeholder='Remarks' {...args} />
                  return (
                    <TextField
                      multiline
                      rowsMax='5'
                      label='Remarks'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              {values.visitPurposeFK !== VISIT_TYPE.RETAIL &&
              !values.isDrugMixture ? (
                <FastField
                  name='isExternalPrescription'
                  render={(args) => {
                    if (args.field.value) {
                      setDisable(true)
                    } else {
                      setDisable(false)
                    }
                    return (
                      <Checkbox
                        label='External Prescription'
                        // fullWidth={false}
                        {...args}
                        onChange={(e) => {
                          if (e.target.value) {
                            this.props.setFieldValue('adjAmount', 0)
                            this.props.setFieldValue(
                              'totalAfterItemAdjustment',
                              0,
                            )
                            this.props.setFieldValue('totalPrice', 0)
                            this.props.setFieldValue('expiryDate', undefined)
                            this.props.setFieldValue('batchNo', undefined)
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
                  render={(args) => {
                    return <Checkbox label='Claimable' {...args} />
                  }}
                />
              )}
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
