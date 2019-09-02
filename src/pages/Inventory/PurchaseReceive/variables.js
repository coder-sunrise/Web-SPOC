// material ui icons
import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'
import { formatMessage } from 'umi/locale'
import PurchaseOrder from './Details/PurchaseOrder'
import DeliveryOrder from './Details/DeliveryOrder'

export const ContextMenuOptions = [
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
    disabled: false,
  },
  { isDivider: true },
  {
    id: 2,
    label: 'Print',
    Icon: Print,
    disabled: false,
  },
]

const addContent = (type) => {
  switch (type) {
    case 1:
      return <PurchaseOrder />
    case 2:
      return <DeliveryOrder />
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
