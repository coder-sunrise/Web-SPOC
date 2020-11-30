import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import { isNumber } from 'util'
import { Alert } from 'antd'
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
  Switch,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import LowStockInfo from './LowStockInfo'
import AddFromPast from './AddMedicationFromPast'

let i = 0
@connect(({ global, codetable, visitRegistration, user }) => ({
  global,
  codetable,
  visitRegistration,
  user,
}))
@withFormikExtend({
  authority: [
    'queue.consultation.order.vaccination',
  ],
  mapPropsToValues: ({ orders = {}, type }) => {
    const newOrders = orders.entity || orders.defaultVaccination

    if (newOrders.uid) {
      if (newOrders.adjAmount <= 0) {
        newOrders.adjValue = Math.abs(newOrders.adjValue)
        newOrders.isMinus = true
      } else {
        newOrders.isMinus = false
      }

      newOrders.isExactAmount = newOrders.adjType !== 'Percentage'
    }

    return {
      minQuantity: 1,
      ...newOrders,
      type,
      isEditVaccination: !_.isEmpty(orders.entity),
      editingVaccinationFK: orders.entity
        ? orders.entity.inventoryVaccinationFK
        : undefined,
    }
  },

  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    // unitPrice: Yup.number().required(),
    totalPrice: Yup.number().required(),
    vaccinationGivenDate: Yup.date().required(),
    quantity: Yup.number().required(),
    totalAfterItemAdjustment: Yup.number().min(
      0.0,
      'The amount should be more than 0.00',
    ),
  }),

  handleSubmit: (values, { props, onConfirm, resetForm, setValues }) => {
    const { dispatch, orders, currentType, getNextSequence, user } = props
    const { rows } = orders
    let { batchNo } = values
    if (batchNo instanceof Array) {
      if (batchNo && batchNo.length > 0) {
        batchNo = batchNo[0]
      }
    }
    const data = {
      isOrderedByDoctor:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
      sequence: getNextSequence(),
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
      batchNo,
      adjValue:
        values.adjAmount < 0
          ? -Math.abs(values.adjValue)
          : Math.abs(values.adjValue),
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })

    if (onConfirm) onConfirm()
    setValues({
      ...orders.defaultVaccination,
      type: orders.type,
    })
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

  getVaccinationOptions = () => {
    const { codetable: { inventoryvaccination = [] } } = this.props

    return inventoryvaccination.reduce((p, c) => {
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

  changeVaccination = (v, op = {}) => {
    const { setFieldValue, values, disableEdit } = this.props
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

    setFieldValue('isMinus', true)
    setFieldValue('isExactAmount', true)
    setFieldValue('adjValue', 0)

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
    const { minQuantity = 0 } = values
    let currentVaccination =
      vaccination && Object.values(vaccination).length ? vaccination : undefined
    if (!currentVaccination) currentVaccination = this.state.selectedVaccination
    let newTotalQuantity = 0
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
    } else {
      this.props.setFieldValue('totalAfterItemAdjustment', undefined)
      this.props.setFieldValue('adjAmount', undefined)
    }
  }

  handleReset = () => {
    const { setValues, orders } = this.props
    setValues({
      ...orders.defaultVaccination,
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
    this.toggleAddFromPastModal()
  }

  toggleAddFromPastModal = () => {
    const { showAddFromPastModal } = this.state
    this.setState({ showAddFromPastModal: !showAddFromPastModal })
  }

  validateAndSubmitIfOk = async () => {
    const { handleSubmit, validateForm } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)

    if (isFormValid) {
      handleSubmit()
      return true
    }
    handleSubmit()
    return false
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

  onAdjustmentConditionChange = (v) => {
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

  getCaution = () => {
    const { values, codetable: { inventoryvaccination = [] } } = this.props
    let cautions

    const { inventoryVaccinationFK } = values
    const selectVaccination = inventoryvaccination.find(
      (vaccination) => vaccination.id === inventoryVaccinationFK,
    )
    if (
      selectVaccination &&
      selectVaccination.caution &&
      selectVaccination.caution.trim().length
    ) {
      cautions = selectVaccination.caution
    }
    return cautions
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
    const caution = this.getCaution()
    return (
      <div>
        <GridContainer>
          <GridItem xs={8}>
            <Field
              name='inventoryVaccinationFK'
              render={(args) => {
                return (
                  <div
                    id={`autofocus_${values.type}`}
                    style={{ position: 'relative' }}
                  >
                    <CodeSelect
                      temp
                      label='Vaccination Name'
                      labelField='combinDisplayValue'
                      code='inventoryvaccination'
                      onChange={this.changeVaccination}
                      options={this.getVaccinationOptions()}
                      {...args}
                      style={{ paddingRight: 20 }}
                    />
                    <LowStockInfo sourceType='vaccination' {...this.props} />
                  </div>
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            {!isEditVaccination && (
              <Tooltip title='Add From Past'>
                <ProgressButton
                  color='primary'
                  icon={<Add />}
                  style={{
                    marginTop: theme.spacing(2),
                    marginLeft: theme.spacing(7),
                  }}
                  onClick={this.onSearchVaccinationHistory}
                >
                  Add From Past
                </ProgressButton>
              </Tooltip>
            )}
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <div
              style={{
                position: 'relative',
                paddingLeft: 90,
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
              {caution && (
                <Alert
                  message={
                    <Tooltip
                      useTooltip2
                      title={
                        <div>
                          <div style={{ fontWeight: 500 }}>Caution:</div>
                          <div style={{ marginLeft: 10 }}>{caution}</div>
                        </div>
                      }
                    >
                      <span>{caution}</span>
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
          </GridItem>
          <GridItem xs={2}>
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
          <GridItem xs={2}>
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
          <GridItem xs={2}>
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
          <GridItem xs={2}>
            <FastField
              name='vaccinationGivenDate'
              render={(args) => {
                return <DatePicker label='Date Given' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    style={{
                      marginLeft: theme.spacing(7),
                      paddingRight: theme.spacing(6),
                    }}
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
        </GridContainer>
        <GridContainer>
          <GridItem xs={4} className={classes.editor}>
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
          <GridItem xs={4} className={classes.editor}>
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
          <GridItem xs={3} className={classes.editor}>
            <FastField
              name='totalPrice'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total'
                    style={{
                      marginLeft: theme.spacing(7),
                      paddingRight: theme.spacing(6),
                    }}
                    currency
                    onChange={(e) => {
                      this.updateTotalPrice(e.target.value)
                    }}
                    min={0}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
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
          <GridItem xs={3} className={classes.editor}>
            <div style={{ position: 'relative' }}>
              <div
                style={{ marginTop: theme.spacing(2), position: 'absolute' }}
              >
                <FastField
                  name='isMinus'
                  render={(args) => {
                    return (
                      <Switch
                        checkedChildren='-'
                        unCheckedChildren='+'
                        label=''
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
                render={(args) => {
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
              <FastField
                name='isExactAmount'
                render={(args) => {
                  return (
                    <Switch
                      checkedChildren='$'
                      unCheckedChildren='%'
                      label=''
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
          <GridItem xs={8} />
          <GridItem xs={3}>
            <FastField
              name='totalAfterItemAdjustment'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total After Adj'
                    style={{
                      marginLeft: theme.spacing(7),
                      paddingRight: theme.spacing(6),
                    }}
                    currency
                    disabled
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
