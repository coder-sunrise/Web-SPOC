import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
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
  Field,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'

const corPrescriptionItemInstructionSchema = Yup.object().shape({
  usageMethodFK: Yup.number().required(),
  dosageFK: Yup.number().required(),
  prescribeUOMFK: Yup.number().required(),
  drugFrequencyFK: Yup.number().required(),
  duration: Yup.number().required(),
  sequence: Yup.number().required(),
  stepdose: Yup.string().required(),
})

@connect(({ global, codetable }) => ({ global, codetable }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type, ...resetProps }) => {
    const v = {
      ...(orders.entity || orders.defaultMedication),
      type,
    }
    return v
  },
  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    quantity: Yup.number().required(),
    dispenseUOMFK: Yup.number().required(),
    totalPrice: Yup.number().required(),
    type: Yup.string(),
    stockDrugFK: Yup.number().when('type', {
      is: (val) => val !== '5',
      then: Yup.number().required(),
    }),
    drugName: Yup.string().when('type', {
      is: (val) => val === '5',
      then: Yup.string().required(),
    }),
    corPrescriptionItemPrecaution: Yup.array().of(
      Yup.object().shape({
        medicationPrecautionFK: Yup.number().required(),
      }),
    ),
    corPrescriptionItemInstruction: Yup.array().of(
      Yup.object().shape({
        usageMethodFK: Yup.number().required(),
        dosageFK: Yup.number().required(),
        prescribeUOMFK: Yup.number().required(),
        drugFrequencyFK: Yup.number().required(),
        duration: Yup.number().required(),
        sequence: Yup.number().required(),
        stepdose: Yup.string().required(),
      }),
    ),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, orders, currentType } = props
    const { rows } = orders

    const data = {
      sequence: rows.length,
      ...values,
      subject: currentType.getSubject(values),
    }
    console.log('medication data ', data)
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Medication extends PureComponent {
  state = {
    stockList: [],
    selectionOptions: [],
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
            onConfirm={() => {
              arrayHelpers.remove(i)
              setTimeout(() => {
                this.calcualteQuantity()
              }, 1)
            }}
            // okText='Yes'
            // cancelText='No'
          >
            <Button justIcon color='danger'>
              <Delete />
            </Button>
          </Popconfirm>
        )}
        {values[prop].length < 3 && (
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
        )}
      </GridItem>
    )
  }

  calcualteQuantity = () => {
    const { codetable, setFieldValue, values } = this.props
    const { form } = this.descriptionArrayHelpers
    const prescriptionItem = form.values.corPrescriptionItemInstruction

    const dosageUsageList = codetable.ctmedicationdosage
    const medicationFrequencyList = codetable.ctmedicationfrequency

    let dosageMultiplier = 0
    let multipler = 0
    let newTotalQuantity = 0

    for (let i = 0; i < prescriptionItem.length; i++) {
      if (
        prescriptionItem[i].dosageFK &&
        prescriptionItem[i].drugFrequencyFK &&
        prescriptionItem[i].duration
      ) {
        for (let a = 0; a < dosageUsageList.length; a++) {
          if (dosageUsageList[a].id === prescriptionItem[i].dosageFK) {
            dosageMultiplier = dosageUsageList[a].multiplier
          }
        }

        for (let b = 0; b < medicationFrequencyList.length; b++) {
          if (
            medicationFrequencyList[b].id ===
            prescriptionItem[i].drugFrequencyFK
          ) {
            multipler = medicationFrequencyList[b].multiplier
          }
        }

        newTotalQuantity +=
          dosageMultiplier * multipler * prescriptionItem[i].duration
      }
    }

    let rounded = Math.round(newTotalQuantity * 10) / 10
    setFieldValue(`quantity`, rounded)

    const total = newTotalQuantity * values.unitPrice
    setFieldValue('totalPrice', total)
    this.updateTotalPrice(total)
  }

  changeMedication = (v, op = {}) => {
    // console.log(v, op)
    console.log('hh ', op)
    console.log("v ", v)
    const { form } = this.descriptionArrayHelpers
    const prescriptionItem = form.values.corPrescriptionItemInstruction
    let tempArray = [
      ...this.state.stockList,
    ]
    tempArray = tempArray.filter((o) => o.inventoryItemFK === v)
    this.setState(() => {
      return { selectionOptions: tempArray }
    })
    const { setFieldValue, values, codetable } = this.props
    const dosageUsageList = codetable.ctmedicationdosage
    const medicationFrequencyList = codetable.ctmedicationfrequency

    let dosageMultiplier = 0
    let multipler = 0
    let newTotalQuantity = 0
    let totalFirstItem = 0

    setFieldValue('batchNo', undefined)
    setFieldValue('expiryDate', undefined)

    setFieldValue(
      'corPrescriptionItemInstruction[0].usageMethodFK',
      op.medicationUsage ? op.medicationUsage.id : undefined,
    )
    setFieldValue(
      'corPrescriptionItemInstruction[0].dosageFK',
      op.prescribingDosage ? op.prescribingDosage.id : undefined,
    )

    setFieldValue(
      'corPrescriptionItemInstruction[0].prescribeUOMFK',
      op.prescribingUOM ? op.prescribingUOM.id : undefined,
    )

    setFieldValue(
      'corPrescriptionItemInstruction[0].drugFrequencyFK',
      op.medicationFrequency ? op.medicationFrequency.id : undefined,
    )
    setFieldValue('corPrescriptionItemInstruction[0].duration', op.duration)

    if (op.duration && op.medicationFrequency.id && op.prescribingDosage.id) {
      for (let a = 0; a < dosageUsageList.length; a++) {
        if (dosageUsageList[a].id === op.prescribingDosage.id) {
          dosageMultiplier = dosageUsageList[a].multiplier
        }
      }

      for (let b = 0; b < medicationFrequencyList.length; b++) {
        if (medicationFrequencyList[b].id === op.medicationFrequency.id) {
          multipler = medicationFrequencyList[b].multiplier
        }
      }

      totalFirstItem += dosageMultiplier * multipler * op.duration
    }

    for (let i = 1; i < prescriptionItem.length; i++) {
      if (
        prescriptionItem[i].dosageFK &&
        prescriptionItem[i].drugFrequencyFK &&
        prescriptionItem[i].duration
      ) {
        for (let a = 0; a < dosageUsageList.length; a++) {
          if (dosageUsageList[a].id === prescriptionItem[i].dosageFK) {
            dosageMultiplier = dosageUsageList[a].multiplier
          }
        }

        for (let b = 0; b < medicationFrequencyList.length; b++) {
          if (
            medicationFrequencyList[b].id ===
            prescriptionItem[i].drugFrequencyFK
          ) {
            multipler = medicationFrequencyList[b].multiplier
          }
        }

        newTotalQuantity +=
          dosageMultiplier * multipler * prescriptionItem[i].duration
      }
    }

    let rounded = Math.round((newTotalQuantity + totalFirstItem) * 10) / 10
    setFieldValue(`quantity`, rounded)

    // if (values.unitPrice) {
    //   const total = (newTotalQuantity + totalFirstItem) * values.unitPrice
    //   setFieldValue('totalPrice', total)
    //   this.updateTotalPrice(total)
    // }

    if (
      op.inventoryMedication_MedicationPrecaution &&
      op.inventoryMedication_MedicationPrecaution.length > 0
    ) {
      op.inventoryMedication_MedicationPrecaution.forEach((im, i) => {
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`,
          im.id,
        )
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].precaution`,
          im.medicationPrecaution.name,
        )
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].precautionCode`,
          im.medicationPrecaution.code,
        )
        setFieldValue(`corPrescriptionItemPrecaution[${i}].sequence`, i)
      })
    } else {
      setFieldValue(`corPrescriptionItemPrecaution`, [])
    }

    setFieldValue('dispenseUOMFK', op.dispensingUOM ? op.dispensingUOM.id : [])
    setFieldValue('drugCode', op.code)
    setFieldValue('drugName', op.displayValue)

    if (op.sellingPrice) {
      setFieldValue('unitPrice', op.sellingPrice)
      setFieldValue('totalPrice', op.sellingPrice * (newTotalQuantity + totalFirstItem))
      this.updateTotalPrice(op.sellingPrice * (newTotalQuantity + totalFirstItem))
    } else {
      setFieldValue('unitPrice', undefined)
      setFieldValue('totalPrice', undefined)
      this.updateTotalPrice(undefined)
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

  componentDidMount () {
    this.props
      .dispatch({
        type: 'orders/getStockDetails',
        payload: {
          id: 1,
        },
      })
      .then((v) => {
        if (v) {
          this.setState({ stockList: v.data })
        }
      })
  }

  render () {
    const {
      theme,
      classes,
      values,
      openPrescription,
      footer,
      handleSubmit,
      setFieldValue,
      orders,
    } = this.props
    const commonSelectProps = {
      dropdownMatchSelectWidth: false,
      dropdownStyle: {
        width: 300,
      },
    }
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
                    <CodeSelect
                      label='Name'
                      code='inventorymedication'
                      labelField='displayValue'
                      onChange={this.changeMedication}
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
            />

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
                                      marginBottom: theme.spacing(1),
                                    }}
                                    allowClear={false}
                                    simple
                                    options={[
                                      { value: 'AND', name: 'And' },
                                      { value: 'THEN', name: 'Then' },
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
                                    // simple
                                    allowClear={false}
                                    style={{ paddingLeft: 15 }}
                                    code='ctMedicationUsage'
                                    {...commonSelectProps}
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
                                  // simple
                                  allowClear={false}
                                  code='ctMedicationDosage'
                                  labelField='displayValue'
                                  {...commonSelectProps}
                                  {...args}
                                  onChange={(v, option = {}) => {
                                    setTimeout(() => {
                                      this.calcualteQuantity()
                                    }, 1)
                                  }}
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
                                  // simple
                                  allowClear={false}
                                  code='ctMedicationUnitOfMeasurement'
                                  {...commonSelectProps}
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
                                  // simple
                                  labelField='displayValue'
                                  allowClear={false}
                                  code='ctMedicationFrequency'
                                  {...commonSelectProps}
                                  {...args}
                                  onChange={(v, option = {}) => {
                                    setTimeout(() => {
                                      this.calcualteQuantity()
                                    }, 1)
                                  }}
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
                                  // simple
                                  allowEmpty={false}
                                  formatter={(v) =>
                                    `${v} Day${v > 1 ? 's' : ''}`}
                                  step={1}
                                  min={1}
                                  {...args}
                                  onChange={(v) => {
                                    setTimeout(() => {
                                      this.calcualteQuantity()
                                    }, 1)
                                  }}
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
                            drugFrequencyFK: 1,
                            duration: 1,
                            stepdose: 'AND',
                            sequence: i + 1,
                          },
                        )}
                      </GridContainer>
                    </div>
                  )
                })
              }}
            />
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
                              name={`corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`}
                              render={(args) => {
                                return (
                                  <div
                                    style={{
                                      position: 'relative',
                                      marginBottom: theme.spacing(1),
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: 3,
                                      }}
                                    >
                                      {i + 1}.
                                    </span>
                                    <CodeSelect
                                      style={{
                                        paddingLeft: 15,
                                      }}
                                      // label='Precaution'
                                      // simple
                                      code='ctMedicationPrecaution'
                                      onChange={(v, option = {}) => {
                                        // console.log(v, option)
                                        setFieldValue(
                                          `corPrescriptionItemPrecaution[${i}].precaution`,
                                          option.name,
                                        )
                                        setFieldValue(
                                          `corPrescriptionItemPrecaution[${i}].precautionCode`,
                                          option.code,
                                        )
                                        setFieldValue(
                                          `corPrescriptionItemPrecaution[${i}].sequence`,
                                          i,
                                        )
                                      }}
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
                              drugFrequencyFK: '1',
                              day: 1,
                              precaution: '1',
                              sequence: i + 1,
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
            <Field
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    // formatter={(v) => `${v} Bottle${v > 1 ? 's' : ''}`}
                    step={1}
                    min={0.1}
                    format='0.0'
                    onChange={(e) => {
                      if (values.unitPrice) {
                        const total = e.target.value * values.unitPrice
                        setFieldValue('totalPrice', total)
                        this.updateTotalPrice(total)
                      }
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name='dispenseUOMFK'
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
            <Field
              name='totalPrice'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total'
                    onChange={(e) => {
                      // this.props.setFieldValue(
                      //   'totalAfterItemAdjustment',
                      //   e.target.value,
                      // )
                      this.updateTotalPrice(e.target.value)
                      // this.props.dispatch({
                      //   type: 'orders/updateState',
                      //   payload: {
                      //     totalPrice: e.target.value,
                      //     totalAfterItemAdjustment: undefined,
                      //   },
                      // })
                    }}
                    currency
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <Field
              name='totalAfterItemAdjustment'
              render={(args) => {
                // if (
                //   orders.totalAfterItemAdjustment &&
                //   args.field.value !== orders.totalAfterItemAdjustment
                // ) {
                //   args.form.setFieldValue('totalAfterItemAdjustment', orders.totalAfterItemAdjustment)
                // }
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
          <GridItem xs={2} className={classes.editor}>
            <Field
              name='batchNo'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Batch No'
                    labelField='batchNo'
                    valueField='batchNo'
                    options={this.state.selectionOptions}
                    onChange={(e, op = {}) => {
                      console.log()
                      setFieldValue('expiryDate', op.expiryDate)
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} className={classes.editor}>
            <FastField
              name='expiryDate'
              render={(args) => {
                return <DatePicker label='Expiry Date' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} className={classes.editor}>
            {/* <Button link className={classes.editorBtn}>
              Add Diagnosis
            </Button> */}

            <FastField
              name='remarks'
              render={(args) => {
                // return <RichEditor placeholder='Remarks' {...args} />
                return (
                  <TextField multiline rowsMax='5' label='Remarks' {...args} />
                )
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
