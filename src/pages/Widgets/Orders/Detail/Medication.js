import React, { Component, PureComponent } from 'react'

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
  withFormikExtend,
  FastField,
  FieldArray,
  Tooltip,
} from '@/components'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Yup from '@/utils/yup'

@withFormikExtend({
  mapPropsToValues: ({ orders = {}, editType, ...resetProps }) => {
    // console.log('resetProps', resetProps)
    const v = orders.entity || orders.defaultMedication
    v.editType = editType
    console.log(v)
    return v
  },
  validationSchema: Yup.object().shape({
    // stockDrugFK: Yup.string().required(),
    quantity: Yup.number().required(),
    // totalAfterItemAdjustment: Yup.number().required(),
    // totalAfterOverallAdjustment: Yup.number().required(),

    // type: Yup.string().required(),
    // to: Yup.string().when('type', {
    //   is: (val) => val !== '2',
    //   then: Yup.string().required(),
    // }),
    // from: Yup.string().required(),
    // date: Yup.date().required(),
    // subject: Yup.string().required(),
    // // 3->MC
    // days: Yup.number().when('type', {
    //   is: (val) => val === '3',
    //   then: Yup.number().required(),
    // }),
    corPrescriptionItemPrecaution: Yup.array().of(
      Yup.object().shape({
        prescriptionItemFK: Yup.number().required(),
      }),
    ),
    corPrescriptionItemInstruction: Yup.array().of(
      Yup.object().shape(
        {
          // prescriptionItemFK: Yup.number().required(),
        },
      ),
    ),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm, orders, currentType } = props
    const { rows, entity } = orders
    const data = {
      sequence: rows.length,
      ...values,
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    console.log(data)
    if (!entity) {
      resetForm(orders.defaultMedication)
    }
    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Medication extends React.Component {
  getActionItem = (i, arrayHelpers, prop, tooltip, defaultValue) => {
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
        {values[prop].length > 1 && (
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
            arrayHelpers.push(defaultValue)
          }}
        >
          <Tooltip title={tooltip}>
            <Add />
          </Tooltip>
        </Button>
      </GridItem>
    )
  }

  render () {
    const {
      theme,
      classes,
      values,
      openPrescription,
      footer,
      handleSubmit,
    } = this.props
    console.log('Medication', this.props)
    return (
      <div>
        <GridContainer>
          <GridItem xs={10}>
            {openPrescription ? (
              <FastField
                name='drugName'
                render={(args) => {
                  return <TextField label='Name' {...args} />
                }}
              />
            ) : (
              <FastField
                name='stockDrugFK'
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
            )}
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
                name='corPrescriptionItemInstruction'
                render={(arrayHelpers) => {
                  this.descriptionArrayHelpers = arrayHelpers
                  if (!values || !values.corPrescriptionItemInstruction)
                    return null
                  return values.corPrescriptionItemInstruction.map((val, i) => {
                    return (
                      <div key={i}>
                        <GridContainer>
                          {i > 0 && (
                            <GridItem xs={2}>
                              <FastField
                                name={`corPrescriptionItemInstruction[${i}].stepdose`}
                                render={(args) => {
                                  return (
                                    <Select
                                      style={{
                                        paddingLeft: 15,
                                      }}
                                      allowClear={false}
                                      simple
                                      options={[
                                        { value: 'AND', name: 'And' },
                                        { value: 'OR', name: 'Or' },
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
                              name={`corPrescriptionItemInstruction[${i}].usageMethodFK`}
                              render={(args) => {
                                return (
                                  <div style={{ position: 'relative' }}>
                                    <span
                                      style={{
                                        position: 'absolute',
                                        bottom: 4,
                                      }}
                                    >
                                      {i + 1}.
                                    </span>
                                    <CodeSelect
                                      simple
                                      allowClear={false}
                                      style={{ paddingLeft: 15 }}
                                      code='ctMedicationUsage'
                                      {...args}
                                    />
                                  </div>
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={2}>
                            <FastField
                              name={`corPrescriptionItemInstruction[${i}].dosageFK`}
                              render={(args) => {
                                return (
                                  <CodeSelect
                                    simple
                                    allowClear={false}
                                    code='ctMedicationDosage'
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={2}>
                            <FastField
                              name={`corPrescriptionItemInstruction[${i}].prescribeUOMFK`}
                              render={(args) => {
                                return (
                                  <CodeSelect
                                    simple
                                    allowClear={false}
                                    code='ctMedicationUnitOfMeasurement'
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={2}>
                            <FastField
                              name={`corPrescriptionItemInstruction[${i}].drugFrequencyFK`}
                              render={(args) => {
                                return (
                                  <CodeSelect
                                    simple
                                    allowClear={false}
                                    code='ctMedicationFrequency'
                                    {...args}
                                  />
                                )
                              }}
                            />
                          </GridItem>
                          <GridItem xs={2}>
                            <FastField
                              name={`corPrescriptionItemInstruction[${i}].duration`}
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
                          {this.getActionItem(
                            i,
                            arrayHelpers,
                            'corPrescriptionItemInstruction',
                            'Add step dose',
                            {
                              action: '1',
                              count: 1,
                              unit: '1',
                              frequency: '1',
                              day: 1,
                              precaution: '1',
                              operator: '1',
                            },
                          )}
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
                name='corPrescriptionItemPrecaution'
                render={(arrayHelpers) => {
                  if (!values || !values.corPrescriptionItemPrecaution)
                    return null
                  return values.corPrescriptionItemPrecaution.map((val, i) => {
                    return (
                      <div key={i}>
                        <GridContainer>
                          <GridItem xs={10}>
                            <FastField
                              name={`corPrescriptionItemPrecaution[${i}].prescriptionItemFK`}
                              render={(args) => {
                                return (
                                  <div style={{ position: 'relative' }}>
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: 5,
                                      }}
                                    >
                                      {i + 1}.
                                    </span>
                                    <CodeSelect
                                      style={{
                                        paddingLeft: 15,
                                      }}
                                      // label='Precaution'
                                      simple
                                      code='ctMedicationPrecaution'
                                      {...args}
                                    />
                                  </div>
                                )
                              }}
                            />
                          </GridItem>
                          {this.getActionItem(
                            i,
                            arrayHelpers,
                            'corPrescriptionItemPrecaution',
                            'Add precaution',
                            {
                              action: '1',
                              count: 1,
                              unit: '1',
                              frequency: '1',
                              day: 1,
                              precaution: '1',
                              operator: '1',
                            },
                          )}
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
          <GridItem xs={2}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    // formatter={(v) => `${v} Bottle${v > 1 ? 's' : ''}`}
                    step={1}
                    min={1}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name='uom'
              render={(args) => {
                return (
                  <CodeSelect
                    label=''
                    allowClear={false}
                    code='ctMedicationUnitOfMeasurement'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <FastField
              name='totalPrice'
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

            <FastField
              name='remarks'
              render={(args) => {
                return <RichEditor placeholder='Remarks' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='isExternalPrescription'
              render={(args) => {
                return (
                  <Checkbox
                    label='External Prescription'
                    labelPlacement='start'
                    {...args}
                  />
                )
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
export default Medication
