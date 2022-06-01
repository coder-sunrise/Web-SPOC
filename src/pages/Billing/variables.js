import * as Yup from 'yup'
import Info from '@material-ui/icons/Info'
import { Tooltip } from '@/components'
import { INVOICE_ITEM_TYPE } from '@/utils/constants'
import { roundTo } from '@/utils/utils'

export const SchemeInvoicePayerColumn = [
  { name: 'itemType', title: 'Category' },
  { name: 'itemName', title: 'Name' },
  { name: 'coverage', title: 'Coverage' },
  { name: 'payableBalance', title: 'Payable Amount ($)' },
  { name: 'claimAmountBeforeGST', title: 'Claim Amount ($)' },
  // { name: 'error', title: ' ' },
]

export const CompanyInvoicePayerColumn = [
  { name: 'itemType', title: 'Category' },
  { name: 'itemName', title: 'Name' },
  { name: 'payableBalance', title: 'Payable Amount ($)' },
  { name: 'claimAmountBeforeGST', title: 'Claim Amount ($)' },
  // { name: 'error', title: ' ' },
]

export const ApplyClaimsColumnExtension = [
  {
    columnName: 'itemType',
    width: 150,
    disabled: true,
  },
  { columnName: 'itemName', disabled: true },
  {
    columnName: 'coverage',
    align: 'right',
    disabled: true,
    width: 150,
  },
  {
    columnName: 'payableBalance',
    type: 'currency',
    currency: true,
    disabled: true,
    width: 160,
  },

  {
    columnName: 'error',
    editingEnabled: false,
    sortingEnabled: false,
    disabled: true,
    width: 60,
    render: row => {
      if (row.error)
        return (
          <Tooltip title={row.error} placement='top'>
            <div>
              <Info color='error' />
            </div>
          </Tooltip>
        )
      return <div />
    },
  },
]

export const CoPayerColumns = [
  { name: 'itemType', title: 'Category' },
  { name: 'itemName', title: 'Name' },
  { name: 'payableBalance', title: 'Payable Amount' },
  {
    name: 'claimAmountBeforeGST',
    title: 'Claim Amount',
  },
  // {
  //   hidden: true,
  //   name: 'gstAmount',
  //   title: 'GST Amount',
  // },
]

export const CoPayerColExtensions = [
  {
    columnName: 'itemType',
    disabled: true,
  },
  {
    columnName: 'itemName',
    disabled: true,
  },
  {
    columnName: 'payableBalance',
    type: 'number',
    currency: true,
    disabled: true,
  },
  {
    columnName: 'claimAmountBeforeGST',
    type: 'number',
    currency: true,
    isDisabled: row => !row.isClaimable,
  },
]

export const validationSchema = Yup.object().shape({
  coverage: Yup.string(),
  payableBalance: Yup.number(),
  claimAmountBeforeGST: Yup.number().when(
    ['coverage', 'payableBalance'],
    (coverage, payableBalance, schema) => {
      const isPercentage = coverage.indexOf('%') > 0
      let _absoluteValue = 0
      if (isPercentage) {
        const percentage = parseFloat(coverage.slice(0, -1))
        if (percentage === 100) {
          _absoluteValue = payableBalance
        } else _absoluteValue = roundTo((payableBalance * percentage) / 100, 4)
      } else _absoluteValue = coverage.slice(1)
      const message =
        _absoluteValue === payableBalance
          ? 'Claim Amount cannot exceed Total Payable'
          : `Claim Amount cannot exceed Coverage amount ($${_absoluteValue})`
      return schema.min(0).max(_absoluteValue, message)
    },
  ),
})
