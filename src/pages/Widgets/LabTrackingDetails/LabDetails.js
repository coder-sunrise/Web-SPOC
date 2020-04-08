import React from 'react'
import { CardContainer, CodeSelect, CommonTableGrid, FastField, GridContainer, GridItem, TextField, DatePicker } from '@/components'
import NumberInput from '@/components/NumberInput'

export default ({ classes, current, fieldName = '' }) => {

  return (
    <CardContainer
      hideHeader
      size='sm'
      style={{margin:0}}
    >
      <GridContainer>
        <GridItem md={4}>
          <FastField
            name='supplierFK'
            render={(args) => (
              <CodeSelect
                label='Supplier'
                labelField='displayValue'
                {...args}
                code='CTSupplier'
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem xs sm={4} md={3}>
          <FastField
            name='orderedDate'
            render={(args) => (
              <DatePicker
                label='Ordered Date'
                {...args}
                timeFormat={false}
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={4}>
          <FastField
            name='labSheetNo'
            render={(args) => (
              <TextField label='Lab Sheet No' {...args}  />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem xs sm={4} md={3}>
          <FastField
            name='estimateReceiveDate'
            render={(args) => (
              <DatePicker
                style={{ width: '100%' }}
                label='Estimated Receive Date'
                {...args}
                timeFormat={false}
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={4}>
          <FastField
            name='caseTypeDisplayValue'
            render={(args) => (
              <CodeSelect
                label='Case Type'
                valueField='DisplayValue'
                {...args}
                code='CTCaseType'
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem xs sm={4} md={3}>
          <FastField
            name='receivedDate'
            render={(args) => (
              <DatePicker
                style={{ width: '100%' }}
                label='Received Date'
                {...args}
                timeFormat={false}
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={4}>
          <FastField
            name='caseDescriptionFK'
            render={(args) => (
              <CodeSelect
                label='Case Description'
                {...args}
                code='CTCaseDescription'
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={4}>
          <FastField
            name='sentBy'
            render={(args) => (
              <TextField label='Sent By' {...args}  />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={4}>
          <FastField
            name='units'
            render={(args) => (
              <NumberInput
                {...args}
                max={9999}
                min={0}
                maxLength={4}
                label='No. of Units'
              />
            )}
          />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={4}>
          <FastField
            name='receivedBy'
            render={(args) => (
              <TextField label='Received By (in Lab)' {...args}  />
            )}
          />
        </GridItem>
        <GridItem md={2} />
      </GridContainer>
    </CardContainer>
  )
}
