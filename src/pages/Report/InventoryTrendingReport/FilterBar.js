import React from 'react'
// formik
import { FastField, Field } from 'formik'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  CodeSelect,
  RadioGroup,
  Select,
  Checkbox,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({
  handleSubmit,
  handleTypeChanged,
  isSubmitting,
  ...restProps
}) => {
  const { inventoryType = undefined, serviceItems = [] } = restProps

  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={2}>
            <FastField
              name='viewBy'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='View By'
                  options={[
                    {
                      value: 'Monthly',
                      label: 'Monthly',
                    },
                    {
                      value: 'Weekly',
                      label: 'Weekly',
                    },
                  ]}
                />
              )}
            />
          </GridItem>
          <ReportDateRangePicker
            fromDateFieldName='listingFrom'
            toDateFieldName='listingTo'
          />
          <GridItem md={2}>
            <Field
              name='inventoryType'
              render={(args) => {
                const { form: fm } = args
                return (
                  <Select
                    {...args}
                    label='Inventory Type'
                    options={[
                      { name: 'Medication', value: 'MEDICATION' },
                      { name: 'Consumable', value: 'CONSUMABLE' },
                      { name: 'Vaccination', value: 'VACCINATION' },
                      { name: 'Service', value: 'SERVICE' },
                    ]}
                    onChange={(e) => {
                      if (e) {
                        fm.setFieldValue('items', undefined)
                      }
                      handleTypeChanged(e)
                    }}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={4} />
          <GridItem md={4}>
            {inventoryType === 'SERVICE' ? (
              <Field
                name='items'
                render={(args) => {
                  return (
                    <Select
                      {...args}
                      label='Item List'
                      mode='multiple'
                      options={serviceItems}
                      valueField='value'
                      labelField='name'
                      temp
                    />
                  )
                }}
              />
            ) : (
              <Field
                name='items'
                render={(args) => {
                  const { form } = args
                  return (
                    <CodeSelect
                      {...args}
                      label='Item List'
                      mode='multiple'
                      code={`inventory${form.values.inventoryType}`}
                      labelField='displayValue'
                      temp
                    />
                  )
                }}
              />
            )}
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='showDetails'
              render={(args) => (
                <Checkbox {...args} label='Show Report Details' />
              )}
            />
          </GridItem>

          <GridItem md={3}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
