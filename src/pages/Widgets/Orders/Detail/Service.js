import React, { PureComponent } from 'react'
import { connect } from 'dva'

import {
  GridContainer,
  GridItem,
  TextField,
  Select,
  NumberInput,
  FastField,
  Field,
  withFormikExtend,
} from '@/components'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codes'
import { calculateAdjustAmount } from '@/utils/utils'

@connect(({ codetable, global }) => ({ codetable, global }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultService),
      type,
    }
    return v
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    serviceFK: Yup.number().required(),
    serviceCenterFK: Yup.number().required(),
    total: Yup.number().required(),
  }),

  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, orders, currentType } = props
    const { rows } = orders
    const data = {
      sequence: rows.length,
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
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
          combineCondition: 'or',
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
    if (
      (!this.props.global.openAdjustment && nextProps.global.openAdjustment) ||
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

  getServiceCenterService = () => {
    const { values, setValues } = this.props
    const { serviceFK, serviceCenterFK } = values

    if (!serviceCenterFK || !serviceFK) return
    const serviceCenterService =
      this.state.serviceCenterServices.find(
        (o) =>
          o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
      ) || {}
    if (serviceCenterService) {
      setValues({
        ...values,
        serviceCenterServiceFK: serviceCenterService.serviceCenter_ServiceId,
        serviceCode: this.state.services.find((o) => o.value === serviceFK)
          .code,
        serviceName: this.state.services.find((o) => o.value === serviceFK)
          .name,
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
      })
      this.updateTotalPrice(serviceCenterService.unitPrice)
    }
  }

  updateTotalPrice = (v) => {
    if (v !== undefined) {
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

  render () {
    const { theme, classes, values = {}, footer, handleSubmit } = this.props
    const { services, serviceCenters } = this.state
    const { serviceFK, serviceCenterFK } = values

    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Field
              name='serviceFK'
              render={(args) => {
                return (
                  <Select
                    label='Service'
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
          <GridItem xs={12}>
            <Field
              name='serviceCenterFK'
              render={(args) => {
                return (
                  <Select
                    label='Service Centre'
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
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='total'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total'
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
          <GridItem xs={6}>
            <Field
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
          <GridItem xs={12} className={classes.editor}>
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
