import { formatMessage } from 'umi/locale'
import PurchaseOrder from './Details/PurchaseOrder'
import DeliveryOrder from './Details/DeliveryOrder'
import Payment from './Details/Payment'

export const tabbedPaneAvailability = (status) => {
  const allowedStatus = [
    // 'Draft',
    1,
    4,
  ]
  return allowedStatus.indexOf(status) > -1
}

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <PurchaseOrder {...props} />
    case 2:
      return <DeliveryOrder {...props} />
    case 3:
      return <Payment {...props} />
    default:
      return <PurchaseOrder {...props} />
  }
}

export const PurchaseReceiveDetailOption = (poStatus, props) => [
  {
    id: 0,
    name: formatMessage({
      id: 'inventory.pr.detail.pod',
    }),
    content: addContent(1, props),
  },
  {
    id: 1,
    name: formatMessage({
      id: 'inventory.pr.detail.dod',
    }),
    content: addContent(2, props),
    disabled: tabbedPaneAvailability(poStatus),
  },
  {
    id: 2,
    name: formatMessage({
      id: 'inventory.pr.detail.payment',
    }),
    content: addContent(3, props),
    disabled: tabbedPaneAvailability(poStatus),
  },
]
