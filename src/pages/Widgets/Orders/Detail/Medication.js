import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import { formatMessage } from 'umi/locale'
import { VISIT_TYPE } from '@/utils/constants'

import LowStockInfo from './LowStockInfo'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Select,
  CodeSelect,
  DatePicker,
  Checkbox,
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

@connect(({ global, codetable }) => ({ global, codetable }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultMedication),
      type,
      visitPurposeFK: orders.visitPurposeFK,
    }
    if (type === '5') {
      v.drugCode = 'MISC'
    }
    if (
      !v.corPrescriptionItemPrecaution ||
      !v.corPrescriptionItemPrecaution[0]
    ) {
      v.corPrescriptionItemPrecaution = [
        {},
      ]
    }
    return v
  },
  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    quantity: Yup.number()
      .min(0.1, 'Quantity must be between 0.1 and 999')
      .max(999, 'Quantity must be between 0.1 and 999'),
    dispenseUOMFK: Yup.number().required(),
    totalPrice: Yup.number().required(),
    type: Yup.string(),
    inventoryMedicationFK: Yup.number().when('type', {
      is: (val) => val !== '5',
      then: Yup.number().required(),
    }),
    drugName: Yup.string().when('type', {
      is: (val) => val === '5',
      then: Yup.string().required(),
    }),
    // corPrescriptionItemPrecaution: Yup.array().of(
    //   Yup.object().shape({
    //     medicationPrecautionFK: Yup.number().required(),
    //   }),
    // ),
    corPrescriptionItemInstruction: Yup.array().of(
      Yup.object().shape({
        usageMethodFK: Yup.number().required(),
        dosageFK: Yup.number().required(),
        prescribeUOMFK: Yup.number().required(),
        drugFrequencyFK: Yup.number().required(),
        duration: Yup.number()
          .min(1, 'Duration must be greater than or equal to 1')
          .required(),
        sequence: Yup.number().required(),
        stepdose: Yup.string().required(),
      }),
    ),
  }),

  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, orders, currentType, getNextSequence } = props
    const { rows } = orders

    const getInstruction = (instructions) => {
      let instruction = ''
      let nextStepdose = ''
      if (instructions) {
        for (let index = 0; index < instructions.length; index++) {
          let item = instructions[index]
          if (instruction !== '') {
            instruction += ' - '
          }

          if (index < instructions.length - 1) {
            nextStepdose = ` ${instructions[index + 1].stepdose}`
          } else {
            nextStepdose = ''
          }

          instruction += `${item.usageMethodDisplayValue
            ? item.usageMethodDisplayValue
            : ''} ${item.dosageDisplayValue
            ? item.dosageDisplayValue
            : ''} ${item.prescribeUOMDisplayValue
            ? item.prescribeUOMDisplayValue
            : ''} ${item.drugFrequencyDisplayValue
            ? item.drugFrequencyDisplayValue
            : ''} For ${item.duration
            ? item.duration
            : ''} day(s)${nextStepdose}`
        }
      }
      return instruction
    }

    const instruction = getInstruction(values.corPrescriptionItemInstruction)

    const data = {
      sequence: getNextSequence(),
      ...values,
      instruction,
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
class Medication extends PureComponent {
  state = {
    selectedMedication: {
      medicationStock: [],
    },
    batchNo: '',
    expiryDate: '',
  }

  componentDidMount () {
    // this.props
    //   .dispatch({
    //     type: 'orders/getStockDetails',
    //     payload: {
    //       id: 1,
    //     },
    //   })
    //   .then((v) => {
    //     if (v) {
    //       this.setState({ stockList: v.data })
    //     }
    //   })
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
                this.calculateQuantity()
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
              if (prop === 'corPrescriptionItemInstruction') {
                this.setInstruction(
                  values.corPrescriptionItemInstruction.length,
                )
                setTimeout(() => {
                  this.calculateQuantity()
                }, 1)
              }
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.orders.type === this.props.type)
      if (
        (!this.props.global.openAdjustment &&
          nextProps.global.openAdjustment) ||
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

  calculateQuantity = (medication) => {
    const { codetable, setFieldValue, values, disableEdit, dirty } = this.props
    let currentMedicaiton = medication
    if (!currentMedicaiton) currentMedicaiton = this.state.selectedMedication
    const { form } = this.descriptionArrayHelpers
    let newTotalQuantity = 0
    if (currentMedicaiton && currentMedicaiton.dispensingQuantity && !dirty) {
      newTotalQuantity = currentMedicaiton.dispensingQuantity
    } else {
      const prescriptionItem = form.values.corPrescriptionItemInstruction
      const dosageUsageList = codetable.ctmedicationdosage
      const medicationFrequencyList = codetable.ctmedicationfrequency

      for (let i = 0; i < prescriptionItem.length; i++) {
        if (
          prescriptionItem[i].dosageFK &&
          prescriptionItem[i].drugFrequencyFK &&
          prescriptionItem[i].duration
        ) {
          const dosage = dosageUsageList.find(
            (o) => o.id === prescriptionItem[i].dosageFK,
          )

          const frequency = medicationFrequencyList.find(
            (o) => o.id === prescriptionItem[i].drugFrequencyFK,
          )

          newTotalQuantity +=
            dosage.multiplier *
            frequency.multiplier *
            prescriptionItem[i].duration
        }
      }

      newTotalQuantity = Math.ceil(newTotalQuantity * 10) / 10 || 0
      const { prescriptionToDispenseConversion } = currentMedicaiton
      if (prescriptionToDispenseConversion)
        newTotalQuantity = Math.ceil(
          newTotalQuantity / prescriptionToDispenseConversion,
        )
    }
    setFieldValue(`quantity`, newTotalQuantity)

    if (disableEdit === false) {
      if (currentMedicaiton.sellingPrice) {
        setFieldValue('unitPrice', currentMedicaiton.sellingPrice)
        setFieldValue(
          'totalPrice',
          currentMedicaiton.sellingPrice * newTotalQuantity,
        )
        this.updateTotalPrice(currentMedicaiton.sellingPrice * newTotalQuantity)
      } else {
        setFieldValue('unitPrice', undefined)
        setFieldValue('totalPrice', undefined)
        this.updateTotalPrice(undefined)
      }
    }
  }

  setInstruction = (index = 0) => {
    const { setFieldValue } = this.props
    const op = this.state.selectedMedication

    setFieldValue(
      `corPrescriptionItemInstruction[${index}].usageMethodFK`,
      op.medicationUsage ? op.medicationUsage.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].usageMethodCode`,
      op.medicationUsage ? op.medicationUsage.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].usageMethodDisplayValue`,
      op.medicationUsage ? op.medicationUsage.name : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].dosageFK`,
      op.prescribingDosage ? op.prescribingDosage.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].dosageCode`,
      op.prescribingDosage ? op.prescribingDosage.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].dosageDisplayValue`,
      op.prescribingDosage ? op.prescribingDosage.name : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].prescribeUOMFK`,
      op.prescribingUOM ? op.prescribingUOM.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].prescribeUOMCode`,
      op.prescribingUOM ? op.prescribingUOM.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].prescribeUOMDisplayValue`,
      op.prescribingUOM ? op.prescribingUOM.name : undefined,
    )

    setFieldValue(
      `corPrescriptionItemInstruction[${index}].drugFrequencyFK`,
      op.medicationFrequency ? op.medicationFrequency.id : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].drugFrequencyCode`,
      op.medicationFrequency ? op.medicationFrequency.code : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].drugFrequencyDisplayValue`,
      op.medicationFrequency ? op.medicationFrequency.name : undefined,
    )
    setFieldValue(
      `corPrescriptionItemInstruction[${index}].duration`,
      op.duration || 1,
    )
  }

  changeMedication = (v, op = {}) => {
    const { setFieldValue, disableEdit } = this.props

    let defaultBatch
    if (op.medicationStock) {
      defaultBatch = op.medicationStock.find((o) => o.isDefault === true)
      if (defaultBatch)
        this.setState({
          batchNo: defaultBatch.batchNo,
          expiryDate: defaultBatch.expiryDate,
        })
    }
    setFieldValue('costPrice', op.averageCostPrice || 0)
    setFieldValue('corPrescriptionItemInstruction', [
      {
        sequence: 0,
        stepdose: 'AND',
      },
    ])
    if (disableEdit === false) {
      setFieldValue('batchNo', defaultBatch ? defaultBatch.batchNo : undefined)
      setFieldValue(
        'expiryDate',
        defaultBatch ? defaultBatch.expiryDate : undefined,
      )
    }
    setFieldValue('isActive', op.isActive)

    this.setState(
      {
        selectedMedication: op,
      },
      () => {
        this.setInstruction()
      },
    )

    if (
      op.inventoryMedication_MedicationPrecaution &&
      op.inventoryMedication_MedicationPrecaution.length > 0
    ) {
      op.inventoryMedication_MedicationPrecaution.forEach((im, i) => {
        setFieldValue(
          `corPrescriptionItemPrecaution[${i}].medicationPrecautionFK`,
          im.medicationPrecautionFK,
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
      setFieldValue(`corPrescriptionItemPrecaution`, [
        {
          precaution: '',
          sequence: 0,
        },
      ])
    }

    setFieldValue('dispenseUOMFK', op.dispensingUOM ? op.dispensingUOM.id : [])
    setFieldValue(
      'dispenseUOMCode',
      op.dispensingUOM ? op.dispensingUOM.code : [],
    )
    setFieldValue(
      'dispenseUOMDisplayValue',
      op.dispensingUOM ? op.dispensingUOM.name : [],
    )

    setFieldValue('drugCode', op.code)
    setFieldValue('drugName', op.displayValue)

    setTimeout(() => {
      this.calculateQuantity(op)
    }, 1)
  }

  updateTotalPrice = (v) => {
    if (v || v === 0) {
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
      ...orders.defaultMedication,
      type: orders.type,
      visitPurposeFK: orders.visitPurposeFK,
      drugCode: orders.type === '5' ? 'MISC' : undefined,
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
      disableEdit,
      setDisable,
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
          <GridItem xs={6}>
            <React.Fragment>
              {openPrescription ? (
                <FastField
                  name='drugName'
                  render={(args) => {
                    return (
                      <TextField
                        label='Open Prescription Name'
                        {...args}
                        autocomplete='nope'
                      />
                    )
                  }}
                />
              ) : (
                <FastField
                  name='inventoryMedicationFK'
                  render={(args) => {
                    return (
                      <div style={{ position: 'relative' }}>
                        <CodeSelect
                          temp
                          label='Medication Name'
                          code='inventorymedication'
                          labelField='displayValue'
                          onChange={this.changeMedication}
                          {...args}
                          style={{ paddingRight: 20 }}
                        />
                        <LowStockInfo sourceType='medication' {...this.props} />
                      </div>
                    )
                  }}
                />
              )}
            </React.Fragment>
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
                                    label={formatMessage({
                                      id: 'inventory.master.setting.usage',
                                    })}
                                    allowClear={false}
                                    style={{ marginLeft: 15, paddingRight: 15 }}
                                    code='ctMedicationUsage'
                                    onChange={(v, op = {}) => {
                                      setFieldValue(
                                        `corPrescriptionItemInstruction[${i}].usageMethodCode`,
                                        op ? op.code : undefined,
                                      )
                                      setFieldValue(
                                        `corPrescriptionItemInstruction[${i}].usageMethodDisplayValue`,
                                        op ? op.name : undefined,
                                      )
                                    }}
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
                                  label={formatMessage({
                                    id: 'inventory.master.setting.dosage',
                                  })}
                                  allowClear={false}
                                  code='ctMedicationDosage'
                                  labelField='displayValue'
                                  {...commonSelectProps}
                                  {...args}
                                  onChange={(v, op = {}) => {
                                    setFieldValue(
                                      `corPrescriptionItemInstruction[${i}].dosageCode`,
                                      op ? op.code : undefined,
                                    )
                                    setFieldValue(
                                      `corPrescriptionItemInstruction[${i}].dosageDisplayValue`,
                                      op ? op.displayValue : undefined,
                                    )
                                    setTimeout(() => {
                                      this.calculateQuantity()
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
                                  label={formatMessage({
                                    id: 'inventory.master.setting.uom',
                                  })}
                                  allowClear={false}
                                  code='ctMedicationUnitOfMeasurement'
                                  onChange={(v, op = {}) => {
                                    setFieldValue(
                                      `corPrescriptionItemInstruction[${i}].prescribeUOMCode`,
                                      op ? op.code : undefined,
                                    )
                                    setFieldValue(
                                      `corPrescriptionItemInstruction[${i}].prescribeUOMDisplayValue`,
                                      op ? op.name : undefined,
                                    )
                                  }}
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
                                  label={formatMessage({
                                    id: 'inventory.master.setting.frequency',
                                  })}
                                  labelField='displayValue'
                                  allowClear={false}
                                  code='ctMedicationFrequency'
                                  {...commonSelectProps}
                                  {...args}
                                  onChange={(v, op = {}) => {
                                    setFieldValue(
                                      `corPrescriptionItemInstruction[${i}].drugFrequencyCode`,
                                      op ? op.code : undefined,
                                    )
                                    setFieldValue(
                                      `corPrescriptionItemInstruction[${i}].drugFrequencyDisplayValue`,
                                      op ? op.displayValue : undefined,
                                    )
                                    setTimeout(() => {
                                      this.calculateQuantity()
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
                                  precision={0}
                                  label={formatMessage({
                                    id: 'inventory.master.setting.duration',
                                  })}
                                  allowEmpty={false}
                                  formatter={(v) =>
                                    `${v} Day${v > 1 ? 's' : ''}`}
                                  step={1}
                                  min={0}
                                  {...args}
                                  onChange={() => {
                                    setTimeout(() => {
                                      this.calculateQuantity()
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
                            // drugFrequencyFK: 1,
                            // duration: 1,
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
                                      code='ctmedicationprecaution'
                                      labelField='displayValue'
                                      onChange={(v, option = {}) => {
                                        setFieldValue(
                                          `corPrescriptionItemPrecaution[${i}].precaution`,
                                          option.displayValue,
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
                    min={0}
                    // currency
                    onChange={(e) => {
                      if (disableEdit === false) {
                        if (values.unitPrice) {
                          const total = e.target.value * values.unitPrice
                          setFieldValue('totalPrice', total)
                          this.updateTotalPrice(total)
                        }
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
                    disabled={!openPrescription}
                    label='UOM'
                    allowClear={false}
                    code='ctMedicationUnitOfMeasurement'
                    onChange={(v, op = {}) => {
                      setFieldValue('dispenseUOMCode', op ? op.code : undefined)
                      setFieldValue(
                        'dispenseUOMDisplayValue',
                        op ? op.name : undefined,
                      )
                    }}
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
                    disabled={disableEdit}
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
                    disabled
                    currency
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
                    label='Batch No.'
                    labelField='batchNo'
                    valueField='batchNo'
                    options={this.state.selectedMedication.medicationStock}
                    onChange={(e, op = {}) => {
                      setFieldValue('expiryDate', op.expiryDate)
                    }}
                    disabled={disableEdit}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} className={classes.editor}>
            <Field
              name='expiryDate'
              render={(args) => {
                return (
                  <DatePicker
                    label='Expiry Date'
                    disabled={disableEdit}
                    {...args}
                  />
                )
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
          {values.visitPurposeFK !== VISIT_TYPE.RETAIL ? (
            <GridItem xs={12}>
              <FastField
                name='isExternalPrescription'
                render={(args) => {
                  if (args.field.value) {
                    setDisable(true)
                  } else {
                    setDisable(false)
                  }
                  return (
                    <Checkbox
                      label='External Prescription'
                      labelPlacement='start'
                      {...args}
                      onChange={(e) => {
                        if (e.target.value) {
                          this.props.setFieldValue('adjAmount', 0)
                          this.props.setFieldValue(
                            'totalAfterItemAdjustment',
                            0,
                          )
                          this.props.setFieldValue('totalPrice', 0)
                          this.props.setFieldValue('expiryDate', undefined)
                          this.props.setFieldValue('batchNo', undefined)
                        } else {
                          this.props.setFieldValue(
                            'expiryDate',
                            this.state.expiryDate,
                          )
                          this.props.setFieldValue(
                            'batchNo',
                            this.state.batchNo,
                          )
                          setTimeout(() => {
                            this.calculateQuantity()
                          }, 1)
                        }
                        setDisable(e.target.value)
                      }}
                    />
                  )
                }}
              />
            </GridItem>
          ) : (
            ''
          )}
        </GridContainer>
        {footer({
          onSave: handleSubmit,
          onReset: this.handleReset,
        })}
      </div>
    )
  }
}
export default Medication
