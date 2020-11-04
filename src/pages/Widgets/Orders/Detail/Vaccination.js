import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import { isNumber } from 'util'
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
import { openCautionAlertPrompt } from '@/pages/Widgets/Orders/utils'
import LowStockInfo from './LowStockInfo'
import AddFromPast from './AddMedicationFromPast'
import { DoctorProfileSelect } from '@/components/_medisys'

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
  mapPropsToValues: ({ orders = {}, type, codetable, visitRegistration }) => {
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

    if (_.isEmpty(orders.entity)) {
      const { doctorprofile } = codetable
      if(visitRegistration && visitRegistration.entity) {
        const { doctorProfileFK } = visitRegistration.entity.visit      
        if (doctorprofile && doctorProfileFK) {
          newOrders.performingUserFK = doctorprofile.find(d => d.id === doctorProfileFK).clinicianProfile.userProfileFK
        }
      }
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
    performingUserFK: Yup.number().required(),
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
      packageGlobalId: values.packageGlobalId !== undefined ? values.packageGlobalId : '',
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
    if (values.isPackage) return
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
      const { isExactAmount, isMinus, adjValue, isPackage } = this.props.values
      if (isPackage) return

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

  validateAndSubmitIfOk = async (callback) => {
    const { handleSubmit, validateForm, dispatch, values } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)
    const { editingVaccinationFK, inventoryVaccinationFK } = values

    if (isFormValid) {
      const { caution = '', code, displayValue } =
        this.state.selectedVaccination || {}
      const needShowAlert =
        caution.trim().length > 0 &&
        editingVaccinationFK !== inventoryVaccinationFK

      if (needShowAlert) {
        openCautionAlertPrompt(
          [
            { subject: displayValue || code, caution },
          ],
          () => {
            handleSubmit()
            if (callback) callback(true)
          },
        )
      } else {
        handleSubmit()
        return true
      }
    }
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
                      disabled={values.isPackage}
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
          {values.isPackage && (
            <React.Fragment>
              <GridItem xs={3}>
                <Field
                  name='packageConsumeQuantity'
                  render={(args) => {
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
                        disabled={this.props.visitRegistration.entity.visit.isInvoiceFinalized}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={1}>
                <Field
                  name='remainingQuantity'
                  render={(args) => {
                    return (
                      <NumberInput
                        style={{
                          marginTop: theme.spacing(3),
                        }}
                        formatter={(v) => `/ ${parseFloat(v).toFixed(1)}`}
                        // prefix='/'
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
            <GridItem xs={3}>
              <Field
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
          )}
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
            <Field
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
                    disabled={values.isPackage}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={8} className={classes.editor}>
            <Field
              name='performingUserFK'
              render={(args) => (
                <DoctorProfileSelect
                  label='Performed By'
                  {...args}
                  valueField='clinicianProfile.userProfileFK'
                />
              )}
            />
          </GridItem>          
          <GridItem xs={3} className={classes.editor}>
            <div style={{ position: 'relative' }}>
              <div
                style={{ marginTop: theme.spacing(2), position: 'absolute' }}
              >
                <Field
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
                        disabled={values.isPackage}
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
                        disabled={values.isPackage}
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
                      disabled={values.isPackage}
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
                      disabled={values.isPackage}
                      {...args}
                    />
                  )
                }}
              />
            </div>
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
          <GridItem xs={3} className={classes.editor} v>
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
