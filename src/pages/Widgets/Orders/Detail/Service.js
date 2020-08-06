import React, { PureComponent } from 'react'
import { connect } from 'dva'

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

@connect(({ codetable, global }) => ({ codetable, global }))
@withFormikExtend({
  authority: [
    'queue.consultation.order.service',
  ],
  mapPropsToValues: ({ orders = {}, type }) => {
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

    return { ...v }
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    serviceFK: Yup.number().required(),
    serviceCenterFK: Yup.number().required(),
    total: Yup.number().required(),
    totalAfterItemAdjustment: Yup.number().min(
      0.0,
      'The amount should be more than 0.00',
    ),
  }),

  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, orders, currentType, getNextSequence } = props
    const { rows } = orders
    const data = {
      sequence: getNextSequence(),
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
      adjValue:
        values.adjAmount < 0
          ? -Math.abs(values.adjValue)
          : Math.abs(values.adjValue),
      unitPrice: values.total / values.quantity,
    }

    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
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
      const { services, serviceCenters, serviceCenterServices } = getServices(
        list,
      )
      this.setState({
        services,
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
      ...orders.defaultService,
      type: orders.type,
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

  render () {
    const { theme, classes, values = {}, footer, handleSubmit } = this.props
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
                  <Select
                    label='Service Name'
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
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <FastField
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
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
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
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3}>
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
                      max={999}
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
          <GridItem xs={1}>
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
          onSave: handleSubmit,
          onReset: this.handleReset,
        })}
      </div>
    )
  }
}
export default Service
