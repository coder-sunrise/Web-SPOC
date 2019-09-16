// material ui icons
import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'
import { formatMessage } from 'umi/locale'
import PurchaseOrder from './Details/PurchaseOrder'
import DeliveryOrder from './Details/DeliveryOrder'
import Payment from './Details/Payment'

const isDuplicatePOAllowed = (status) => {
  const allowedStatus = ['Partially Received', 'Finalized', 'Fulfilled']
  return !(allowedStatus.indexOf(status) > -1)
}

export const ContextMenuOptions = (row) => {
  return [
    {
      id: 0,
      label: 'Edit',
      Icon: Edit,
      disabled: false,
    },
    {
      id: 1,
      label: 'Duplicate PO',
      Icon: Duplicate,
      disabled: isDuplicatePOAllowed(row.poStatus),
    },
    { isDivider: true },
    {
      id: 2,
      label: 'Print',
      Icon: Print,
      disabled: false,
    },
  ]
}

const addContent = (type) => {
  switch (type) {
    case 1:
      return <PurchaseOrder />
    case 2:
      return <DeliveryOrder />
    case 3:
      return <Payment />
    default:
      return <PurchaseOrder />
  }
}

export const PurchaseReceiveDetailOption = [
  {
    id: 0,
    name: formatMessage({
      id: 'inventory.pr.detail.pod',
    }),
    content: addContent(1),
  },
  {
    id: 1,
    name: formatMessage({
      id: 'inventory.pr.detail.dod',
    }),
    content: addContent(2),
  },
  {
    id: 2,
    name: formatMessage({
      id: 'inventory.pr.detail.payment',
    }),
    content: addContent(3),
  },
]

export const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}
