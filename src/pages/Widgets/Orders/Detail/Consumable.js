import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { isNumber } from 'util'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  NumberInput,
  FastField,
  withFormikExtend,
  Field,
  DatePicker,
  Switch,
  Checkbox,
  LocalSearchSelect,
} from '@/components'
import { VISIT_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import { GetOrderItemAccessRight } from '@/pages/Widgets/Orders/utils'
import moment from 'moment'
import LowStockInfo from './LowStockInfo'
import { DoctorProfileSelect } from '@/components/_medisys'
import { Alert } from 'antd'

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

@connect(({ global, codetable, user, visitRegistration, patient }) => ({
  global,
  codetable,
  user,
  visitRegistration,
  patient,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type, codetable, visitRegistration }) => {
    const v = { ...(orders.entity || orders.defaultConsumable) }

    if (v.uid) {
      if (v.adjAmount <= 0) {
        v.adjValue = Math.abs(v.adjValue)
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

    return { ...v, type, visitPurposeFK: orders.visitPurposeFK }
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    totalPrice: Yup.number().required(),
    quantity: Yup.number().required(),
    totalAfterItemAdjustment: Yup.number().min(
      0.0,
      'The amount should be more than 0.00',
    ),
    performingUserFK: Yup.number().required(),
    expiryDate: Yup.date().min(moment(), 'EXPIRED!'),
  }),

  handleSubmit: (values, { props, onConfirm, setValues }) => {
    const {
      dispatch,
      currentType,
      getNextSequence,
      user,
      orders,
      codetable,
    } = props
    const { inventoryconsumable = [] } = codetable
    let { batchNo } = values
    if (batchNo instanceof Array) {
      if (batchNo && batchNo.length > 0) {
        batchNo = batchNo[0]
      }
    }

    const consumable = inventoryconsumable.find(
      c => c.id === values.inventoryConsumableFK,
    )
    values.consumableName = consumable?.displayValue
    values.unitOfMeasurement = consumable?.uom?.name

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
      ...orders.defaultConsumable,
      type: orders.type,
      performingUserFK: getVisitDoctorUserId(props),
      visitPurposeFK: orders.visitPurposeFK,
    })
  },
  displayName: 'OrderPage',
})
class Consumable extends PureComponent {
  constructor(props) {
    super(props)

    let selectedConsumable = {
      consumableStock: [],
    }

    const { codetable, values } = this.props
    const { inventoryconsumable = [] } = codetable
    const { inventoryConsumableFK } = values

    const consumable = inventoryConsumableFK
      ? inventoryconsumable.find(item => item.id === inventoryConsumableFK)
      : undefined

    if (consumable) selectedConsumable = consumable
    this.state = {
      selectedConsumable,
      batchNo: '',
      expiryDate: '',
    }
  }

  getConsumableOptions = () => {
    const {
      codetable: { inventoryconsumable = [] },
    } = this.props
    return inventoryconsumable
      .filter(m => m.orderable)
      .reduce((p, c) => {
        const { code, displayValue, sellingPrice = 0, uom = {} } = c
        const { name: uomName = '' } = uom
        let opt = {
          ...c,
          combinDisplayValue: `${displayValue} - ${code} (${currencySymbol}${sellingPrice.toFixed(
            2,
          )} / ${uomName})`,
        }
        return [...p, opt]
      }, [])
  }

  changeConsumable = (v, op = {}) => {
    const { setFieldValue, values, disableEdit } = this.props

    let defaultBatch
    if (op.consumableStock) {
      defaultBatch = op.consumableStock.find(o => o.isDefault === true)
      if (defaultBatch)
        this.setState({
          batchNo: defaultBatch.batchNo,
          expiryDate: defaultBatch.expiryDate,
        })
    }
    this.setState({
      selectedConsumable: op,
    })
    if (disableEdit === false) {
      setFieldValue('batchNo', defaultBatch ? defaultBatch.batchNo : undefined)
      setFieldValue(
        'expiryDate',
        defaultBatch ? defaultBatch.expiryDate : undefined,
      )
    }
    setFieldValue('isActive', true)
    setFieldValue('consumableCode', op.code)
    setFieldValue('consumableName', op.displayValue)
    setFieldValue('unitOfMeasurement', op.uom ? op.uom.name : undefined)

    setFieldValue('isMinus', true)
    setFieldValue('isExactAmount', true)
    setFieldValue('adjValue', 0)

    // 17882
    let unitprice = op.sellingPrice || 0
    setFieldValue('unitPrice', unitprice)
    setFieldValue('totalPrice', unitprice * values.quantity)
    this.updateTotalPrice(unitprice * values.quantity)
    this.onExpiryDateChange()
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
    } else {
      this.props.setFieldValue('totalAfterItemAdjustment', undefined)
      this.props.setFieldValue('adjAmount', undefined)
    }
  }

  handleReset = () => {
    const { setValues, orders } = this.props
    setValues({
      ...orders.defaultConsumable,
      type: orders.type,
      performingUserFK: getVisitDoctorUserId(this.props),
      visitPurposeFK: orders.visitPurposeFK,
    })
  }

  componentDidMount = async () => {
    const { codetable, dispatch } = this.props
    const { inventoryconsumable = [] } = codetable
    if (inventoryconsumable.length <= 0) {
      await dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'inventoryconsumable' },
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
        if (nextProps.values.uid) {
          nextProps.dispatch({
            type: 'orders/updateState',
            payload: {
              entity: nextProps.values,
              shouldPushToState: false,
            },
          })
        }
      }

    const { values: nextValues } = nextProps
    const { values: currentValues } = this.props

    if (
      !!nextValues.id &&
      nextValues.id !== currentValues.id &&
      nextValues.type === '4'
    ) {
      const { codetable } = this.props
      const { inventoryconsumable = [] } = codetable
      const { inventoryConsumableFK } = nextValues

      const consumable = inventoryConsumableFK
        ? inventoryconsumable.find(item => item.id === inventoryConsumableFK)
        : undefined
      if (consumable)
        this.setState({
          selectedConsumable: consumable,
        })
      else
        this.setState({
          selectedConsumable: {
            consumableStock: [],
          },
        })
    }
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

  onAdjustmentConditionChange = v => {
    const { values } = this.props
    const { isMinus, adjValue, isExactAmount } = values
    if (!isNumber(adjValue)) {
      this.props.setFieldValue('adjValue', 0)
    }

    let value = adjValue || 0
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

  onExpiryDateChange = () => {
    window.setTimeout(async () => {
      const { handleSubmit, validateForm } = this.props
      const validateResult = await validateForm()
      const isFormValid = _.isEmpty(validateResult)
      if (!isFormValid) {
        handleSubmit()
      }
    }, 300)
  }

  matchSearch = (option, input) => {
    const lowerCaseInput = input.toLowerCase()
    return (
      option.code.toLowerCase().indexOf(lowerCaseInput) >= 0 ||
      option.displayValue.toLowerCase().indexOf(lowerCaseInput) >= 0
    )
  }

  render() {
    const {
      theme,
      values,
      footer,
      handleSubmit,
      setFieldValue,
      classes,
      disableEdit,
      from,
      orders,
    } = this.props

    const totalPriceReadonly =
      Authorized.check('queue.consultation.modifyorderitemtotalprice')
        .rights !== 'enable'

    return (
      <Authorized
        authority={GetOrderItemAccessRight(
          from,
          'queue.consultation.order.consumable',
        )}
      >
        <div>
          <GridContainer>
            <GridItem xs={8}>
              <Field
                name='inventoryConsumableFK'
                render={args => {
                  return (
                    <div
                      id={`autofocus_${values.type}`}
                      style={{ position: 'relative' }}
                    >
                      <LocalSearchSelect
                        temp
                        label='Consumable Name'
                        labelField='combinDisplayValue'
                        onChange={this.changeConsumable}
                        options={this.getConsumableOptions()}
                        {...args}
                        matchSearch={this.matchSearch}
                      />
                      <LowStockInfo sourceType='consumable' {...this.props} />
                    </div>
                  )
                }}
              />
            </GridItem>
            {
              <GridItem xs={3}>
                <FastField
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
                        min={1}
                        onChange={e => {
                          const { values } = this.props
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
            }
          </GridContainer>

          <GridContainer>
            {false && (
              <GridItem xs={4} className={classes.editor}>
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
                        options={this.state.selectedConsumable.consumableStock}
                        onChange={(e, op = {}) => {
                          if (op && op.length > 0) {
                            const { expiryDate } = op[0]
                            setFieldValue(`expiryDate`, expiryDate)
                          } else {
                            setFieldValue(`expiryDate`, undefined)
                          }
                          this.onExpiryDateChange()
                        }}
                        disabled={disableEdit}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            )}
            {false && (
              <GridItem xs={4} className={classes.editor}>
                <FastField
                  name='expiryDate'
                  render={args => {
                    return (
                      <DatePicker
                        label='Expiry Date'
                        onChange={() => {
                          this.onExpiryDateChange()
                        }}
                        disabled={disableEdit}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            )}
            <GridItem xs={8} className={classes.editor}>
              <FastField
                name='remark'
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
                      currency
                      onChange={e => {
                        this.updateTotalPrice(e.target.value)
                      }}
                      min={0}
                      disabled={totalPriceReadonly}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor}></GridItem>
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
                          onChange={() => {
                            setTimeout(() => {
                              this.onAdjustmentConditionChange()
                            }, 1)
                          }}
                          disabled={totalPriceReadonly}
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
                    args.precision = 2
                    if (values.isExactAmount) {
                      return (
                        <NumberInput
                          style={{
                            marginLeft: theme.spacing(7),
                            paddingRight: theme.spacing(6),
                          }}
                          currency
                          noSuffix
                          label='Adjustment'
                          onChange={() => {
                            setTimeout(() => {
                              this.onAdjustmentConditionChange()
                            }, 1)
                          }}
                          disabled={totalPriceReadonly}
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
                        noSuffix
                        label='Adjustment'
                        onChange={() => {
                          setTimeout(() => {
                            this.onAdjustmentConditionChange()
                          }, 1)
                        }}
                        disabled={totalPriceReadonly}
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
                        onChange={() => {
                          setTimeout(() => {
                            this.onAdjustmentConditionChange()
                          }, 1)
                        }}
                        disabled={totalPriceReadonly}
                        {...args}
                      />
                    )
                  }}
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8}></GridItem>
            <GridItem xs={3} className={classes.editor}>
              <FastField
                name='totalAfterItemAdjustment'
                render={args => {
                  return (
                    <NumberInput
                      label='Total After Adj.'
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
        </div>
      </Authorized>
    )
  }
}
export default Consumable
