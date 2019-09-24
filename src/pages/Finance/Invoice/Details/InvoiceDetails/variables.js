export const DataGridColumns = [
  { name: 'itemType', title: 'Type' },
  { name: 'itemName', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'adjAmt', title: 'Adjustment' },
  { name: 'totalAfterItemAdjustment', title: 'Total ($)' },
]

export const DataGridColExtensions = [
  { columnName: 'quantity', type: 'number', currency: false },
  { columnName: 'adjAmt', type: 'currency', currency: true },
  { columnName: 'totalAfterItemAdjustment', type: 'currency', currency: true },
]

export const TableConfig = {
  FuncProps: { pager: false },
}
