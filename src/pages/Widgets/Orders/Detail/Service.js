import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { getServices } from '@/utils/codes'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  RichEditor,
  NumberInput,
  CustomInputWrapper,
  Popconfirm,
  FastField,
  Field,
  withFormikExtend,
} from '@/components'
import Yup from '@/utils/yup'

@connect(({ codetable }) => ({ codetable }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, editType, ...resetProps }) => {
    const v = orders.entity || orders.defaultService
    v.editType = editType
    return v
  },
  validationSchema: Yup.object().shape({
    serviceFK: Yup.number().required(),
    serviceCenterFK: Yup.number().required(),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm, orders, editType } = props
    const { rows, entity } = orders

    const data = {
      sequence: rows.length,
      ...values,
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    resetForm({
      ...orders.defaultService,
      editType,
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
      },
    }).then((list) => {
      console.log(list)
      // eslint-disable-next-line compat/compat
      const { services, serviceCenters, serviceCenterServices } = getServices(
        list,
      )
      this.setState({
        services,
        serviceCenters,
        serviceCenterServices,
      })
      console.log(services, serviceCenters, serviceCenterServices)
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

  getServiceCenterService = () => {
    const { values, setFieldValue, setValues } = this.props
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
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
      })
      this.updateTotalValue(serviceCenterService.unitPrice)
    }
  }

  updateTotalValue = (v) => {
    this.props.setFieldValue('totalAfterOverallAdjustment', v)
    this.props.dispatch({
      type: 'orders/updateState',
      payload: {
        totalPrice: v,
        totalAfterAdj: undefined,
      },
    })
  }

  render () {
    const {
      theme,
      orders,
      classes,
      values = {},
      footer,
      handleSubmit,
    } = this.props
    const { services, serviceCenters } = this.state
    const { serviceFK, serviceCenterFK } = values
    // console.log('Service', services, serviceCenters)

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
                    currency
                    onChange={(e) => {
                      this.updateTotalValue(e.target.value)
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <Field
              name='totalAfterOverallAdjustment'
              render={(args) => {
                if (
                  orders.totalAfterAdj &&
                  args.field.value !== orders.totalAfterAdj
                ) {
                  args.form.setFieldValue(
                    'totalAfterOverallAdjustment',
                    orders.totalAfterAdj,
                  )
                }
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
                return <RichEditor placeholder='Remarks' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
        })}
      </div>
    )
  }
}
export default Service
