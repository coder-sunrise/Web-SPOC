import React, { useState, useRef } from 'react';
import { compose } from 'redux';
import {
  CardContainer, GridContainer, GridItem, Tooltip,
  Checkbox, TextField, FastField, Field, CodeSelect, NumberInput, Switch,
  DateRangePicker, dateFormatLong
} from '@/components';
import { Table, Button, Input  } from 'antd';

export const General = (props) => {
  const { dispatch } = props;
  const { copayerDetail, clinicSettings, values } = props;
  const { isUserMaintainable, isGSTEnabled, isAutoGenerateStatementEnabled, statementAdjustment } = copayerDetail
  const { isEnableAutoGenerateStatement = true } = clinicSettings;
  const { height } = props;

  const isNew = values.id? false: true;
  
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem md={12}>
          <GridContainer>
            <GridItem md={3}>
              <Tooltip title='Co-Payer Code will be generated automatically if no code is entered' placement='bottom'><span>
                <FastField 
                  name='code'
                  render={(args) => (
                    <TextField disabled={!isNew} label='Co-Payer Code' {...args}/>
                  )}
                />
              </span></Tooltip>
            </GridItem>

            <GridItem md={3}>
              <FastField
                name='displayValue'
                render={(args) => (
                  <TextField label='Co-Payer Name' {...args} />
                )}
              />
            </GridItem>

            <GridItem md={3}>
              <FastField
                name='coPayerTypeFK'
                render={(args) => (
                  <CodeSelect
                    label='Co-Payer Type'
                    code='ctCopayerType'
                    {...args}
                  />
                )}
              />
            </GridItem>

            {isEnableAutoGenerateStatement && (
              <React.Fragment>
                <GridItem md={3}>
                  <FastField
                    name='isAutoGenerateStatementEnabled'
                    render={(args) => {
                      return <Checkbox
                        style={{ marginTop: '22px' }}
                        label='Auto Generate Statement'
                        {...args}
                      />
                    }}
                  />
                </GridItem>
                {isAutoGenerateStatementEnabled && (statementAdjustment && statementAdjustment > 0) &&
                  <GridItem md={3}>
                    <Field
                      name='defaultStatementAdjustmentRemarks'
                      render={(args) =>
                        <TextField label='Default Statement Adjustment Remarks' maxLength={50} {...args} />}
                    />
                  </GridItem>
                }
              </React.Fragment>
            )}
          </GridContainer>
        </GridItem>
        
        <React.Fragment>
          <GridItem md={3}>
            <GridContainer>
              <GridItem md={9}>
                <Field
                  name='statementAdjustment'
                  render={(args) => {
                    if (copayerDetail.statementAdjustmentType === 'ExactAmount') {
                      return (
                        <NumberInput
                          currency
                          label='Statement Adjustment'
                          defaultValue='0.00' precision={2} min={0}
                          {...args}
                        />
                      )
                    }
                    return (
                      <NumberInput
                        percentage
                        label='Statement Adjustment'
                        defaultValue='0.00' precision={2} min={0}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>

              <GridItem md={3}>
                <Field
                  name='statementAdjustmentType'
                  render={(args) => (
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
              </GridItem>
            </GridContainer>
          </GridItem>
        </React.Fragment>

        <React.Fragment>
          <GridItem md={3}>
            <GridContainer>
              <GridItem md={9}>
                <Field
                  name='autoInvoiceAdjustment'
                  render={(args) => {
                    if (
                      copayerDetail.autoInvoiceAdjustmentType === 'ExactAmount'
                    ) {
                      return (
                        <NumberInput
                          currency
                          label='Invoice Adjustment'
                          defaultValue='0.00'
                          precision={2}
                          {...args}
                        />
                      )
                    }
                    return (
                      <NumberInput
                        percentage
                        label='Invoice Adjustment'
                        defaultValue='0.00'
                        precision={2}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem md={3}>
                <Field
                  name='autoInvoiceAdjustmentType'
                  render={(args) => (
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
              </GridItem>
            </GridContainer>
          </GridItem>
        </React.Fragment>

        <React.Fragment>
          <GridItem md={3}>
            <GridContainer>
              <GridItem md={9}>
                <Field
                  name='adminCharge'
                  render={(args) => {
                    if (copayerDetail.adminChargeType === 'ExactAmount') {
                      return (
                        <NumberInput
                          currency
                          label='Corporate Charges'
                          defaultValue='0.00' min={0} precision={2}
                          {...args}
                        />
                      )
                    }
                    return (
                      <NumberInput
                        percentage
                        label='Corporate Charges'
                        defaultValue='0.00' min={0} precision={2}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem md={3}>
                <Field
                  name='adminChargeType'
                  render={(args) => (
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
              </GridItem>
            </GridContainer>
          </GridItem>
        </React.Fragment>

        <GridItem md={3}>
          <Field
            name='creditInformation'
            render={(args) => <TextField label='Credit Code' {...args} />}
          />
        </GridItem>

        <GridItem md={12}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={(args) => {
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
            
            <GridItem md={6}>
              <Field
                name='remark'
                render={(args) => <TextField label='Remarks' {...args} />}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      
      {/* Company Address */}
      <GridItem style={{marginTop:30}}>
        <h4 style={{fontWeight:500}}>Contact</h4>
      </GridItem>

      <GridContainer>
        <GridContainer>
          <GridItem xs={12} md={3}>
              <FastField 
                name='address.postcode'
                render={(args) => <TextField label='Postal Code' {...args}/>}
              />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.blockNo'
              render={(args) => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.unitNo'
              render={(args) => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.buildingName'
              render={(args) => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.street'
              render={(args) => <TextField label='Street' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name='address.countryFK'
              render={(args) => (
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
              render={(args) => <TextField label='Website' {...args} />}
            />
          </GridItem>
        </GridContainer>
      </GridContainer>
    </React.Fragment>
  );
}
