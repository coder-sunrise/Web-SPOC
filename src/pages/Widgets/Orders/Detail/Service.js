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
} from '@/components'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codetable'
import { calculateAdjustAmount } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'
import { DoctorProfileSelect } from '@/components/_medisys'

const getVisitDoctorUserId = props => {
  const { doctorprofile } = props.codetable
  const { doctorProfileFK } = props.visitRegistration.entity.visit   
  let visitDoctorUserId
  if (doctorprofile && doctorProfileFK) {
    visitDoctorUserId = doctorprofile.find(d => d.id === doctorProfileFK).clinicianProfile.userProfileFK
  }

  return visitDoctorUserId
}

@connect(({ codetable, global, user, visitRegistration }) => ({ codetable, global, user, visitRegistration }))
@withFormikExtend({
  authority: [
    'queue.consultation.order.service',
  ],
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
      if(visitRegistration && visitRegistration.entity) {
        const { doctorProfileFK } = visitRegistration.entity.visit              
        if (doctorprofile && doctorProfileFK) {
          v.performingUserFK = doctorprofile.find(d => d.id === doctorProfileFK).clinicianProfile.userProfileFK
        }
      }
    }

    return { ...v }
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
      packageGlobalId: values.packageGlobalId !== undefined ? values.packageGlobalId : '',
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
    })
  },
  displayName: 'OrderPage',
})
class Service extends PureComponent {
  constructor (props) {
    super(props)
    const { dispatch } = props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        filter: {
          'serviceFKNavigation.IsActive': true,
          'serviceCenterFKNavigation.IsActive': true,
          combineCondition: 'and',
        },
      },
    }).then((list) => {
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
            (o) => o.serviceId === serviceFK && o.isDefault,
          ) || {}

        const { unitPrice = 0 } = serviceCenterService || {}

        const opt = {
          ...c,
          combinDisplayValue: `${name} - ${code} (${currencySymbol}${unitPrice.toFixed(
            2,
          )})`,
        }
        return [
          ...p,
          opt,
        ]
      }, [])

      this.setState({
        services: newServices,
        serviceCenters,
        serviceCenterServices,
      })
      // this.setState((ps) => {
      //   return {
      //     pagination: {
      //       ...ps.pagination,
      //       ...payload,
      //     },
      //   }
      // })
    })
    // const v =
    //   field.value !== undefined && field.value !== ''
    //     ? field.value
    //     : props.value || props.defaultValue
    this.state = {
      services: [],
      serviceCenters: [],
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
            entity: {
              ...nextProps.values,
              totalPrice: nextProps.values.total,
            },
            shouldPushToState: false,
          },
        })
      }
  }

  getServiceCenterService = () => {
    const { values, setValues } = this.props
    const { serviceFK, serviceCenterFK } = values
    const obj = (serviceCenterService) => {
      return {
        ...values,
        isActive: serviceCenterService.isActive,
        serviceCenterServiceFK: serviceCenterService.serviceCenter_ServiceId,
        serviceCode: this.state.services.find((o) => o.value === serviceFK)
          .code,
        serviceName: this.state.services.find((o) => o.value === serviceFK)
          .name,
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
      }
    }

    if (serviceFK && !serviceCenterFK) {
      const serviceCenterService =
        this.state.serviceCenterServices.find(
          (o) => o.serviceId === serviceFK && o.isDefault,
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
        (o) =>
          o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
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
      ...orders.defaultService,
      type: orders.type,
      performingUserFK: getVisitDoctorUserId(this.props),
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

  render () {
    const { theme, classes, values = {}, footer, handleSubmit, setFieldValue } = this.props
    const { services, serviceCenters } = this.state
    const { serviceFK, serviceCenterFK } = values

    return (
      <div>
        <GridContainer>
          <GridItem xs={8}>
            <Field
              name='serviceFK'
              render={(args) => {
                return (
                  <div id={`autofocus_${values.type}`}>
                    <Select
                      label='Service Name'
                      labelField='combinDisplayValue'
                      options={services.filter(
                        (o) =>
                          !serviceCenterFK ||
                          o.serviceCenters.find(
                            (m) => m.value === serviceCenterFK,
                          ),
                      )}
                      onChange={() =>
                        setTimeout(() => {
                          this.getServiceCenterService()
                        }, 1)}
                      disabled={values.isPackage}
                      {...args}
                    />
                  </div>
                )
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
                          setFieldValue('total', total)
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
          <GridItem xs={8}>
            <Field
              name='serviceCenterFK'
              render={(args) => {
                return (
                  <Select
                    label='Service Center Name'
                    options={serviceCenters.filter(
                      (o) =>
                        !serviceFK ||
                        o.services.find((m) => m.value === serviceFK),
                    )}
                    onChange={() =>
                      setTimeout(() => {
                        this.getServiceCenterService()
                      }, 1)}
                    disabled={values.isPackage}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <Field
              name='total'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total'
                    style={{
                      marginLeft: theme.spacing(7),
                      paddingRight: theme.spacing(6),
                    }}
                    min={0}
                    currency
                    onChange={(e) => {
                      this.updateTotalPrice(e.target.value)
                    }}
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
              name='remark'
              render={(args) => {
                // return <RichEditor placeholder='Remarks' {...args} />
                return (
                  <TextField multiline rowsMax='5' label='Remarks' {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3} className={classes.editor}>
            <Field
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
      </div>
    )
  }
}
export default Service
