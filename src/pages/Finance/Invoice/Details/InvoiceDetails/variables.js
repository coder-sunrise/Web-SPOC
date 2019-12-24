import numeral from 'numeral'
import config from '@/utils/config'

const { qtyFormat } = config
export const DataGridColumns = [
  { name: 'itemType', title: 'Type' },
  { name: 'itemName', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'adjAmt', title: 'Adjustment' },
  { name: 'totalAfterItemAdjustment', title: 'Total ($)' },
]

export const DataGridColExtensions = [
  { columnName: 'itemType', width: 300 },
  {
    columnName: 'quantity',
    type: 'number',
    currency: false,
    width: 180,
    render: (row) => {
      const { quantity, dispenseUOMDisplayValue = '' } = row
      return `${numeral(quantity).format(qtyFormat)} ${dispenseUOMDisplayValue}`
    },
  },
  { columnName: 'adjAmt', type: 'currency', currency: true, width: 180 },
  {
    columnName: 'totalAfterItemAdjustment',
    type: 'currency',
    currency: true,
    width: 200,
  },
]

export const TableConfig = {
  FuncProps: { pager: false },
}
