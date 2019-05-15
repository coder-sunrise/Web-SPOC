import React, { PureComponent } from 'react'
// umi locale
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { Field, FastField } from 'formik'
// custom component
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  TextField,
} from '@/components'
// code tables
import { precautions } from '@/utils/codes'

class OtherControl extends PureComponent {
  render () {
    return (
      <GridItem md={9}>
        <GridContainer>
          <GridItem md={12}>
            <Field
              name='OpenCode'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.otherItem.openCode',
                  })}
                  disabled
                  options={precautions}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='Description'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.dispense.otherItem.description',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='Remarks'
              render={(args) => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={5}
                  label={formatMessage({
                    id: 'reception.queue.dispense.otherItem.remarks',
                  })}
                />
              )}
            />
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
      </GridItem>
    )
  }
}

export default OtherControl
