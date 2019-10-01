import moment from 'moment'

export const tableConfig = {
  FuncProps: { pager: false },
}

export const PrescriptionColumns = [
  // { name: 'id', title: 'id' },
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'instruction',
    title: 'Instructions',
  },
  {
    name: 'batchNo',
    title: 'Batch #',
  },
  {
    name: 'expiryDate',
    title: 'Expiry Date',
  },
  {
    name: 'orderedQuantity',
    title: 'Qty Ordered',
  },
  {
    name: 'dispensedQuanity',
    title: 'Qty Dispensed',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price',
  },
  {
    name: 'totalPrice',
    title: 'Total Price',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const PrescriptionColumnExtensions = [
  { columnName: 'expiryDate', type: 'date' },
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalPrice',
    type: 'currency',
  },
  { columnName: 'dispensedQuanity', type: 'number' },
  { columnName: 'orderedQuantity', type: 'number' },
]

export const VaccinationColumn = [
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'sequence',
    title: 'Sequence',
  },
  {
    name: 'batchNo',
    title: 'Batch #',
  },
  {
    name: 'dispensedQuanity',
    title: 'Qty Dispensed',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price ($)',
  },
  {
    name: 'totalPrice',
    title: 'Total Price ($)',
  },
]

export const VaccinationColumnExtensions = [
  { columnName: 'dispensedQuanity', type: 'number' },
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalPrice',
    type: 'currency',
  },
]

export const OtherOrdersColumns = [
  {
    name: 'type',
    title: 'Type',
  },
  {
    name: 'description',
    title: 'Description',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price',
  },
  {
    name: 'totalPrice',
    title: 'Total Price',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const OtherOrdersColumnExtensions = [
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalPrice',
    type: 'currency',
  },
]
