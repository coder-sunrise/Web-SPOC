import numeral from 'numeral'
import { NumberInput, Tooltip } from '@/components'
import { qtyFormat } from '@/utils/config'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

export const DataGridColExtensions = [
  {
    columnName: 'itemType',
    width: 300,
    render: row => {
      let paddingRight = 0
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              paddingRight: paddingRight,
            }}
          >
            {row.itemType}
          </div>
        </div>
      )
    },
  },
  {
    columnName: 'itemName',
    render: row => {
      return (
        <div style={wrapCellTextStyle}>
          <div
            style={{
              position: 'relative',
            }}
          >
            {row.itemName}
          </div>
        </div>
      )
    },
  },
  {
    columnName: 'quantity',
    type: 'number',
    currency: false,
    width: 180,
    render: row => {
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
    render: row => (
      <NumberInput
        value={row.hasPaid ? 0 : row.totalAfterItemAdjustment}
        text
        currency
      />
    ),
  },
]
