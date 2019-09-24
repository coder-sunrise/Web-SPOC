// material ui icons
import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'
import { formatMessage } from 'umi/locale'
import PurchaseOrder from './Details/PurchaseOrder'
import DeliveryOrder from './Details/DeliveryOrder'
import Payment from './Details/Payment'
import moment from 'moment'

const isDuplicatePOAllowed = (status) => {
  const allowedStatus = [
    'Partially Received',
    'Finalized',
    'Fulfilled',
  ]
  return !(allowedStatus.indexOf(status) > -1)
}

export const isPOStatusDraft = (status) => {
  const allowedStatus = [
    'Draft',
    'Cancelled',
  ]
  return allowedStatus.indexOf(status) > -1
}

export const isPOStatusFinalized = (status) => {
  const allowedStatus = [
    'Finalized',
  ]
  return allowedStatus.indexOf(status) > -1
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

export const PurchaseReceiveDetailOption = (isDraft) => [
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
    disabled: isDraft,
  },
  {
    id: 2,
    name: formatMessage({
      id: 'inventory.pr.detail.payment',
    }),
    content: addContent(3),
    disabled: isDraft,
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

export const fakeQueryDoneData = {
  purchaseOrder: {
    poNo: 'PO/000001',
    poDate: moment(),
    //status: 'Draft',
    status: 'Finalized',
    shippingAddress:
      '24 Raffles Place, Clifford Centre, #07-02A, Singapore 048621',
    gstEnabled: false,
    gstIncluded: false,
    invoiceGST: 10.7,
    invoiceTotal: 163.6,
  },
  rows: [],
  purchaseOrderMedicationItem: [
    {
      id: 1,
      inventoryMedicationFK: 35,
      uom: 35,
      orderQty: 1,
      bonusQty: 0,
      totalQty: 1,
      totalAfterAdjustments: 0.0,
      totalAfterGst: 0.0,
      quantityReceived: 0,
      totalPrice: 25.0,
      unitPrice: 25.0,
      isDeleted: false,
    },
  ],
  purchaseOrderVaccinationItem: [
    {
      id: 1,
      inventoryVaccinationFK: 10,
      uom: 10,
      orderQty: 1,
      bonusQty: 0,
      totalQty: 1,
      totalAfterAdjustments: 0.0,
      totalAfterGst: 0.0,
      quantityReceived: 0,
      totalPrice: 40.0,
      unitPrice: 40.0,
      isDeleted: false,
    },
  ],
  purchaseOrderConsumableItem: [
    {
      id: 1,
      inventoryConsumableFK: 8,
      uom: 8,
      orderQty: 1,
      bonusQty: 0,
      totalQty: 1,
      totalAfterAdjustments: 0.0,
      totalAfterGst: 0.0,
      quantityReceived: 0,
      totalPrice: 48.0,
      unitPrice: 48.0,
      isDeleted: false,
    },
    {
      id: 1,
      inventoryConsumableFK: 10,
      uom: 10,
      orderQty: 1,
      bonusQty: 0,
      totalQty: 1,
      totalAfterAdjustments: 0.0, // tempSubTotal || totalPrice - itemLevelGST
      totalAfterGst: 0.0, // tempSubTotal + itemLevelGST
      quantityReceived: 1,
      totalPrice: 50.0,
      unitPrice: 50.0,
      isDeleted: false,
    },
  ],
  purchaseOrderAdjustment: [
    {
      id: 1,
      adjRemark: 'Adj 001',
      adjType: 'ExactAmount',
      adjValue: -24,
      sequence: 1,
      adjDisplayAmount: -24,
      isDeleted: false,
    },
    {
      id: 2,
      adjRemark: 'Adj 002',
      adjType: 'Percentage',
      adjValue: 10,
      sequence: 2,
      adjDisplayAmount: 13.9,
      isDeleted: false,
    },
  ],
}
