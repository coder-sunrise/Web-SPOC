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

const FilterBar = ({ handleSubmit, isSubmitting, values }) => {
  const { inventoryType = [] } = values
  const maxinventorytypeCount = inventoryType.length <= 1 ? 1 : 0
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={3}>
            <FastField
              name='isActive'
              render={args => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='inventoryType'
              render={args => {
                return (
                  <Select
                    {...args}
                    label='Inventory Type'
                    mode='multiple'
                    options={[
                      { name: 'Ophthalmic Product', value: 'CONSUMABLE' },
                    ]}
                    all={-99}
                    maxTagCount={maxinventorytypeCount}
                    maxTagPlaceholder='inventory types'
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
