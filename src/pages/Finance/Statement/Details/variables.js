import Details from './Details'
import CollectPaymentConfirm from './CollectPaymentConfirm'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <Details {...props} />
    default:
      return <CollectPaymentConfirm {...props} />
  }
}

export const StatementDetailOption = (detailsProps) => [
  {
    id: 0,
    name: 'Statement Details',
    content: addContent(1, detailsProps),
  },
  {
    id: 1,
    name: 'Payment Details',
    content: addContent(2, detailsProps),
  },
]
