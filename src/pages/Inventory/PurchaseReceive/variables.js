// material ui icons
import moment from 'moment'
import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'
import Authorized from '@/utils/Authorized'

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

const isDuplicatePOAllowed = status => {
  const allowedStatus = [
    'Partially Received',
    'Finalized',
    'Fulfilled',
    'Completed',
  ]
  return !(allowedStatus.indexOf(status) > -1)
}

export const isPOStatusDraft = status => {
  const allowedStatus = [
    // 'Draft',
    1,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const enableSaveButton = status => {
  const allowedStatus = [
    // 'Draft',
    1,
    2,
    3,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const isInvoiceReadOnly = status => {
  const allowedStatus = [
    // 'Draft',
    // 'Cancelled',
    1,
    4,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const isPOStatusFinalizedFulFilledPartialReceived = status => {
  const allowedStatus = [
    2, // Finalized
    3, // Partial Received
    5, // Fulfilled
  ]
  return allowedStatus.indexOf(status) > -1
}

export const isPOStatusFulfilled = status => {
  const allowedStatus = [5]
  return allowedStatus.indexOf(status) > -1
}

export const getPurchaseOrderStatusFK = status => {
  let purchaseOrderStatusFK = {}
  if (typeof status === 'number') {
    purchaseOrderStatusFK = LTPurchaseOrderStatus.find(x => x.id === status)
  } else {
    purchaseOrderStatusFK = LTPurchaseOrderStatus.find(
      x => x.name.toLowerCase() === status.toLowerCase(),
    )
  }

  return purchaseOrderStatusFK
}

export const getInvoiceStatusFK = status => {
  const invoiceStatusFK = LTInvoiceStatus.find(
    x => x.name.toLowerCase() === status.toLowerCase(),
  )
  return invoiceStatusFK
}

export const PurchaseReceiveGridCol = [
  { name: 'purchaseOrderNo', title: 'PO No' },
  { name: 'purchaseOrderDate', title: 'PO Date' },
  { name: 'supplier', title: 'Supplier' },
  { name: 'exceptedDeliveryDate', title: 'Expected Delivery Date' },
  { name: 'purchaseOrderStatus', title: 'PO Status' },
  { name: 'totalAftGst', title: 'Total' },
  { name: 'outstanding', title: 'Outstanding' },
  { name: 'invoiceStatus', title: 'Inv. Status' },
  { name: 'remark', title: 'Remarks' },
  { name: 'action', title: 'Action' },
]

export const ContextMenuOptions = row => {
  const createAuthority = Authorized.check(
    'purchasingandreceiving.newpurchasingandreceiving',
  ) || { rights: 'hidden' }
  const viewEditAuthority = Authorized.check(
    'purchasingandreceiving.purchasingandreceivingdetails',
  ) || { rights: 'hidden' }

  let menuOptions = [
    {
      id: 0,
      label: `Edit`,
      Icon: Edit,
      disabled: viewEditAuthority.rights !== 'enable',
      width: 130,
    },
    {
      id: 1,
      label: 'Duplicate PO',
      Icon: Duplicate,
      disabled:
        isDuplicatePOAllowed(row.purchaseOrderStatus) ||
        createAuthority.rights !== 'enable',
    },
    { isDivider: true },
    {
      id: 2,
      label: 'Print',
      Icon: Print,
      disabled: false,
      width: 130,
    },
  ]

  if (
    !createAuthority ||
    (createAuthority && createAuthority.rights === 'hidden')
  )
    menuOptions = menuOptions.filter(option => option.id !== 1)

  if (
    !viewEditAuthority ||
    (viewEditAuthority && viewEditAuthority.rights === 'hidden')
  )
    menuOptions = menuOptions.filter(option => option.id !== 0)

  return menuOptions
}

export const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}
 
export const getAccessRight = (
  authorityUrl = 'purchasingandreceiving.purchasingandreceivingdetails',
) => {
  const accessRight = Authorized.check(authorityUrl)

  let allowAccess = false

  if (!accessRight || accessRight.rights === 'hidden') return allowAccess
  if (accessRight.rights === 'readwrite' || accessRight.rights === 'enable')
    allowAccess = true
    
  return allowAccess
}
