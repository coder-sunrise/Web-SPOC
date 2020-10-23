import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  NumberInput,
} from '@/components'

class Header extends PureComponent {
  render () {
    const {
      receivingGoodsDetails: {
        receivingGoods: { receivingGoodsNo, receivingGoodsDate, totalAftGST },
      },
      getTotalPaid,
    } = this.props
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs>
            <TextField
              disabled
              label={formatMessage({
                id: 'inventory.rg.detail.payment.rgNo',
              })}
              value={receivingGoodsNo}
            />
          </GridItem>
          <GridItem xs>
            <DatePicker
              disabled
              label={formatMessage({
                id: 'inventory.rg.detail.payment.receivingGoodsDate',
              })}
              value={receivingGoodsDate}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs>
            <NumberInput
              disabled
              currency
              label={formatMessage({
                id: 'inventory.rg.detail.payment.invoiceAmount',
              })}
              value={totalAftGST}
            />
          </GridItem>
          <GridItem xs>
            <NumberInput
              disabled
              currency
              label={formatMessage({
                id: 'inventory.rg.detail.payment.outstandingAmount',
              })}
              value={totalAftGST - getTotalPaid()}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default Header
