import moment from 'moment'
import Print from '@material-ui/icons/Print'
import { FormattedMessage } from 'umi/locale'
import {
  NumberInput,
  TextField,
  FastField,
  DatePicker,
  Button,
  Tooltip,
  Checkbox,
  Select,
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
    title: 'Unit Price ($)',
  },
  {
    name: 'adjAmt',
    title: 'Item Adj ($)',
  },
  {
    name: 'totalAfterGST',
    title: 'Total Price Incl. GST ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const PrescriptionColumnExtensions = (
  viewOnly = false,
  onPrint,
  inventorymedication = [],
  handleSelectedBatch,
) => [
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalAfter',
    type: 'currency',
  },
  {
    columnName: 'adjAmt',
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
      const currentItem = inventorymedication.find(
        (o) => o.id === row.inventoryMedicationFK,
      )
      let batchNoOptions = []
      if (currentItem) {
        batchNoOptions = currentItem.medicationStock
      }
      return (
        <FastField
          name={`prescription[${row.rowIndex}]batchNo`}
          render={(args) => (
            <Select
              options={batchNoOptions}
              mode='tags'
              // valueField='id'
              valueField='batchNo'
              labelField='batchNo'
              maxSelected={1}
              disableAll
              onChange={(e, op = {}) => handleSelectedBatch(e, op, row)}
              {...args}
            />
          )}
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
        <Tooltip
          title={
            <FormattedMessage id='reception.queue.dispense.printDrugLabel' />
          }
        >
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
    name: 'adjAmt',
    title: 'Item Adj ($)',
  },
  {
    name: 'totalAfter',
    title: 'Total Price Incl. GST ($)',
  },
]

export const VaccinationColumnExtensions = (viewOnly = false) => [
  { columnName: 'dispensedQuanity', type: 'number' },
  { columnName: 'unitPrice', type: 'currency' },
  {
    columnName: 'totalAfter',
    type: 'currency',
  },
  {
    columnName: 'adjAmt',
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
    title: 'Unit Price ($)',
  },
  {
    name: 'adjAmt',
    title: 'Item Adj ($)',
  },
  {
    name: 'totalAfter',
    title: 'Total Price Incl. GST ($)',
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
  {
    columnName: 'unitPrice',
    // type: 'currency',
    align: 'right',
    render: (row) => {
      const { type } = row
      if (type !== 'Service' && type !== 'Consumable') return 'N/A'
      return <NumberInput text currency value={row.unitPrice} />
    },
  },
  {
    columnName: 'adjAmt',
    // type: 'currency',
    align: 'right',
    render: (row) => {
      const { type } = row
      if (type !== 'Service' && type !== 'Consumable') return 'N/A'
      return <NumberInput text currency value={row.adjAmt} />
    },
  },
  {
    columnName: 'totalAfter',
    // type: 'currency',
    align: 'right',
    render: (row) => {
      const { type } = row
      if (type !== 'Service' && type !== 'Consumable') return 'N/A'
      return <NumberInput text currency value={row.totalAfter} />
    },
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
