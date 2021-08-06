import React from 'react'
import { formatMessage } from 'umi'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import {
  CodeSelect,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
  dateFormatLong,
  CheckboxGroup,
  Field,
} from '@/components'
import SharedContainer from '../../SharedContainer'
import clinicSettings from '@/models/clinicSettings'

const styles = () => ({})

const Detail = ({ consumableDetail, hasActiveSession, theme }) => {
  return (
    <SharedContainer>
      <div
        hideHeader
        style={{
          margin: theme.spacing(1),
          minHeight: 670,
          maxHeight: 670,
        }}
      >
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='code'
                  render={args => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.master.consumable.code',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='displayValue'
                  render={args => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.master.consumable.name',
                        })}
                        disabled={consumableDetail.entity}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='description'
                  render={args => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.master.consumable.description',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='remarks'
                  render={args => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.master.consumable.remarks',
                        })}
                        multiline
                        rowsMax='5'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem>
                <FastField
                  name='chas'
                  render={args => (
                    <CheckboxGroup
                      vertical
                      simple
                      valueField='id'
                      textField='name'
                      options={
                        (() => {
                          var arr = []
                          if (clinicSettings.isEnableCHAS) {
                            arr.push(...[{
                              id: 'isChasAcuteClaimable',
                              name: 'CHAS Acute Claimable',

                              layoutConfig: {
                                style: {},
                              },
                            },
                            {
                              id: 'isChasChronicClaimable',
                              name: 'CHAS Chronic Claimable',

                              layoutConfig: {
                                style: {},
                              },
                              },
                            ])
                          }
                          arr.push(...[{
                            id: 'isDispensedByPharmacy',
                            name: 'Dispensed by Pharmacy',
                            layoutConfig: {
                              style: {},
                            },
                          },
                          {
                            id: 'isNurseActualizable',
                            name: 'Nurse Actualizable',
                            layoutConfig: {
                              style: {},
                            },
                          },])
                          return arr
                        })()}
                      onChange={(e, s) => { }}
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={2} />
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='favouriteSupplierFK'
                  render={args => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.consumable.supplier',
                      })}
                      code='ctSupplier'
                      labelField='displayValue'
                      max={10}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='uomfk'
                  render={args => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.consumable.baseUOM',
                      })}
                      code='ctConsumableUnitOfMeasurement'
                      max={10}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='consumableCategoryFK'
                  render={args => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.consumable.category',
                      })}
                      code='ctConsumableCategory'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='revenueCategoryFK'
                  render={args => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.medication.revenueCategory',
                      })}
                      code='ctRevenueCategory'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <Field
                  name='effectiveDates'
                  render={args => (
                    <DateRangePicker
                      format={dateFormatLong}
                      label='Effective Start Date'
                      label2='End Date'
                      disabled={!!(consumableDetail.entity && hasActiveSession)}
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </SharedContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
)(Detail)
