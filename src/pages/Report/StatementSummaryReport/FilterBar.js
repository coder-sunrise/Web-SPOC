import React from 'react'
// formik
import { FastField, Field } from 'formik'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  Checkbox,
  CodeSelect,
  Select,
} from '@/components'
import { osBalanceStatus } from '@/utils/codes'
import AuthorizedContext from '@/components/Context/Authorized'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting, values, setFieldValue }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker />
          <GridItem md={1}>
            <FastField
              name='asAt'
              render={(args) => <Checkbox {...args} label='Till Today' />}
            />
          </GridItem>
          <GridItem md={6} />

          <GridItem md={2}>
            <Field
              name='companyIDS'
              render={(args) => (
                <CodeSelect
                  {...args}
                  code='ctcopayer'
                  labelField='displayValue'
                  mode='multiple'
                  label='Company'
                  onChange={(val) => {
                    if (val.length === 0 && values.isPrintDetails) {
                      setFieldValue('isPrintDetails', false)
                    }
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='outstandingBalanceStatus'
              render={(args) => {
                return (
                  <Select
                    label='O/S Balance'
                    options={osBalanceStatus}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={8}>
            <div>
              <div style={{ display: 'inline-Block' }}>
                <FastField
                  name='groupByCompany'
                  render={(args) => (
                    <Checkbox {...args} label='Group By Company' />
                  )}
                />
              </div>
              <div style={{ display: 'inline-Block', marginLeft: 10 }}>
                <AuthorizedContext.Provider
                  style={{ padding: 0 }}
                  value={{
                    rights:
                      (values.companyIDS || []).length === 0
                        ? 'disable'
                        : 'enable',
                  }}
                >
                  <FastField
                    name='isPrintDetails'
                    render={(args) => (
                      <Checkbox {...args} label='Print Details' />
                    )}
                  />
                </AuthorizedContext.Provider>
              </div>
              <div style={{ display: 'inline-Block', marginLeft: 10 }}>
                <Button
                  color='primary'
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
