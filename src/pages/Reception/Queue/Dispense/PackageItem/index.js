import React, { PureComponent } from 'react'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { Field } from 'formik'
// custom components
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  Select,
} from '@/components'
// sub components
import ItemGrid from './ItemGrid'
import OpenPackageItem from './OpenPackageItem'
// code table
import { consumptionMethods, packageTypes } from '@/utils/codes'

const COLUMNS = [
  { name: 'item', title: 'Item' },
  { name: 'price', title: 'Price' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'subtotal', title: 'Subtotal' },
  { name: 'consumed', title: 'Consumed' },
]

class PackageItem extends PureComponent {
  render () {
    const { formValues } = this.props
    console.log('packageitem', formValues)
    return (
      <GridContainer>
        <GridItem md={2}>
          <Field
            name='packageFormValues.packageType'
            render={(args) => (
              <Select
                label={formatMessage({
                  id: 'reception.queue.dispense.packageItem.packageType',
                })}
                options={packageTypes}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={3}>
          <Field
            name='packageFormValues.package'
            render={(args) => (
              <Select
                label={formatMessage({
                  id: 'reception.queue.dispense.packageItem.package',
                })}
                options={consumptionMethods}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={2}>
          {formValues.packageType !== undefined &&
          formValues.packageType !== '' && (
            <Field
              name='packageFormValues.expireDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.dispense.packageItem.expireDate',
                  })}
                />
              )}
            />
          )}
        </GridItem>
        <GridItem md={12}>
          <div style={{ minHeight: '25vh' }}>
            {formValues.packageType === 'package' && <ItemGrid />}
            {formValues.packageType === 'openpackage' && <OpenPackageItem />}
          </div>
        </GridItem>
        <GridItem md={12}>
          <GridContainer justify='center' alignItems='center'>
            <GridItem xs md={6} className='centerizedContent topSpacing'>
              <Button color='success'>
                <FormattedMessage id='reception.queue.dispense.button.add' />
              </Button>
              <Button color='danger'>
                <FormattedMessage id='reception.queue.dispense.button.reset' />
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    )
  }
}

export default PackageItem
