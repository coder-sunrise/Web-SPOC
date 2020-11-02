import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  NumberInput,
} from '@/components'
import { INVOICE_STATUS } from '@/utils/constants'

class Header extends PureComponent {
  render () {
    const {
      receivingGoodsDetails: {
        receivingGoods: {
          receivingGoodsNo,
          receivingGoodsDate,
          totalAftGST,
          invoiceStatusFK,
        },
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
              value={
                invoiceStatusFK === INVOICE_STATUS.WRITEOFF ? (
                  0
                ) : (
                  totalAftGST - getTotalPaid()
                )
              }
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default Header
