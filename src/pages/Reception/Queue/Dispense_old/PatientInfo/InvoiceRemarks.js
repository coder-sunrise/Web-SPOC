import React, { PureComponent } from 'react'
// umi
import { formatMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// custom component
import {
  GridContainer,
  GridItem,
  Button,
  OutlinedTextField,
} from '@/components'

class InvoiceRemarks extends PureComponent {
  render () {
    return (
      <GridContainer direction='column'>
        <GridItem xs md={12}>
          <FastField
            name='InvoiceRemarks'
            render={(args) => (
              <OutlinedTextField
                {...args}
                multiline
                rowsMax={6}
                rows={4}
                label={formatMessage({
                  id: 'reception.common.remarks',
                })}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={12} container justify='center' alignItems='center'>
          <GridItem xs md={12}>
            <Button color='primary'>Ok</Button>
          </GridItem>
        </GridItem>
      </GridContainer>
    )
  }
}

export default InvoiceRemarks
