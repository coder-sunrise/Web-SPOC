import React, { useState, useRef } from 'react'
import { compose } from 'redux'
import {
  CardContainer,
  GridContainer,
  GridItem,
  Tooltip,
  Checkbox,
  TextField,
  FastField,
  Field,
  CodeSelect,
  NumberInput,
  Switch,
  DateRangePicker,
  dateFormatLong,
} from '@/components'
import { Table, Button, Input } from 'antd'

export const General = props => {
  const { clinicSettings, values, height, dispatch, setFieldValue } = props
  const {
    isUserMaintainable,
    isGSTEnabled,
    isAutoGenerateStatementEnabled,
    statementAdjustment,
    statementAdjustmentType,
    autoInvoiceAdjustmentType,
    adminChargeType,
  } = values
  const { isEnableAutoGenerateStatement = true } = clinicSettings

  const isNew = values.id ? false : true

  return (
    <React.Fragment>
      <GridContainer>
        <GridItem md={3}>
          <Tooltip
            title='Co-Payer Code will be generated automatically if no code is entered'
            placement='bottom'
          >
            <span>
              <FastField
                name='code'
                render={args => (
                  <TextField
                    disabled={!isNew}
                    label='Co-Payer Code'
                    {...args}
                  />
                )}
              />
            </span>
          </Tooltip>
        </GridItem>

        <GridItem md={3}>
          <FastField
            name='displayValue'
            render={args => <TextField label='Co-Payer Name' {...args} />}
          />
        </GridItem>

        <GridItem md={3}>
          <Field
            name='coPayerTypeFK'
            render={args => (
              <CodeSelect
                label='Co-Payer Type'
                code='ctCopayerType'
                disabled={!isNew}
                localFilter={item => !isNew || item.code !== 'GOVERNMENT'}
                {...args}
              />
            )}
          />
        </GridItem>

        <GridItem md={3}>
          <FastField
            name='effectiveDates'
            render={args => {
              return (
                <DateRangePicker
                  format={dateFormatLong}
                  label='Effective Start Date'
                  label2='End Date'
                  {...args}
                />
              )
            }}
          />
        </GridItem>

        <GridItem md={3}>
          <div
            style={{
              position: 'relative',
              paddingRight: 50,
            }}
          >
            <Field
              name='statementAdjustment'
              render={args => {
                if (statementAdjustmentType === 'ExactAmount') {
                  return (
                    <NumberInput
                      currency
                      label='Statement Adjustment'
                      defaultValue='0.00'
                      precision={2}
                      min={0}
                      onChange={e => {
                        if (!e.target.value) {
                          setFieldValue(
                            'defaultStatementAdjustmentRemarks',
                            undefined,
                          )
                        }
                      }}
                      {...args}
                    />
                  )
                }
                return (
                  <NumberInput
                    percentage
                    label='Statement Adjustment'
                    defaultValue='0.00'
                    precision={2}
                    min={0}
                    max={100}
                    onChange={e => {
                      if (!e.target.value) {
                        setFieldValue(
                          'defaultStatementAdjustmentRemarks',
                          undefined,
                        )
                      }
                    }}
                    {...args}
                  />
                )
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              <Field
                name='statementAdjustmentType'
                render={args => (
                  <Switch
                    checkedChildren='$'
                    checkedValue='ExactAmount'
                    unCheckedChildren='%'
                    unCheckedValue='Percentage'
                    label=' '
                    {...args}
                  />
                )}
              />
            </div>
          </div>
        </GridItem>

        <GridItem md={3}>
          <div
            style={{
              position: 'relative',
              paddingRight: 50,
            }}
          >
            <Field
              name='autoInvoiceAdjustment'
              render={args => {
                if (autoInvoiceAdjustmentType === 'ExactAmount') {
                  return (
                    <NumberInput
                      currency
                      defaultValue='0.00'
                      precision={2}
                      min={0}
                      label='Invoice Adjustment'
                      {...args}
                    />
                  )
                }
                return (
                  <NumberInput
                    percentage
                    label='Invoice Adjustment'
                    min={0}
                    defaultValue='0.00'
                    precision={2}
                    max={100}
                    {...args}
                  />
                )
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              <Field
                name='autoInvoiceAdjustmentType'
                render={args => (
                  <Switch
                    checkedChildren='$'
                    checkedValue='ExactAmount'
                    unCheckedChildren='%'
                    unCheckedValue='Percentage'
                    label=' '
                    {...args}
                  />
                )}
              />
            </div>
          </div>
        </GridItem>

        <GridItem md={3}>
          <div
            style={{
              position: 'relative',
              paddingRight: 50,
            }}
          >
            <Field
              name='adminCharge'
              render={args => {
                if (adminChargeType === 'ExactAmount') {
                  return (
                    <NumberInput
                      currency
                      label='Corporate Charges'
                      min={0}
                      defaultValue='0.00'
                      precision={2}
                      {...args}
                    />
                  )
                }
                return (
                  <NumberInput
                    percentage
                    label='Corporate Charges'
                    min={0}
                    defaultValue='0.00'
                    precision={2}
                    max={100}
                    {...args}
                  />
                )
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              <Field
                name='adminChargeType'
                render={args => (
                  <Switch
                    checkedChildren='$'
                    checkedValue='ExactAmount'
                    unCheckedChildren='%'
                    unCheckedValue='Percentage'
                    label=' '
                    {...args}
                  />
                )}
              />
            </div>
          </div>
        </GridItem>

        <GridItem md={3}>
          <Field
            name='creditFacilityFK'
            render={args => (
              <CodeSelect
                label='Credit Facility'
                code='ctcreditfacility'
                autocomplete='off'
                tooltipField='description'
                orderBy={(['displayValue'], ['asc'])}
                {...args}
              />
            )}
          />
        </GridItem>

        <GridItem md={6}>
          <Field
            name='remark'
            render={args => <TextField label='Remarks' {...args} />}
          />
        </GridItem>

        <GridItem md={6}>
          {isEnableAutoGenerateStatement && (
            <div
              style={{
                position: 'relative',
                paddingLeft: 220,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                }}
              >
                <FastField
                  name='isAutoGenerateStatementEnabled'
                  render={args => {
                    return (
                      <Checkbox
                        style={{
                          marginTop: '22px',
                        }}
                        label='Auto Generate Statement'
                        onChange={e => {
                          if (!e.target.value) {
                            setFieldValue(
                              'defaultStatementAdjustmentRemarks',
                              undefined,
                            )
                          }
                        }}
                        {...args}
                      />
                    )
                  }}
                />
              </div>
              {isAutoGenerateStatementEnabled && statementAdjustment > 0 && (
                <Field
                  name='defaultStatementAdjustmentRemarks'
                  render={args => (
                    <TextField
                      label='Default Statement Adjustment Remarks'
                      maxLength={50}
                      {...args}
                    />
                  )}
                />
              )}
            </div>
          )}
        </GridItem>
      </GridContainer>

      {/* Company Address */}
      <GridItem style={{ marginTop: 30 }}>
        <h4 style={{ fontWeight: 500 }}>Contact</h4>
      </GridItem>

      <GridContainer>
        <GridContainer>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.postcode'
              render={args => <TextField label='Postal Code' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.blockNo'
              render={args => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.unitNo'
              render={args => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.buildingName'
              render={args => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.street'
              render={args => <TextField label='Street' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.countryFK'
              render={args => (
                <CodeSelect
                  label='Country'
                  code='ctCountry'
                  max={10}
                  autocomplete='off'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='website'
              render={args => <TextField label='Website' {...args} />}
            />
          </GridItem>
        </GridContainer>
      </GridContainer>
    </React.Fragment>
  )
}
