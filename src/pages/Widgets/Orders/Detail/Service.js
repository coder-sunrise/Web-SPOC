import React, { Component, PureComponent } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
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
} from '@/components'

class Service extends PureComponent {
  render () {
    const { theme, classes, values } = this.props
    // console.log('Service', this.props)
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='service'
              render={(args) => {
                return (
                  <Select
                    label='Service'
                    options={[
                      { value: '1', name: 'Blood Test' },
                    ]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='serviceCentre'
              render={(args) => {
                return (
                  <Select
                    label='Service Centre'
                    options={[
                      { value: '1', name: 'Consultation' },
                    ]}
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
