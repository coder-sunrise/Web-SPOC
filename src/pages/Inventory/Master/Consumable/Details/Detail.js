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
            <GridItem xs={12}>
              <FastField
                name='isEnableRetail'
                render={(args) => {
                  return (
                    <Switch
                      label={formatMessage({
                        id: 'inventory.master.consumable.enableRetail',
                      })}
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
                name='supplier'
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
                name='baseUOM'
                render={(args) => (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.master.consumable.baseUOM',
                    })}
                    code='ctBaseUOM'
                    max={10}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='consumableCategory'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.consumable.category',
                    })}
                    options={[]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='revenueCategory'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.consumable.revenueCategory',
                    })}
                    options={[]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveStartDate'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({
                      id: 'inventory.master.consumable.effectiveStartDate',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveEndDate'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({
                      id: 'inventory.master.consumable.effectiveEndDate',
                    })}
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
