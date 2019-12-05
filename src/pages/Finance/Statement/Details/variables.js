import Details from './Details'
import CollectPaymentConfirm from './CollectPaymentConfirm'

const addContent = (tabNo, props, type) => {
  switch (tabNo) {
    case 1:
      return <Details {...props} type={type} />
    default:
      return <CollectPaymentConfirm {...props} disabled />
  }
}

export const StatementDetailOption = (detailsProps, type) => {
  const { statementInvoice } = detailsProps.values
  const disabledPayment = !statementInvoice || statementInvoice.length <= 0

  return [
    {
      id: 0,
      name: 'Statement Details',
      content: addContent(1, detailsProps, type),
    },
    {
      id: 1,
      name: 'Payment',
      content: addContent(2, detailsProps),
      disabled: disabledPayment,
    },
  ]
}
