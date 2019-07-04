import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { FastField } from 'formik'
import { connect } from 'dva'
import { compose } from 'redux'

import {
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  Checkbox,
} from '@/components'

const styles = () => ({})

const Detail = ({ vaccinationDetail, dispatch }) => {
  useEffect(() => {
    if (vaccinationDetail.currentId) {
      dispatch({
        type: 'vaccinationDetail/query',
        payload: {
          id: vaccinationDetail.currentId,
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
                name='Code'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.code',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Name'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.name',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Description'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.description',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Remarks'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.remarks',
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
                name='EnableRetail'
                render={(args) => {
                  return (
                    <Checkbox
                      prefix={formatMessage({
                        id: 'inventory.master.vaccination.enableRetail',
                      })}
                      isSwitch
                      colon={false}
                      // controlStyle={{ marginLeft: 200 }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='SDDID'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.sddID',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='SDDDescription'
                render={(args) => {
                  return (
                    <Select
                      label={formatMessage({
                        id: 'inventory.master.vaccination.sddDescription',
                      })}
                      options={[]}
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
                name='Supplier'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.supplier',
                    })}
                    options={[]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='VaccinationGroup'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.vaccinationGroup',
                    })}
                    options={[]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='RevenueCategory'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.revenueCategory',
                    })}
                    options={[]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='EffectiveStartDate'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({
                      id: 'inventory.master.vaccination.effectiveStartDate',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='EffectiveEndDate'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({
                      id: 'inventory.master.vaccination.effectiveEndDate',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='EffectiveEndDate'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({
                      id: 'inventory.master.vaccination.effectiveEndDate',
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
  connect(({ vaccinationDetail }) => ({
    vaccinationDetail,
  })),
)(Detail)
