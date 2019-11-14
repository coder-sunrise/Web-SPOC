import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import { getBizSession } from '@/services/queue'
import {
  CodeSelect,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
  dateFormatLong,
  CheckboxGroup,
  Field,
} from '@/components'

const styles = () => ({})

const Detail = ({ consumableDetail, dispatch, values, theme }) => {
  const [
    hasActiveSession,
    setHasActiveSession,
  ] = useState(true)
  const checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data
    setHasActiveSession(data.length > 0)
  }

  useEffect(() => {
    if (consumableDetail.currentId) {
      dispatch({
        type: 'consumableDetail/query',
        payload: {
          id: consumableDetail.currentId,
        },
      })
      checkHasActiveSession()
    }
  }, [])

  return (
    <CardContainer
      hideHeader
      style={{
        margin: theme.spacing(1),
        minHeight: 700,
        maxHeight: 700,
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='code'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.consumable.code',
                      })}
                      disabled={!values.isActive}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='displayValue'
                render={(args) => {
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
                render={(args) => {
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
                render={(args) => {
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
                render={(args) => (
                  <CheckboxGroup
                    vertical
                    simple
                    valueField='id'
                    textField='name'
                    options={[
                      {
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
                    ]}
                    onChange={(e, s) => {}}
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
                render={(args) => (
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
                render={(args) => (
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
                render={(args) => (
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
                render={(args) => (
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
                render={(args) => (
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
      {/* <Divider style={{ margin: '40px 0 20px 0' }} /> */}
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  // connect(({ consumableDetail }) => ({
  //   consumableDetail,
  // })),
)(Detail)
