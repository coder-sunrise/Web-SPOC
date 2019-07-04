export const DataGridColumns = [
  { name: 'type', title: 'Type' },
  { name: 'name', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'adjustment', title: 'Adjustment' },
  { name: 'total', title: 'Total ($)' },
]

export const DataGridColExtensions = [
  { columnName: 'quantity', type: 'number', currency: false },
  { columnName: 'adjustment', type: 'currency', currency: true },
  { columnName: 'total', type: 'currency', currency: true },
]

export const TableConfig = {
  FuncProps: { pager: false },
}
