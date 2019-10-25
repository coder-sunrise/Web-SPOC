import * as Yup from 'yup'
import Info from '@material-ui/icons/Info'
import { SizeContainer, Tooltip } from '@/components'
import { INVOICE_ITEM_TYPE } from '@/utils/constants'

export const SchemeInvoicePayerColumn = [
  { name: 'invoiceItemTypeFK', title: 'Category' },
  { name: 'itemName', title: 'Name' },
  { name: 'coverage', title: 'Coverage' },
  { name: 'payableBalance', title: 'Payable Amount ($)' },
  { name: 'claimAmount', title: 'Claim Amount ($)' },
  { name: 'error', title: ' ' },
]

export const CompanyInvoicePayerColumn = [
  { name: 'invoiceItemTypeFK', title: 'Category' },
  { name: 'itemName', title: 'Name' },
  { name: 'payableBalance', title: 'Payable Amount ($)' },
  { name: 'claimAmount', title: 'Claim Amount ($)' },
  { name: 'error', title: ' ' },
]

export const ApplyClaimsColumnExtension = [
  {
    columnName: 'invoiceItemTypeFK',
    // type: 'codeSelect',
    // code: 'ltinvoiceitemtype',
    render: (row) => INVOICE_ITEM_TYPE[row.invoiceItemTypeFK],
    disabled: true,
  },
  { columnName: 'itemName', disabled: true },
  {
    columnName: 'coverage',
    align: 'right',
    disabled: true,
  },
  {
    columnName: 'payableBalance',
    type: 'currency',
    currency: true,
    disabled: true,
  },

  {
    columnName: 'error',

    editingEnabled: false,
    sortingEnabled: false,
    disabled: true,
    width: 60,
    render: (row) => {
      if (row.error)
        return (
          <Tooltip title={row.error}>
            <div>
              <SizeContainer size='lg'>
                <Info color='error' />
              </SizeContainer>
            </div>
          </Tooltip>
        )
      return <div />
    },
  },
]

export const CoPayerColumns = [
  { name: 'invoiceItemTypeFK', title: 'Category' },
  { name: 'itemName', title: 'Name' },
  { name: 'payableBalance', title: 'Payable Amount' },
  {
    name: 'claimAmount',
    title: 'Claim Amount',
  },
]

export const CoPayerColExtensions = [
  {
    columnName: 'invoiceItemTypeFK',
    // type: 'codeSelect',
    // code: 'ltinvoiceitemtype',
    render: (row) => INVOICE_ITEM_TYPE[row.invoiceItemTypeFK],
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
    columnName: 'claimAmount',
    type: 'number',
    currency: true,
  },
]

export const validationSchema = Yup.object().shape({
  coverage: Yup.string(),
  payableBalance: Yup.number(),
  claimAmount: Yup.number().when(
    [
      'coverage',
      'payableBalance',
    ],
    (coverage, payableBalance, schema) => {
      const isPercentage = coverage.indexOf('%') > 0
      let _absoluteValue = 0
      if (isPercentage) {
        const percentage = parseFloat(coverage.slice(0, -1))
        _absoluteValue = payableBalance * percentage / 100
      } else _absoluteValue = coverage.slice(1)
      const message =
        _absoluteValue === payableBalance
          ? 'Claim Amount cannot exceed Total Payable'
          : `Claim Amount cannot exceed Coverage amount ($${_absoluteValue})`
      return schema.min(0).max(_absoluteValue, message)
    },
  ),
})
