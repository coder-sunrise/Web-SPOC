import React, { useEffect } from 'react'
import { connect } from 'dva'
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
  Checkbox,
} from '@/components'

const styles = () => ({})

const Detail = ({ medicationDetail, dispatch }) => {
  useEffect(() => {
    if (medicationDetail.currentId) {
      dispatch({
        type: 'medicationDetail/query',
        payload: {
          id: medicationDetail.currentId,
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
                  return <TextField label='Medication Code' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='displayValue'
                render={(args) => {
                  return <TextField label='Medication Name' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='description'
                render={(args) => {
                  return <TextField label='Description' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remark'
                render={(args) => {
                  return (
                    <TextField label='Remark' multiline rowsMax='5' {...args} />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='isEnableRetail'
                render={(args) => {
                  return (
                    <Checkbox
                      prefix='Enable Retail'
                      isSwitch
                      colon={false}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='sDDID'
                render={(args) => {
                  return <TextField label='SDD ID' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='sDDDescription'
                render={(args) => {
                  return (
                    <Select label='SDD Description' options={[]} {...args} />
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
                    label='Supplier'
                    code='Supplier'
                    max={10}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='medicationGroup'
                render={(args) => (
                  <Select label='Medication Group' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='revenueCategory'
                render={(args) => (
                  <Select label='Revenue Category' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveStartDate'
                render={(args) => (
                  <DatePicker label='Effective Start Date' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveEndDate'
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
  connect(({ medicationDetail }) => ({
    medicationDetail,
  })),
)(Detail)
