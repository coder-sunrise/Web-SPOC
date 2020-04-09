import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  NumberInput,
  FastField,
  Field,
  withFormikExtend,
  CommonModal,
  ProgressButton,
  Tooltip,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'
import LowStockInfo from './LowStockInfo'
import AddFromPast from './AddFromPast'

let i = 0
@connect(({ global, codetable, visitRegistration }) => ({
  global,
  codetable,
  visitRegistration,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {} }) => {
    const newOrders = orders.entity || orders.defaultVaccination

    return {
      minQuantity: 1,
      ...newOrders,
      isEditVaccination: !_.isEmpty(orders.entity),
    }
  },

  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    // unitPrice: Yup.number().required(),
    totalPrice: Yup.number().required(),
    vaccinationGivenDate: Yup.date().required(),
    quantity: Yup.number().required(),
  }),

  handleSubmit: (values, { props, onConfirm, resetForm }) => {
    const { dispatch, orders, currentType, getNextSequence } = props
    const { rows } = orders
    var batchNo = values.batchNo
    if (batchNo instanceof Array) {
      if (batchNo && batchNo.length > 0) {
        batchNo = batchNo[0]
      }
    }
    const data = {
      sequence: getNextSequence(),
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
      batchNo,
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    }).then(() => {
      resetForm(orders.defaultVaccination)
    })

    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Vaccination extends PureComponent {
  // state = {

  // }

  constructor (props) {
    super(props)

    const { codetable, values } = this.props
    const { inventoryvaccination = [] } = codetable
    const { inventoryVaccinationFK } = values

    let selectedVaccination = {
      vaccinationStock: [],
    }
    const vaccination = inventoryVaccinationFK
      ? inventoryvaccination.find((item) => item.id === inventoryVaccinationFK)
      : undefined

    if (vaccination) selectedVaccination = vaccination

    this.state = {
      selectedVaccination,
      batchNo: '',
      expiryDate: '',
      showAddFromPastModal: false,
    }
  }

  changeVaccination = (v, op = {}) => {
    const { setFieldValue, values, disableEdit } = this.props
    // console.log(v, op)
    let defaultBatch
    if (op.vaccinationStock) {
      defaultBatch = op.vaccinationStock.find((o) => o.isDefault === true)
      if (defaultBatch)
        this.setState({
          batchNo: defaultBatch.batchNo,
          expiryDate: defaultBatch.expiryDate,
        })
    }
    this.setState({
      selectedVaccination: op,
    })

    setFieldValue('isActive', op.isActive)
    setFieldValue(
      'dosageFK',
      op.prescribingDosage ? op.prescribingDosage.id : undefined,
    )
    setFieldValue(
      'dosageCode',
      op.prescribingDosage ? op.prescribingDosage.code : undefined,
    )
    setFieldValue(
      'dosageDisplayValue',
      op.prescribingDosage ? op.prescribingDosage.name : undefined,
    )
    setFieldValue('uomfk', op.prescribingUOM ? op.prescribingUOM.id : undefined)
    setFieldValue(
      'uomCode',
      op.prescribingUOM ? op.prescribingUOM.code : undefined,
    )
    setFieldValue(
      'uomDisplayValue',
      op.prescribingUOM ? op.prescribingUOM.name : undefined,
    )
    setFieldValue(
      'usageMethodFK',
      op.vaccinationUsage ? op.vaccinationUsage.id : undefined,
    )
    setFieldValue(
      'usageMethodCode',
      op.vaccinationUsage ? op.vaccinationUsage.code : undefined,
    )
    setFieldValue(
      'usageMethodDisplayValue',
      op.vaccinationUsage ? op.vaccinationUsage.name : undefined,
    )
    setFieldValue('vaccinationName', op.displayValue)
    setFieldValue('vaccinationCode', op.code)

    if (op.sellingPrice) {
      setFieldValue('unitPrice', op.sellingPrice)
      setFieldValue('totalPrice', op.sellingPrice * values.quantity)
      this.updateTotalPrice(op.sellingPrice * values.quantity)
    } else {
      setFieldValue('unitPrice', undefined)
      setFieldValue('totalPrice', undefined)
      this.updateTotalPrice(undefined)
    }
    if (disableEdit === false) {
      setFieldValue('batchNo', defaultBatch ? defaultBatch.batchNo : undefined)
      setFieldValue(
        'expiryDate',
        defaultBatch ? defaultBatch.expiryDate : undefined,
      )
    }
    setTimeout(() => {
      this.calculateQuantity(op)
    }, 1)
  }

  calculateQuantity = (vaccination) => {
    const { codetable, setFieldValue, values, disableEdit, dirty } = this.props
    // console.log(this.props)
    const { minQuantity = 0 } = values
    let currentVaccination =
      vaccination && Object.values(vaccination).length ? vaccination : undefined
    if (!currentVaccination) currentVaccination = this.state.selectedVaccination
    let newTotalQuantity = 0
    // console.log(currentVaccination, values)
    if (currentVaccination && currentVaccination.dispensingQuantity && !dirty) {
      newTotalQuantity = currentVaccination.dispensingQuantity
    } else if (currentVaccination.prescribingDosage) {
      const { ctmedicationdosage } = codetable

      const dosage = ctmedicationdosage.find(
        (o) =>
          o.id === (values.dosageFK || currentVaccination.prescribingDosage.id),
      )
      if (dosage) {
        newTotalQuantity = Math.ceil(dosage.multiplier)
      }
      const { prescriptionToDispenseConversion } = currentVaccination
      if (prescriptionToDispenseConversion)
        newTotalQuantity = Math.ceil(
          newTotalQuantity / prescriptionToDispenseConversion,
        )
    }
    newTotalQuantity =
      newTotalQuantity < minQuantity ? minQuantity : newTotalQuantity

    setFieldValue(`quantity`, newTotalQuantity)
    // console.log(newTotalQuantity)
    if (currentVaccination.sellingPrice) {
      setFieldValue('unitPrice', currentVaccination.sellingPrice)
      setFieldValue(
        'totalPrice',
        currentVaccination.sellingPrice * newTotalQuantity,
      )
      this.updateTotalPrice(currentVaccination.sellingPrice * newTotalQuantity)
    } else {
      setFieldValue('unitPrice', undefined)
      setFieldValue('totalPrice', undefined)
      this.updateTotalPrice(undefined)
    }
  }

  updateTotalPrice = (v) => {
    if (v || v === 0) {
      const { adjType, adjValue } = this.props.values
      const adjustment = calculateAdjustAmount(
        adjType === 'ExactAmount',
        v,
        adjValue,
      )
      this.props.setFieldValue('totalAfterItemAdjustment', adjustment.amount)
      this.props.setFieldValue('adjAmount', adjustment.adjAmount)
    } else {
      this.props.setFieldValue('totalAfterItemAdjustment', undefined)
      this.props.setFieldValue('adjAmount', undefined)
    }
  }

  handleReset = () => {
    const { setValues, orders } = this.props
    setValues({
      ...orders.defaultService,
      type: orders.type,
    })
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
      nextValues.type === '2' // type === 'Medication'
    ) {
      const { codetable } = this.props
      const { inventoryvaccination = [] } = codetable
      const { inventoryVaccinationFK } = nextValues
      const vaccination = inventoryvaccination.find(
        (item) => item.id === inventoryVaccinationFK,
      )

      if (vaccination)
        this.setState({
          selectedVaccination: vaccination,
        })
      else
        this.setState({
          selectedVaccination: {
            vaccinationStock: [],
          },
        })
    }
  }
  onSearchVaccinationHistory = async () => {
    const { dispatch, values, visitRegistration } = this.props
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
      this.resetVaccinationHistoryResult()
    }
  }

  resetVaccinationHistoryResult = () => {
    this.props.dispatch({
      type: 'medicationHistory/updateState',
      payload: {
        filter: {},
        list: [],
      },
    })
  }

  render () {
    const {
      theme,
      values,
      footer,
      handleSubmit,
      setFieldValue,
      classes,
      disableEdit,
      getNextSequence,
      ...reset
    } = this.props
    const { isEditVaccination } = values
    const { showAddFromPastModal } = this.state
    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <Field
              name='inventoryVaccinationFK'
              render={(args) => {
                return (
                  <div style={{ position: 'relative' }}>
                    <CodeSelect
                      temp
                      label='Vaccination Name'
                      labelField='displayValue'
                      code='inventoryvaccination'
                      onChange={this.changeVaccination}
                      {...args}
                      style={{ paddingRight: 20 }}
                    />
                    <LowStockInfo sourceType='vaccination' {...this.props} />
                  </div>
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            {!isEditVaccination && (
              <Tooltip title='Add From Past'>
                <ProgressButton
                  color='primary'
                  icon={<Add />}
                  style={{ marginTop: theme.spacing(2) }}
                  onClick={this.onSearchVaccinationHistory}
                >
                  Add New
                </ProgressButton>
              </Tooltip>
            )}
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='vaccinationGivenDate'
              render={(args) => {
                return <DatePicker label='Date Given' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={4}>
            <Field
              name='usageMethodFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Usage'
                    allowClear={false}
                    code='ctVaccinationUsage'
                    onChange={(v, op = {}) => {
                      setFieldValue('usageMethodCode', op ? op.code : undefined)
                      setFieldValue(
                        'usageMethodDisplayValue',
                        op ? op.name : undefined,
                      )
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='dosageFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Dosage'
                    labelField='displayValue'
                    allowClear={false}
                    code='ctmedicationdosage'
                    onChange={(v, op = {}) => {
                      setFieldValue('dosageCode', op ? op.code : undefined)
                      setFieldValue(
                        'dosageDisplayValue',
                        op ? op.displayValue : undefined,
                      )
                      setTimeout(this.calculateQuantity, 1)
                    }}
                    valueFiled='id'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='uomfk'
              render={(args) => {
                return (
                  <CodeSelect
                    label='UOM'
                    allowClear={false}
                    code='ctvaccinationunitofmeasurement'
                    onChange={(v, op = {}) => {
                      setFieldValue('uomCode', op ? op.code : undefined)
                      setFieldValue('uomDisplayValue', op ? op.name : undefined)
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    formatter={(v) => `${v} Tab/s`}
                    step={1}
                    min={values.minQuantity}
                    onChange={(e) => {
                      if (values.unitPrice) {
                        const total = e.target.value * values.unitPrice
                        setFieldValue('totalPrice', total)
                        this.updateTotalPrice(total)
                      }
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='totalPrice'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total'
                    currency
                    onChange={(e) => {
                      this.updateTotalPrice(e.target.value)
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='totalAfterItemAdjustment'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total After Adj'
                    currency
                    disabled
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
                    options={this.state.selectedVaccination.vaccinationStock}
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
          <GridItem xs={8} className={classes.editor}>
            <FastField
              name='remarks'
              render={(args) => {
                // return <RichEditor placeholder='Remarks' {...args} />
                return (
                  <TextField multiline rowsMax='5' label='Remarks' {...args} />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
          onReset: this.handleReset,
        })}
        <CommonModal
          open={showAddFromPastModal}
          title='Add Vaccination From Past'
          onClose={this.toggleAddFromPastModal}
          onConfirm={this.toggleAddFromPastModal}
          maxWidth='md'
          showFooter={false}
          overrideLoading
          cancelText='Cancel'
        >
          <AddFromPast {...this.props} />
        </CommonModal>
      </div>
    )
  }
}
export default Vaccination
