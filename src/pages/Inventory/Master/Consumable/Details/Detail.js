import React, { useEffect } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { compose } from 'redux'

import {
  CodeSelect,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  Switch,
  DateRangePicker,
} from '@/components'

const styles = () => ({})

const Detail = ({ consumableDetail, dispatch }) => {
  useEffect(() => {
    if (consumableDetail.currentId) {
      dispatch({
        type: 'consumableDetail/query',
        payload: {
          id: consumableDetail.currentId,
        },
      })
    }
  }, [])

  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
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
              <FastField
                name='effectiveDates'
                render={(args) => (
                  <DateRangePicker
                    label='Effective Start Date'
                    label2='End Date'
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <Divider style={{ margin: '40px 0 20px 0' }} />
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ consumableDetail }) => ({
    consumableDetail,
  })),
)(Detail)
