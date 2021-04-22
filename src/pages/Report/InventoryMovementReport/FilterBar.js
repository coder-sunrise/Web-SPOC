import React from 'react'
// formik
import { Field } from 'formik'
// common components
import { Button, GridContainer, GridItem, SizeContainer, CodeSelect, Select } from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size="sm">
      <React.Fragment>
        <GridContainer alignItems="flex-end">
          <ReportDateRangePicker />
          <GridItem md={8} />
          <GridItem md={2}>
            <Field
              name="inventoryType"
              render={(args) => {
                const { form: fm } = args
                return (
                  <Select
                    {...args}
                    label="Inventory Type"
                    options={[
                      { name: 'Medication', value: 'MEDICATION' },
                      { name: 'Consumable', value: 'CONSUMABLE' },
                      { name: 'Vaccination', value: 'VACCINATION' },
                    ]}
                    allowClear={false}
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
          <GridItem md={2}>
            <Field
              name="items"
              render={(args) => {
                const { form } = args
                return (
                  <CodeSelect
                    {...args}
                    label="Item List"
                    mode="multiple"
                    code={`Inventory${form.values.inventoryType}`}
                    labelField="displayValue"
                    temp
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={3}>
            <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar