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
  Select,
} from '@/components'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={3}>
            <FastField
              name='isActive'
              render={(args) => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridItem md={3}>
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
