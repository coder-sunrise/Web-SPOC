import moment from 'moment'
import Print from '@material-ui/icons/Print'
import {
  TextField,
  FastField,
  DatePicker,
  Button,
  Tooltip,
  Checkbox,
} from '@/components'

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

export const PrescriptionColumnExtensions = (viewOnly = false, onPrint) => [
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalPrice',
    type: 'currency',
  },
  {
    columnName: 'dispensedQuanity',
    type: 'number',
    render: (row) => {
      return <p>{row.dispensedQuanity} Strips</p>
    },
  },
  {
    columnName: 'orderedQuantity',
    type: 'number',
    render: (row) => {
      return <p>{row.orderedQuantity} Strips</p>
    },
  },
  {
    columnName: 'batchNo',
    render: (row) => {
      return (
        <FastField
          name={`prescription[${row.rowIndex}]batchNo`}
          render={(args) => <TextField simple text={viewOnly} {...args} />}
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
              text={viewOnly}
              disabledDate={(d) => !d || d.isBefore(moment().add('days', -1))}
              simple
              {...args}
            />
          )}
        />
      )
    },
  },
  {
    columnName: 'action',
    align: 'center',
    width: 80,
    render: (row) => {
      return (
        <Tooltip title='Print'>
          <Button
            color='primary'
            onClick={() => {
              onPrint('Medication', row)
            }}
            justIcon
          >
            <Print />
          </Button>
        </Tooltip>
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

export const VaccinationColumnExtensions = (viewOnly = false) => [
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
          render={(args) => <TextField simple text={viewOnly} {...args} />}
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
              text={viewOnly}
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

const compareString = (a, b) => a.localeCompare(b)

export const OtherOrdersColumnExtensions = (viewOnly = false, onPrint) => [
  {
    columnName: 'type',
    compare: compareString,
  },
  {
    columnName: 'description',
    compare: compareString,
  },
  { columnName: 'unitPrice', type: 'currency' },

  {
    columnName: 'totalPrice',
    type: 'currency',
  },
  {
    columnName: 'action',
    align: 'center',
    width: 80,
    render: (r) => {
      const { type } = r
      if (type === 'Service' || type === 'Consumable') return null
      return (
        <Tooltip title='Print'>
          <Button
            color='primary'
            justIcon
            onClick={() => {
              onPrint(type, r)
            }}
          >
            <Print />
          </Button>
        </Tooltip>
      )
    },
  },
]
