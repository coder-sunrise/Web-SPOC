import { formatMessage } from 'umi/locale'
import ReceivingGoods from './Details/ReceivingGoods'
import Payment from './Details/Payment'

export const tabbedPaneAvailability = (status) => {
  const allowedStatus = [
    // 'Draft',
    1,
    2,
  ]
  return allowedStatus.indexOf(status) > -1
}

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <ReceivingGoods {...props} />
    case 2:
      return <Payment {...props} />
    default:
      return <ReceivingGoods {...props} />
  }
}

export const ReceivingGoodsDetailOption = (rgStatus, props) => [
  {
    id: 0,
    name: formatMessage({
      id: 'inventory.rg.detail.rgd',
    }),
    content: addContent(1, props),
  },
  {
    id: 1,
    name: formatMessage({
      id: 'inventory.rg.detail.payment',
    }),
    content: addContent(2, props),
    disabled: tabbedPaneAvailability(rgStatus),
  },
]
