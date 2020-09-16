import numeral from 'numeral'
import config from '@/utils/config'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const { qtyFormat } = config
export const DataGridColumns = [
  { name: 'itemType', title: 'Type' },
  { name: 'itemName', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'adjAmt', title: 'Adjustment' },
  { name: 'totalAfterItemAdjustment', title: 'Total ($)' },
]

const drugMixtureIndicator = (row) => {
  if (row.itemType !== 'Medication' || !row.isDrugMixture) return null

  return (
    <div style={{ position: 'relative', top: 2 }}>
      <DrugMixtureInfo values={row.prescriptionDrugMixture} />
    </div>
  )
}

export const DataGridColExtensions = [
  {
    columnName: 'itemType',
    width: 300,
    render: (row) => {
      return (
        <div style={{ position: 'relative' }}>
          <div style={wrapCellTextStyle}>
            {row.itemType}
            {drugMixtureIndicator(row)}
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
