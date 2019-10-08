import Details from './Details'
import CollectPaymentConfirm from './CollectPaymentConfirm'

const addContent = (tabNo, props, type) => {
  switch (tabNo) {
    case 1:
      return <Details {...props} type={type} />
    default:
      return <CollectPaymentConfirm {...props} />
  }
}

export const StatementDetailOption = (detailsProps, type) => [
  {
    id: 0,
    name: 'Statement Details',
    content: addContent(1, detailsProps, type),
  },
  {
    id: 1,
    name: 'Payment Details',
    content: addContent(2, detailsProps),
  },
]
