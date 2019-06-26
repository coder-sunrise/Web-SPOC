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
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'

class Medication extends PureComponent {
  getActionItem = (i, arrayHelpers) => {
    const { theme, values } = this.props
    return (
      <GridItem
        xs={2}
        gutter={theme.spacing(1)}
        style={{
          // lineHeight: theme.props.rowHeight,
          textAlign: 'center',
        }}
      >
        {values.items.length > 1 && (
          <Popconfirm
            title='Are you sure delete this item?'
            onConfirm={() => arrayHelpers.remove(i)}
            // okText='Yes'
            // cancelText='No'
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
              precaution: '1',
              operator: '1',
            })
          }}
        >
          <Add />
        </Button>
      </GridItem>
    )
  }

  render () {
    const { theme, classes, values } = this.props
    // console.log('Medication', this.props)
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
        <GridContainer gutter={0}>
          <GridItem xs={12}>
            <CustomInputWrapper
              label='Description'
              style={{ paddingTop: 14 }}
              labelProps={{
                shrink: true,
                style: { marginLeft: theme.spacing(1) },
              }}
            >
              <FieldArray
                name='items'
                render={(arrayHelpers) => {
                  this.descriptionArrayHelpers = arrayHelpers
                  if (!values || !values.items) return null
                  return values.items.map((val, i) => {
                    return (
                      <div key={i}>
                        <GridContainer>
                          {i > 0 && (
                            <GridItem xs={2}>
                              <FastField
                                name={`items[${i}].operator`}
                                render={(args) => {
                                  return (
                                    <Select
                                      style={{
                                        paddingLeft: 15,
                                      }}
                                      allowClear={false}
                                      simple
                                      options={[
                                        { value: '1', name: 'And' },
                                        { value: '2', name: 'Or' },
                                      ]}
                                      {...args}
                                    />
                                  )
                                }}
                              />
                            </GridItem>
                          )}
                          {i > 0 && <GridItem xs={10} />}
                          <GridItem xs={2}>
                            <FastField
                              name={`items[${i}].action`}
                              render={(args) => {
                                return (
                                  <div style={{ position: 'relative' }}>
                                    <span
                                      style={{
                                        position: 'absolute',
                                        bottom: 5,
                                      }}
                                    >
                                      {i + 1}.
                                    </span>
                                    <Select
                                      simple
                                      allowClear={false}
                                      style={{ paddingLeft: 15 }}
                                      options={[
                                        { value: '1', name: 'Take' },
                                      ]}
                                      {...args}
                                    />
                                  </div>
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={1}>
                            <FastField
                              name={`items[${i}].count`}
                              render={(args) => {
                                return (
                                  <NumberInput
                                    simple
                                    allowEmpty={false}
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
                              name={`items[${i}].unit`}
                              render={(args) => {
                                return (
                                  <Select
                                    simple
                                    allowClear={false}
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
                              name={`items[${i}].frequency`}
                              render={(args) => {
                                return (
                                  <Select
                                    simple
                                    allowClear={false}
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
                              name={`items[${i}].day`}
                              render={(args) => {
                                return (
                                  <NumberInput
                                    simple
                                    allowEmpty={false}
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
                          {this.getActionItem(i, arrayHelpers)}
                        </GridContainer>
                      </div>
                    )
                  })
                }}
              />
            </CustomInputWrapper>
          </GridItem>
        </GridContainer>

        <GridContainer gutter={0}>
          <GridItem xs={12}>
            <CustomInputWrapper
              label='Precaution'
              style={{ paddingTop: 14 }}
              labelProps={{
                shrink: true,
                style: { marginLeft: theme.spacing(1) },
              }}
            >
              <FieldArray
                name='items'
                render={(arrayHelpers) => {
                  if (!values || !values.items) return null
                  return values.items.map((val, i) => {
                    return (
                      <div key={i}>
                        <GridContainer>
                          <GridItem xs={10}>
                            <FastField
                              name={`items[${i}].precaution`}
                              render={(args) => {
                                return (
                                  <div style={{ position: 'relative' }}>
                                    <span
                                      style={{
                                        position: 'absolute',
                                        bottom: 5,
                                      }}
                                    >
                                      {i + 1}.
                                    </span>
                                    <Select
                                      style={{
                                        paddingLeft: 15,
                                      }}
                                      // label='Precaution'
                                      simple
                                      options={[
                                        {
                                          value: '1',
                                          name: 'Discard 1 month upon opening',
                                        },
                                        {
                                          value: '2',
                                          name: 'Discard 3 days upon opening',
                                        },
                                      ]}
                                      {...args}
                                    />
                                  </div>
                                )
                              }}
                            />
                          </GridItem>
                          {this.getActionItem(i, arrayHelpers)}
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
          <GridItem xs={4}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    formatter={(v) => `${v} Bottle${v > 1 ? 's' : ''}`}
                    step={1}
                    min={1}
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
                return <NumberInput label='Total' currency {...args} />
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
            <RichEditor placeholder='Remarks' />
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
