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
} from '@/components'

class Medication extends PureComponent {
  render () {
    const { theme, classes, consultationDocument, rowHeight } = this.props
    console.log('Medication')
    return (
      <div>
        <GridContainer>
          <GridItem xs={10}>
            <FastField
              name='type'
              render={(args) => {
                return (
                  <Select
                    label='Name'
                    options={[
                      { value: '1', name: 'Biogesic tab 500 mg' },
                    ]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <CustomInputWrapper
              label='Description'
              labelProps={{ shrink: true }}
            >
              <GridContainer gutter={1}>
                <GridItem xs={2}>
                  <Select
                    simple
                    defaultValue='1'
                    options={[
                      { value: '1', name: 'Take' },
                    ]}
                  />
                </GridItem>
                <GridItem xs={1}>
                  <Select
                    simple
                    defaultValue='1'
                    options={[
                      { value: '1', name: '1' },
                    ]}
                  />
                </GridItem>
                <GridItem xs={2}>
                  <Select
                    simple
                    defaultValue='1'
                    options={[
                      { value: '1', name: 'Tab/s' },
                    ]}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <Select
                    simple
                    defaultValue='1'
                    options={[
                      { value: '1', name: 'Every Night' },
                    ]}
                  />
                </GridItem>
                <GridItem xs={2}>
                  <Select
                    simple
                    defaultValue='1'
                    options={[
                      { value: '1', name: '2 days' },
                    ]}
                  />
                </GridItem>
              </GridContainer>
            </CustomInputWrapper>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={10}>
            <FastField
              name='precautions'
              render={(args) => {
                return (
                  <Select
                    label='Precaution'
                    defaultValue='1'
                    options={[
                      { value: '1', name: 'Discard 1 month upon opening' },
                    ]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={3}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <TextField
                    label='Quantity'
                    defaultValue='1 Bottle'
                    // suffix='Bottle'
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
                    defaultValue='20'
                    currency
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <FastField
              name='totalAfterAdj'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total After Adj'
                    defaultValue='18'
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
            {/* <Button link className={classes.editorBtn}>
              Add Diagnosis
            </Button> */}
            <RichEditor />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default Medication
