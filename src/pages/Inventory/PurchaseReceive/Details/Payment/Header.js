import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  DatePicker,
  NumberInput,
} from '@/components'
const poPrefix = 'purchaseOrderDetails'

class Header extends PureComponent {
  render () {
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs>
            <FastField
              name={`${poPrefix}.purchaseOrderNo`}
              render={(args) => (
                <TextField
                  disabled
                  label={formatMessage({
                    id: 'inventory.pr.detail.payment.poNo',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name={`${poPrefix}.purchaseOrderDate`}
              render={(args) => (
                <DatePicker
                  disabled
                  label={formatMessage({
                    id: 'inventory.pr.detail.payment.purchaseOrderDate',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs>
            <FastField
              name={`${poPrefix}.invoiceTotal`}
              render={(args) => (
                <NumberInput
                  disabled
                  currency
                  label={formatMessage({
                    id: 'inventory.pr.detail.payment.invoiceAmount',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name={`${poPrefix}.outstandingAmount`}
              render={(args) => (
                <NumberInput
                  disabled
                  currency
                  label={formatMessage({
                    id: 'inventory.pr.detail.payment.outstandingAmount',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default Header
