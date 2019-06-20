import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
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
                  return <TextField label='Vaccination Code' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Name'
                render={(args) => {
                  return <TextField label='Vaccination Name' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Description'
                render={(args) => {
                  return <TextField label='Description' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Remark'
                render={(args) => {
                  return (
                    <TextField label='Remark' multiline rowsMax='5' {...args} />
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
                      prefix='Enable Retail'
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
                  return <TextField label='SDD ID' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='SDDDescription'
                render={(args) => {
                  return (
                    <Select label='SDD Description' options={[]} {...args} />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Vaccination'
                render={(args) => (
                  <Select label='Vaccination' options={[]} {...args} />
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
                name='Supplier'
                render={(args) => (
                  <Select label='Supplier' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='VaccinationGroup'
                render={(args) => (
                  <Select label='Vaccination Group' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='RevenueCategory'
                render={(args) => (
                  <Select label='Revenue Category' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='EffectiveStartDate'
                render={(args) => (
                  <DatePicker label='Effective Start Date' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='EffectiveEndDate'
                render={(args) => (
                  <DatePicker label='Effective End Date' {...args} />
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
  connect(({ vaccinationDetail }) => ({
    vaccinationDetail,
  })),
)(Detail)
