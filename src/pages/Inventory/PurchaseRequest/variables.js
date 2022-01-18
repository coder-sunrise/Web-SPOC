// material ui icons
import moment from 'moment'
import Edit from '@material-ui/icons/Edit'
import View from '@material-ui/icons/Visibility'
import Print from '@material-ui/icons/Print'
import Authorized from '@/utils/Authorized'

export const prSubmitAction = {
  SAVE: 1,
  SUBMITTED: 2,
}

export const PURCHASE_REQUEST_STATUS = {
  DRAFT: 1,
  SUBMITTED: 2,
}

const LTPurchaseRequestStatus = [
  {
    code: 'DRAFT',
    name: 'Draft',
    id: PURCHASE_REQUEST_STATUS.DRAFT,
  },
  {
    code: 'SUBMITTED',
    name: 'Submitted',
    id: PURCHASE_REQUEST_STATUS.SUBMITTED,
  },
]

export const getPurchaseRequestStatusFK = status => {
  let result = {}
  if (typeof status === 'number') {
    result = LTPurchaseRequestStatus.find(x => x.id === status)
  } else {
    result = LTPurchaseRequestStatus.find(
      x => x.name.toLowerCase() === status.toLowerCase(),
    )
  }
  return result
}

export const PurchaseRequestGridCol = [
  { name: 'purchaseRequestNo', title: 'PR No' },
  { name: 'purchaseRequestDate', title: 'PR Date' },
  { name: 'exceptedDeliveryDate', title: 'Expected Delivery Date' },
  { name: 'requestBy', title: 'Requested By' },
  { name: 'remarks', title: 'Remarks' },
  { name: 'purchaseRequestStatus', title: 'PR Status' },
  { name: 'action', title: 'Action' },
]

export const ContextMenuOptions = row => {
  // TODO new & edit access right
  const viewEditAuthority = Authorized.check(
    'inventory/purchasingrequest',
  ) || { rights: 'hidden' }
  const isView =
    row.purchaseRequestStatusFK === PURCHASE_REQUEST_STATUS.SUBMITTED  ||
    viewEditAuthority.rights !== 'enable'
  let menuOptions = [
    {
      id: 0,
      label: isView ? 'View' : 'Edit',
      Icon: isView ? View : Edit,
      disabled: viewEditAuthority.rights !== 'enable',
      width: 130,
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
  return menuOptions
}

export const getAccessRight = (
  authorityUrl = 'inventory/purchasingrequest',
) => {
  const accessRight = Authorized.check(authorityUrl)
  let allowAccess = false
  if (!accessRight || accessRight.rights === 'hidden') return allowAccess
  if (accessRight.rights === 'readwrite' || accessRight.rights === 'enable')
    allowAccess = true
  return allowAccess
}
