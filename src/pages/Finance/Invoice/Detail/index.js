import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { CardContainer } from '@/components'

import Detail from './Detail'

class InvoiceDetail extends PureComponent {
  render () {
    return (
      <CardContainer
        title={<FormattedMessage id='menu.finance.invoice/detail' />}
      >
        <Detail />
      </CardContainer>
    )
  }
}

export default InvoiceDetail
