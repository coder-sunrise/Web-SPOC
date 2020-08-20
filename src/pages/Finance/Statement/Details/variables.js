import Details from './Details'
import CollectPaymentConfirm from './CollectPaymentConfirm'
import PaymentHistory from './PaymentHistory'

const addContent = (tabNo, props, func) => {
  switch (tabNo) {
    case 3:
      return <PaymentHistory {...props} />
    case 1:
      return <Details {...props} fetchLatestBizSessions={func} />
    default:
      return <CollectPaymentConfirm {...props} disabled getBizList={func} />
  }
}

export const StatementDetailOption = (
  detailsProps,
  fetchLatestBizSessions,
  getBizList,
) => {
  const { statementInvoice } = detailsProps.values
  const disabledPayment = !statementInvoice || statementInvoice.length <= 0

  return [
    {
      id: 0,
      name: 'Statement Details',
      content: addContent(1, detailsProps, fetchLatestBizSessions),
    },
    {
      id: 1,
      name: 'Payment',
      content: addContent(2, detailsProps, getBizList),
      disabled: disabledPayment,
    },
    {
      id: 2,
      name: 'Payment History',
      content: addContent(3, detailsProps),
    },
  ]
}
