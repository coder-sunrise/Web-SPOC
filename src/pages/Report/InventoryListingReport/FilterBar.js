import React from 'react'
// formik
import { FastField, Field } from 'formik'
import { status } from '@/utils/codes'
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

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={4}>
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
                    ]}
                    onChange={(e) => {
                      if (e) {
                        fm.setFieldValue('items', undefined)
                      }
                    }}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={4}>
          <FastField
          name='Suppliers'
          render={(args) => (
            <CodeSelect
              label='Supplier'
              code='ctSupplier'
              mode='multiple'
              labelField='displayValue'
              {...args}
            />
          )}
        />
        </GridItem>
          <GridItem md={4} />
          <GridItem md={4}>
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
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='IsActive'
              render={(args) => {
                return <Select label='Status' {...args} options={status} />
              }}
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
