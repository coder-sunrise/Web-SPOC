import moment from 'moment'
import { TextField, FastField, DatePicker } from '@/components'

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
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalPrice',
    type: 'currency',
  },
  { columnName: 'dispensedQuanity', type: 'number' },
  { columnName: 'orderedQuantity', type: 'number' },
  {
    columnName: 'batchNo',
    render: (row) => {
      return (
        <FastField
          name={`prescription[${row.rowIndex}]batchNo`}
          render={(args) => <TextField simple {...args} />}
        />
      )
    },
  },
  {
    columnName: 'expiryDate',
    render: (row) => {
      return (
        <FastField
          name={`prescription[${row.rowIndex}]expiryDate`}
          render={(args) => (
            <DatePicker
              disabledDate={(d) => !d || d.isBefore(moment().add('days', -1))}
              simple
              {...args}
            />
          )}
        />
      )
    },
  },
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
    name: 'expiryDate',
    title: 'Expiry Date',
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
  {
    columnName: 'batchNo',
    render: (row) => {
      return (
        <FastField
          name={`vaccination[${row.rowIndex}]batchNo`}
          render={(args) => <TextField simple {...args} />}
        />
      )
    },
  },
  {
    columnName: 'expiryDate',
    render: (row) => {
      return (
        <FastField
          name={`vaccination[${row.rowIndex}]expiryDate`}
          render={(args) => (
            <DatePicker
              disabledDate={(d) => !d || d.isBefore(moment().add('days', -1))}
              simple
              {...args}
            />
          )}
        />
      )
    },
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
