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

class Consumable extends PureComponent {
  render () {
    const { theme, classes, values } = this.props
    // console.log('Consumable', this.props)
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='name'
              render={(args) => {
                return (
                  <Select
                    label='Name'
                    options={[
                      { value: '1', name: 'Cotton' },
                    ]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={4}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput label='Quantity' step={1} min={1} {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='total'
              render={(args) => {
                return <NumberInput label='Total' currency {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
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
export default Consumable
