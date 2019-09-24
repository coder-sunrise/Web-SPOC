import React, { PureComponent } from 'react'
import moment from 'moment'
import { formatMessage } from 'umi/locale'
import {
  CardContainer,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  OutlinedTextField,
  EditableTableGrid,
  Button,
  NumberInput,
  withFormik,
} from '@/components'

@withFormikExtend({
  displayName: 'purchaseOrderPayment',
  mapPropsToValues: ({ purchaseOrderPayment }) => {
    return purchaseOrderPayment.entity || purchaseOrderPayment.default
  },
})
class Header extends PureComponent {
  render () {
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs>
            <FastField
              name='poNo'
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
              name='purchaseOrderDate'
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
              name='invoiceAmount'
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
              name='outstandingAmount'
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
