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
  Switch,
  DateRangePicker,
  Button,
  CodeSelect,
  Checkbox,
  Field,
} from '@/components'

const styles = () => ({})

const Detail = ({ vaccinationDetail, dispatch, values }) => {
  console.log('props', vaccinationDetail)
  console.log('props', values)
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
                name='code'
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
                name='displayValue'
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

            <GridItem xs={12} style={{ marginTop: '10px' }} />
          </GridContainer>
        </GridItem>

        <GridItem xs={1} />

        <GridItem xs={12} md={6}>
          <GridContainer>
            <GridItem xs={2} />
            <GridItem xs={10}>
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
            <GridItem xs={2} />
            <GridItem xs={10}>
              <FastField
                name='revenueCategoryFk'
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
            <GridItem xs={2} />
            <GridItem xs={10}>
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
            <GridItem xs={2}>
              <Field
                name='enableVaccinationGroup'
                render={(args) => (
                  <Checkbox style={{ marginTop: 18, right: -100 }} {...args} />
                )}
              />
            </GridItem>

            <GridItem xs={10}>
              <Field
                name='vaccinationGroupFK'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.vaccinationGroup',
                    })}
                    options={[
                      {
                        name: 'Medisave Vaccination',
                        value: '1',
                      },
                      {
                        name: 'Medisave Vaccination1',
                        value: '2',
                      },
                    ]}
                    disabled={!values.enableVaccinationGroup}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <h5 style={{ marginTop: 5, marginLeft: 8 }}>SDD</h5>
      <Divider style={{ marginLeft: 8 }} />
      <GridContainer>
        <GridItem xs={5}>
          <FastField
            name='sddFk'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.medication.sddID',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={5} style={{ marginTop: 10 }}>
          <Button
            variant='contained'
            color='primary'
            // onClick={() => {
            //   dispatch({
            //     type: 'medication/query',
            //   })
            // }}
          >
            Search
          </Button>
        </GridItem>
        <GridItem xs={5}>
          <FastField
            name='sDDDescription'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'inventory.master.medication.sddDescription',
                  })}
                  options={[]}
                  {...args}
                />
              )
            }}
          />
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
