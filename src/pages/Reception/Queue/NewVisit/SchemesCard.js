import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import {
  DatePicker,
  TextField,
  CommonCard,
  GridContainer,
  GridItem,
} from '@/components'

class SchemesCard extends PureComponent {
  render () {
    return (
      <CommonCard size='sm' title='Schemes'>
        <GridContainer>
          <GridItem xs md={12}>
            <FastField
              name='AccountNo'
              render={(args) => (
                <TextField
                  {...args}
                  disabled
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.accountNo',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name='Balance'
              render={(args) => (
                <TextField
                  {...args}
                  currency
                  disabled
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.balance',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name='Validity'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.validity',
                  })}
                  {...args}
                  disabled
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default SchemesCard
