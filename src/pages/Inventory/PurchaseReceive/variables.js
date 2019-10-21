// material ui icons
import moment from 'moment'
import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'

export const poSubmitAction = {
  SAVE: 1,
  CANCEL: 2,
  FINALIZE: 3,
  COMPLETE: 4,
  PRINT: 5,
}

const LTPurchaseOrderStatus = [
  {
    code: 'DRAFT',
    name: 'Draft',
    id: 1,
  },
  {
    code: 'FINALIZED',
    name: 'Finalized',
    id: 2,
  },
  {
    code: 'PARTIALREVD',
    name: 'Partially Received',
    id: 3,
  },
  {
    code: 'CANCELLED',
    name: 'Cancelled',
    id: 4,
  },
  {
    code: 'FULFILLED',
    name: 'Fulfilled',
    id: 5,
  },
  {
    code: 'COMPLETED',
    name: 'Completed',
    id: 6,
  },
]

const LTInvoiceStatus = [
  {
    code: 'PAID',
    name: 'Paid',
    id: 1,
  },
  {
    code: 'OVERPAID',
    name: 'Overpaid',
    id: 2,
  },
  {
    code: 'OUTSTANDING',
    name: 'Outstanding',
    id: 3,
  },
  {
    code: 'WRITEOFF',
    name: 'Write-Off',
    id: 4,
  },
]

const isDuplicatePOAllowed = (status) => {
  const allowedStatus = [
    'Partially Received',
    'Finalized',
    'Fulfilled',
    // 2,
    // 3,
    // 5,
  ]
  return !(allowedStatus.indexOf(status) > -1)
}

export const isPOStatusDraft = (status) => {
  const allowedStatus = [
    // 'Draft',
    1,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const isPOStatusFinalized = (status) => {
  const allowedStatus = [
    // 'Finalized',
    2,
    3,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const isPOStatusFulfilled = (status) => {
  const allowedStatus = [
    5,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const getPurchaseOrderStatusFK = (status) => {
  let purchaseOrderStatusFK = {}
  if (typeof status === 'number') {
    purchaseOrderStatusFK = LTPurchaseOrderStatus.find((x) => x.id === status)
  } else {
    purchaseOrderStatusFK = LTPurchaseOrderStatus.find(
      (x) => x.name.toLowerCase() === status.toLowerCase(),
    )
  }

  return purchaseOrderStatusFK
}

export const getInvoiceStatusFK = (status) => {
  const invoiceStatusFK = LTInvoiceStatus.find(
    (x) => x.name.toLowerCase() === status.toLowerCase(),
  )
  return invoiceStatusFK
}

export const PurchaseReceiveGridCol = [
  { name: 'purchaseOrderNo', title: 'PO No' },
  { name: 'purchaseOrderDate', title: 'PO Date' },
  { name: 'supplier', title: 'Supplier' },
  { name: 'exceptedDeliveryDate', title: 'Expected Delivery Date' },
  { name: 'purchaseOrderStatus', title: 'PO Status' },
  { name: 'totalAmount', title: 'Total' },
  { name: 'outstanding', title: 'Outstanding' },
  { name: 'invoiceStatus', title: 'Inv. Status' },
  { name: 'remark', title: 'Remarks' },
  { name: 'action', title: 'Action' },
]

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
      disabled: isDuplicatePOAllowed(row.purchaseOrderStatus),
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
    poNo: 'PO/000999',
    poDate: moment(),
    //status: 'Draft',
    status: 'Finalized',
    shippingAddress:
      '24 Raffles Place, Clifford Centre, #07-02A, Singapore 048621',
    IsGSTEnabled: true,
    IsGSTInclusive: true,
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

export const fakeDOQueryDoneData = [
  {
    id: 1,
    doNo: 'DO/000001',
    doDate: moment(),
    total: 20,
    outstanding: 15,
    remarks: 'Will provide on 31 Jun 2018',
  },
  {
    id: 2,
    doNo: 'DO/000002',
    doDate: moment(),
    total: 50,
    outstanding: 0,
    remarks: 'Completed',
  },
  {
    id: 3,
    doNo: 'DO/000003',
    doDate: moment(),
    total: 20,
    outstanding: 15,
    remarks: 'Need Another Orders',
  },
  {
    id: 4,
    doNo: 'DO/000004',
    doDate: moment(),
    total: 20,
    outstanding: 15,
    remarks: 'Need Another Orders',
  },
  {
    id: 5,
    doNo: 'DO/000004',
    doDate: moment(),
    total: 20,
    outstanding: 15,
    remarks: 'Need Another Orders',
  },
]

export const fakePodoPaymentData = [
  {
    id: 1,
    paymentNo: 'P/000001',
    paymentDate: moment(),
    paymentMode: 'Cash',
    reference: 'REF/000001',
    paymentAmount: 119.99,
    remarks: 'Paid',
  },
  {
    id: 2,
    paymentNo: 'P/000002',
    paymentDate: moment(),
    paymentMode: 'Cash',
    reference: 'REF/000002',
    paymentAmount: 129.99,
    remarks: 'Paid',
  },
]
