import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'
import Authorized from '@/utils/Authorized'
import { RECEIVING_GOODS_STATUS_TEXT } from '@/utils/constants'

export const rgSubmitAction = {
  SAVE: 1,
  CANCEL: 2,
  COMPLETE: 3,
  UNLOCK: 4,
}

export const LTReceivingGoodsStatus = [
  {
    code: 'DRAFT',
    name: 'Draft',
    id: 1,
  },
  {
    code: 'CANCELLED',
    name: 'Cancelled',
    id: 2,
  },
  {
    code: 'COMPLETED',
    name: 'Completed',
    id: 3,
  },
]

export const LTInvoiceStatus = [
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

export const isRGStatusDraft = (status) => {
  const allowedStatus = [
    // 'Draft',
    1,
  ]
  return allowedStatus.indexOf(status) > -1
}

export const getReceivingGoodsStatusFK = (status) => {
  let receivingGoodsStatusFK = {}
  if (typeof status === 'number') {
    receivingGoodsStatusFK = LTReceivingGoodsStatus.find((x) => x.id === status)
  } else {
    receivingGoodsStatusFK = LTReceivingGoodsStatus.find(
      (x) => x.name.toLowerCase() === status.toLowerCase(),
    )
  }

  return receivingGoodsStatusFK
}

export const getInvoiceStatusFK = (status) => {
  const invoiceStatusFK = LTInvoiceStatus.find(
    (x) => x.name.toLowerCase() === status.toLowerCase(),
  )
  return invoiceStatusFK
}

export const ReceivingGoodsGridCol = [
  { name: 'receivingGoodsNo', title: 'Receiving No.' },
  { name: 'documentNo', title: 'Document No.' },
  { name: 'receivingGoodsDate', title: 'Receiving Date' },
  { name: 'supplier', title: 'Supplier' },
  { name: 'receivingGoodsStatus', title: 'Status' },
  { name: 'totalAftGST', title: 'Total' },
  { name: 'outstanding', title: 'Outstanding' },
  { name: 'invoiceStatus', title: 'Inv. Status' },
  { name: 'remark', title: 'Remarks' },
  { name: 'action', title: 'Action' },
]

export const ContextMenuOptions = (row) => {
  const createAuthority = Authorized.check(
    'receivinggoods.newreceivinggoods',
  ) || { rights: 'hidden' }
  const viewEditAuthority = Authorized.check(
    'receivinggoods.receivinggoodsdetails',
  ) || { rights: 'hidden' }

  let menuOptions = [
    {
      id: 0,
      label: `Edit`,
      Icon: Edit,
      disabled:
        row.receivingGoodsStatus === RECEIVING_GOODS_STATUS_TEXT.CANCELLED ||
        viewEditAuthority.rights !== 'enable',
      width: 130,
    },
    {
      id: 1,
      label: 'Duplicate Record',
      Icon: Duplicate,
      disabled: !row.isClosed || createAuthority.rights !== 'enable',
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
    menuOptions = menuOptions.filter((option) => option.id !== 1)

  if (
    !viewEditAuthority ||
    (viewEditAuthority && viewEditAuthority.rights === 'hidden')
  )
    menuOptions = menuOptions.filter((option) => option.id !== 0)

  return menuOptions
}

export const getAccessRight = (
  authorityUrl = 'receivinggoods.receivinggoodsdetails',
) => {
  const accessRight = Authorized.check(authorityUrl)

  let allowAccess = false

  if (!accessRight || accessRight.rights === 'hidden') return allowAccess
  if (accessRight.rights === 'readwrite' || accessRight.rights === 'enable')
    allowAccess = true

  return allowAccess
}
