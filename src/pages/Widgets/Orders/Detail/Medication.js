import React, { Component, PureComponent } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { Popconfirm, message } from 'antd'
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
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'

class Medication extends PureComponent {
  render () {
    const { theme, classes, values, consultationDocument } = this.props
    console.log('Medication', this.props)
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
              <FieldArray
                name='descriptions'
                render={(arrayHelpers) => {
                  // this.arrayHelpers = arrayHelpers
                  if (!values || !values.descriptions) return null
                  return values.descriptions.map((val, i) => {
                    return (
                      <div key={i}>
                        <GridContainer gutter={1}>
                          <GridItem xs={2}>
                            <FastField
                              name={`descriptions[${i}].action`}
                              render={(args) => {
                                return (
                                  <Select
                                    label=''
                                    options={[
                                      { value: '1', name: 'Take' },
                                    ]}
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={1}>
                            <FastField
                              name={`descriptions[${i}].count`}
                              render={(args) => {
                                return (
                                  <NumberInput
                                    label=''
                                    step={0.5}
                                    min={0.5}
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={2}>
                            <FastField
                              name={`descriptions[${i}].unit`}
                              render={(args) => {
                                return (
                                  <Select
                                    label=''
                                    options={[
                                      { value: '1', name: 'Tab/s' },
                                    ]}
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={3}>
                            <FastField
                              name={`descriptions[${i}].frequency`}
                              render={(args) => {
                                return (
                                  <Select
                                    label=''
                                    options={[
                                      { value: '1', name: 'Every Night' },
                                    ]}
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={2}>
                            <FastField
                              name={`descriptions[${i}].day`}
                              render={(args) => {
                                return (
                                  <NumberInput
                                    label=''
                                    formatter={(v) =>
                                      `${v} Day${v > 1 ? 's' : ''}`}
                                    step={1}
                                    min={1}
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem
                            xs={2}
                            style={{
                              lineHeight: theme.props.rowHeight,
                              textAlign: 'center',
                            }}
                          >
                            {values.descriptions.length > 1 && (
                              <Popconfirm
                                title='Are you sure delete this item?'
                                onConfirm={() => arrayHelpers.remove(i)}
                                okText='Yes'
                                cancelText='No'
                              >
                                <Button justIcon color='danger'>
                                  <Delete />
                                </Button>
                              </Popconfirm>
                            )}
                            <Button
                              justIcon
                              color='info'
                              onClick={() => {
                                arrayHelpers.push({
                                  action: '1',
                                  count: 1,
                                  unit: '1',
                                  frequency: '1',
                                  day: 1,
                                })
                              }}
                            >
                              <Add />
                            </Button>
                          </GridItem>
                        </GridContainer>
                      </div>
                    )
                  })
                }}
              />
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
          <GridItem xs={12}>
            <FastField
              name='externalPrescription'
              render={(args) => {
                return (
                  <Checkbox
                    label='External
                    Prescription'
                    labelPlacement='start'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default Medication
