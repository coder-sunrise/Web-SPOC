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
  validationSchema: Yup.object().shape({}),

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
        code: 'ctservicecenterservice',
      },
    }).then((list) => {
      console.log(list)
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
      },
    }).then((list) => {
      console.log(list)
      // eslint-disable-next-line compat/compat
      const { services, serviceCenters } = getServices(list)
      this.setState({
        services,
        serviceCenters,
      })
      console.log(services, serviceCenters)
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

  render () {
    const { theme, classes, values = {} } = this.props
    const { services, serviceCenters } = this.state
    const { serviceFK, serviceCenterServiceFK } = values
    console.log('Service', services, serviceCenters)

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
                        !serviceCenterServiceFK ||
                        o.serviceCenters.find(
                          (m) => m.value === serviceCenterServiceFK,
                        ),
                    )}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <Field
              name='serviceCenterServiceFK'
              render={(args) => {
                return (
                  <Select
                    label='Service Centre'
                    options={serviceCenters.filter(
                      (o) =>
                        !serviceFK ||
                        o.services.find((m) => m.value === serviceFK),
                    )}
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
                return <NumberInput label='Total' currency {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='totalAfterAdj'
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
            <RichEditor placeholder='Remarks' />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default Service
