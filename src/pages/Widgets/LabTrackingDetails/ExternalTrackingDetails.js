import React from 'react'
import {
  CardContainer,
  CodeSelect,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  NumberInput,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { LAB_TRACKING_STATUS } from '@/utils/constants'

export default props => {
  const {
    values: { statusFK },
  } = props
  return (
    <Authorized authority='reception/labtracking'>
      <CardContainer hideHeader size='sm' style={{ margin: 0 }}>
        <GridContainer>
          <GridItem md={5}>
            <FastField
              name='supplierFK'
              render={args => (
                <CodeSelect
                  label='Supplier'
                  labelField='displayValue'
                  {...args}
                  code='CTSupplier'
                />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem xs sm={5} md={5}>
            <FastField
              name='orderedDate'
              render={args => (
                <DatePicker label='Ordered Date' {...args} timeFormat={false} />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem md={5}>
            <FastField
              name='jobReferenceNo'
              render={args => (
                <TextField label='Job Reference No.' {...args} disabled />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem xs sm={5} md={5}>
            <FastField
              name='requiredDate'
              render={args => (
                <DatePicker
                  label='Required Date'
                  {...args}
                  timeFormat={false}
                />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem md={5}>
            <FastField
              name='salesType'
              render={args => (
                <TextField label='Sales Type' {...args} disabled />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem xs sm={5} md={5}>
            <FastField
              name='invoiceDate'
              render={args => (
                <DatePicker label='Invoice Date' {...args} timeFormat={false} />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem md={5}>
            <FastField
              name='invoiceNo'
              render={args => (
                <TextField label='Invoice No.' {...args} maxLength={200} />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem md={5}>
            <FastField
              name='invoiceAmount'
              render={args => (
                <NumberInput
                  label='Invoice Amount (SGD)'
                  {...args}
                  min={0}
                  currency
                  max={999999}
                />
              )}
            />
          </GridItem>
          <GridItem md={11}>
            <FastField
              name='remarks'
              render={args => (
                <TextField
                  label='Internal Remarks'
                  {...args}
                  maxLength={2000}
                />
              )}
            />
          </GridItem>
          {statusFK === LAB_TRACKING_STATUS.WRITEOFF && (
            <GridItem md={11}>
              <FastField
                name='writeOffReason'
                render={args => (
                  <TextField
                    label='Write Off Reason'
                    {...args}
                    maxLength={2000}
                  />
                )}
              />
            </GridItem>
          )}
        </GridContainer>
      </CardContainer>
    </Authorized>
  )
}
