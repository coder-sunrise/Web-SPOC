import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { isNumber } from 'util'
import {
  GridContainer,
  GridItem,
  TextField,
  Select,
  NumberInput,
  FastField,
  Field,
  withFormikExtend,
  Switch,
  Checkbox,
  RadioGroup,
  LocalSearchSelect,
} from '@/components'
import Authorized from '@/utils/Authorized'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codetable'
import {
  VISIT_TYPE,
  CANNED_TEXT_TYPE,
  NURSE_WORKITEM_STATUS,
} from '@/utils/constants'
import { calculateAdjustAmount } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import { GetOrderItemAccessRight } from '@/pages/Widgets/Orders/utils'
import { DoctorProfileSelect } from '@/components/_medisys'
import CannedTextButton from './CannedTextButton'
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

@connect(({ codetable, global, user, visitRegistration, patient }) => ({
  codetable,
  global,
  user,
  visitRegistration,
  patient,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type, codetable, visitRegistration }) => {
    const v = {
      ...(orders.entity || orders.defaultService),
    }

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
    serviceFK: Yup.number().required(),
    serviceCenterFK: Yup.number().required(),
    quantity: Yup.number().required(),
    total: Yup.number().required(),
    totalAfterItemAdjustment: Yup.number().min(
      0.0,
      'The amount should be more than 0.00',
    ),
    performingUserFK: Yup.number().required(),
  }),

  handleSubmit: (values, { props, onConfirm, setValues }) => {
    const { dispatch, orders, currentType, getNextSequence, user } = props
    const { rows } = orders
    const data = {
      isOrderedByDoctor:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
      sequence: getNextSequence(),
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
      adjValue:
        values.adjAmount < 0
          ? -Math.abs(values.adjValue)
          : Math.abs(values.adjValue),
      packageGlobalId:
        values.packageGlobalId !== undefined ? values.packageGlobalId : '',
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
    setValues({
      ...orders.defaultService,
      type: orders.type,
      performingUserFK: getVisitDoctorUserId(props),
      visitPurposeFK: orders.visitPurposeFK,
    })
  },
  displayName: 'OrderPage',
})
class Service extends PureComponent {
  constructor(props) {
    super(props)
    const { dispatch } = props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        force: true,
        filter: {
          'serviceFKNavigation.IsActive': true,
          'serviceCenterFKNavigation.IsActive': true,
          combineCondition: 'and',
          apiCriteria: { ServiceCenterType: 'Normal' },
        },
      },
    }).then(list => {
      // eslint-disable-next-line compat/compat
      const {
        services = [],
        serviceCenters = [],
        serviceCenterServices = [],
      } = getServices(list)

      const newServices = services.reduce((p, c) => {
        const { value: serviceFK, name, code } = c

        const serviceCenterService =
          serviceCenterServices.find(
            o => o.serviceId === serviceFK && o.isDefault,
          ) || {}

        const { unitPrice = 0 } = serviceCenterService || {}

        const opt = {
          ...c,
          combinDisplayValue: `${name} - ${code} (${currencySymbol}${unitPrice.toFixed(
            2,
          )})`,
        }
        return [...p, opt]
      }, [])

      this.setState({
        services: newServices,
        serviceCenters,
        serviceCenterServices,
      })
    })
    this.state = {
      services: [],
      serviceCenters: [],
      isPreOrderItemExists: false,
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
              entity: {
                ...nextProps.values,
                totalPrice: nextProps.values.total,
              },
              shouldPushToState: false,
            },
          })
        }
      }
  }

  getServiceCenterService = () => {
    const { values, setValues } = this.props
    const { serviceFK, serviceCenterFK } = values
    const obj = serviceCenterService => {
      return {
        ...values,
        isActive: serviceCenterService.isActive,
        serviceCenterServiceFK: serviceCenterService.serviceCenter_ServiceId,
        serviceCode: this.state.services.find(o => o.value === serviceFK).code,
        serviceName: this.state.services.find(o => o.value === serviceFK).name,
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
        isDisplayValueChangable: this.state.services.find(
          o => o.value === serviceFK,
        ).isDisplayValueChangable,
      }
    }

    if (serviceFK && !serviceCenterFK) {
      const serviceCenterService =
        this.state.serviceCenterServices.find(
          o => o.serviceId === serviceFK && o.isDefault,
        ) || {}
      if (serviceCenterService) {
        setValues({
          ...obj(serviceCenterService),
          serviceCenterFK: serviceCenterService.serviceCenterId,
          isMinus: true,
          isExactAmount: true,
          adjValue: 0,
        })
        this.updateTotalPrice(serviceCenterService.unitPrice)
      }
      return
    }
    if (!serviceCenterFK || !serviceFK) return

    const serviceCenterService =
      this.state.serviceCenterServices.find(
        o => o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
      ) || {}
    if (serviceCenterService) {
      setValues({
        ...obj(serviceCenterService),
        isMinus: true,
        isExactAmount: true,
        adjValue: 0,
      })
      this.updateTotalPrice(serviceCenterService.unitPrice)
    }
  }

  updateTotalPrice = v => {
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
      ...orders.defaultService,
      type: orders.type,
      performingUserFK: getVisitDoctorUserId(this.props),
      visitPurposeFK: orders.visitPurposeFK,
    })
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
    const { isExactAmount, adjValue, total = 0 } = values
    const finalAmount = calculateAdjustAmount(
      isExactAmount,
      total,
      value || adjValue,
    )

    setFieldValue('totalAfterItemAdjustment', finalAmount.amount)
    setFieldValue('adjAmount', finalAmount.adjAmount)
    setFieldValue('adjType', isExactAmount ? 'ExactAmount' : 'Percentage')
  }

  validateAndSubmitIfOk = async () => {
    const { handleSubmit, validateForm } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)
    if (isFormValid) {
      handleSubmit()
      return true
    }
    return false
  }

  checkIsPreOrderItemExistsInListing = isPreOrderChecked => {
    const {
      setFieldValue,
      values,
      codetable,
      visitRegistration,
      patient,
      orders = {},
    } = this.props
    if (isPreOrderChecked) {
      const servicePreOrderItem = patient?.entity?.pendingPreOrderItem.filter(
        x => x.preOrderItemType === 'Service' || x.preOrderItemType === 'Lab',
      )
      if (servicePreOrderItem) {
        servicePreOrderItem.filter(item => {
          const { preOrderServiceItem = {} } = item
          const CheckIfPreOrderItemExists =
            preOrderServiceItem.serviceFK === values.serviceFK
          if (CheckIfPreOrderItemExists) {
            this.setState({ isPreOrderItemExists: true })
            return
          }
        })
      }
    } else {
      this.setState({ isPreOrderItemExists: false })
    }
  }

  matchServiceSearch = (option, input) => {
    const lowerCaseInput = input.toLowerCase()
    return (
      option.code.toLowerCase().indexOf(lowerCaseInput) >= 0 ||
      option.name.toLowerCase().indexOf(lowerCaseInput) >= 0
    )
  }

  render() {
    const {
      theme,
      classes,
      values = {},
      footer,
      from,
      setFieldValue,
      orders,
    } = this.props
    const { services, serviceCenters, isPreOrderItemExists } = this.state
    const {
      serviceFK,
      serviceCenterFK,
      isPreOrder,
      workitem = {},
      priority,
    } = values

    const totalPriceReadonly =
      Authorized.check('queue.consultation.modifyorderitemtotalprice')
        .rights !== 'enable'

    const isDisabledHasPaidPreOrder =
      orders.entity?.actualizedPreOrderItemFK && orders.entity?.hasPaid == true
        ? true
        : false

    const isDisabledNoPaidPreOrder = orders.entity?.actualizedPreOrderItemFK
      ? true
      : false

    if (orders.isPreOrderItemExists === false && !values.isPreOrder)
      this.setState({ isPreOrderItemExists: false })

    const totalAfterAdjElement = (
      <GridItem xs={3} className={classes.editor}>
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
                currency
                disabled
                {...args}
              />
            )
          }}
        />
      </GridItem>
    )

    const { nurseWorkitem = {} } = workitem
    const isStartedService =
      !isPreOrder && nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
    return (
      <Authorized
        authority={GetOrderItemAccessRight(
          from,
          'queue.consultation.order.service',
        )}
      >
        <div>
          <GridContainer>
            <GridItem xs={4}>
              <Field
                name='serviceFK'
                render={args => {
                  return (
                    <div id={`autofocus_${values.type}`}>
                      <LocalSearchSelect
                        valueField='value'
                        label='Service Name'
                        labelField='combinDisplayValue'
                        options={services.filter(
                          o =>
                            !serviceCenterFK ||
                            o.serviceCenters.find(
                              m => m.value === serviceCenterFK,
                            ),
                        )}
                        onChange={(v, op) => {
                          if (!op) {
                            setFieldValue('isNurseActualizeRequired', undefined)
                            setFieldValue('serviceCenterFK', undefined)
                          } else {
                            setFieldValue(
                              'isNurseActualizeRequired',
                              op.isNurseActualizable,
                            )
                          }

                          if (values.isPreOrder)
                            this.props.setFieldValue('isPreOrder', false)
                          if (isPreOrderItemExists)
                            this.setState({ isPreOrderItemExists: false })

                          setTimeout(() => {
                            this.getServiceCenterService()
                          }, 1)
                        }}
                        disabled={
                          values.isPackage ||
                          isDisabledNoPaidPreOrder ||
                          isStartedService
                        }
                        matchSearch={this.matchServiceSearch}
                        {...args}
                      />
                    </div>
                  )
                }}
              />
            </GridItem>
            <GridItem xs={4}>
              <Field
                name='serviceCenterFK'
                render={args => {
                  return (
                    <Select
                      label='Service Center Name'
                      options={serviceCenters.filter(
                        o =>
                          !serviceFK ||
                          o.services.find(m => m.value === serviceFK),
                      )}
                      onChange={() =>
                        setTimeout(() => {
                          this.getServiceCenterService()
                        }, 1)
                      }
                      disabled={
                        values.isPackage ||
                        isDisabledNoPaidPreOrder ||
                        isStartedService
                      }
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {values.isPackage && (
              <React.Fragment>
                <GridItem xs={3}>
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
                <GridItem xs={1}>
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
              <GridItem xs={3}>
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
                        min={values.minQuantity}
                        onChange={e => {
                          if (values.unitPrice) {
                            const total = e.target.value * values.unitPrice
                            setFieldValue('total', total)
                            this.updateTotalPrice(total)
                          }
                        }}
                        disabled={isDisabledHasPaidPreOrder || isStartedService}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            )}
          </GridContainer>
          <GridContainer>
            <GridItem
              xs={8}
              className={classes.editor}
              style={{ paddingRight: 35 }}
            >
              <div style={{ position: 'relative' }}>
                <FastField
                  name='instruction'
                  render={args => {
                    return (
                      <TextField
                        label='Instructions'
                        {...args}
                        disabled={isStartedService}
                      />
                    )
                  }}
                />
                <CannedTextButton
                  disabled={isStartedService}
                  cannedTextTypeFK={CANNED_TEXT_TYPE.SERVICEINSTRUCTION}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -35,
                  }}
                  handleSelectCannedText={cannedText => {
                    const instruction = `${
                      values.instruction ? values.instruction + ' ' : ''
                    }${cannedText.text || ''}`.substring(0, 2000)
                    setFieldValue('instruction', instruction)
                  }}
                />
              </div>
            </GridItem>
            <GridItem xs={3}>
              <Field
                name='total'
                render={args => {
                  return (
                    <NumberInput
                      label='Total'
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
                      min={0}
                      currency
                      onChange={e => {
                        this.updateTotalPrice(e.target.value)
                      }}
                      disabled={
                        totalPriceReadonly ||
                        values.isPackage ||
                        isDisabledHasPaidPreOrder
                      }
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
                name='remark'
                render={args => {
                  return (
                    <TextField
                      rowsMax='5'
                      label='Remarks'
                      {...args}
                      disabled={isStartedService}
                    />
                  )
                }}
              />
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
                          onChange={() => {
                            setTimeout(() => {
                              this.onAdjustmentConditionChange()
                            }, 1)
                          }}
                          disabled={
                            totalPriceReadonly ||
                            values.isPackage ||
                            isDisabledHasPaidPreOrder
                          }
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
                          noSuffix
                          label='Adjustment'
                          onChange={() => {
                            setTimeout(() => {
                              this.onAdjustmentConditionChange()
                            }, 1)
                          }}
                          disabled={
                            totalPriceReadonly ||
                            values.isPackage ||
                            isDisabledHasPaidPreOrder
                          }
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
                        noSuffix
                        max={100}
                        label='Adjustment'
                        onChange={() => {
                          setTimeout(() => {
                            this.onAdjustmentConditionChange()
                          }, 1)
                        }}
                        disabled={
                          totalPriceReadonly ||
                          values.isPackage ||
                          isDisabledHasPaidPreOrder
                        }
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
                        disabled={
                          totalPriceReadonly ||
                          values.isPackage ||
                          isDisabledHasPaidPreOrder
                        }
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
              {values.isDisplayValueChangable && (
                <FastField
                  name='newServiceName'
                  render={args => {
                    return (
                      <TextField
                        rowsMax='5'
                        maxLength={200}
                        label='New Service Name'
                        disabled={isStartedService}
                        {...args}
                      />
                    )
                  }}
                />
              )}
            </GridItem>
            {values.isDisplayValueChangable && totalAfterAdjElement}
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor}>
              {values.isPackage ? (
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
              ) : (
                <div>
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        position: 'absolute',
                        bottom: '4px',
                        fontWeight: 500,
                      }}
                    >
                      Priority:{' '}
                    </span>
                    <div style={{ marginLeft: 60, marginTop: 14 }}>
                      <RadioGroup
                        disabled={isStartedService}
                        value={priority || 'Normal'}
                        label=''
                        onChange={e => {
                          setFieldValue('priority', e.target.value)
                        }}
                        options={[
                          {
                            value: 'Normal',
                            label: 'Normal',
                          },
                          {
                            value: 'Urgent',
                            label: 'Urgent',
                          },
                        ]}
                      />
                    </div>
                  </div>
                  {values.visitPurposeFK !== VISIT_TYPE.OTC && (
                    <div style={{ display: 'inline-block', marginLeft: 20 }}>
                      <Field
                        name='isPreOrder'
                        render={args => {
                          return (
                            <Checkbox
                              label='Pre-Order'
                              style={{ position: 'absolute', bottom: 2 }}
                              {...args}
                              disabled={
                                isDisabledNoPaidPreOrder || isStartedService
                              }
                              onChange={e => {
                                if (!e.target.value) {
                                  setFieldValue('isChargeToday', false)
                                }
                                this.checkIsPreOrderItemExistsInListing(
                                  e.target.value,
                                )
                              }}
                            />
                          )
                        }}
                      />
                      {isPreOrder && (
                        <FastField
                          name='isChargeToday'
                          render={args => {
                            return (
                              <Checkbox
                                style={{
                                  position: 'absolute',
                                  bottom: 2,
                                  left: '380px',
                                }}
                                label='Charge Today'
                                {...args}
                              />
                            )
                          }}
                        />
                      )}
                      {isPreOrderItemExists && (
                        <Alert
                          message={
                            "Item exists in Pre-Order. Plesae check patient's Pre-Order."
                          }
                          type='warning'
                          style={{
                            position: 'absolute',
                            top: 40,
                            left: 230,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            overflow: 'hidden',
                            lineHeight: '25px',
                            fontSize: '0.85rem',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </GridItem>
            {!values.isDisplayValueChangable && totalAfterAdjElement}
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
export default Service
