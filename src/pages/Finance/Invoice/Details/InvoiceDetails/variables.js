import numeral from 'numeral'
import { Tag } from 'antd'
import { NumberInput, Tooltip } from '@/components'
import { qtyFormat } from '@/utils/config'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const drugMixtureIndicator = row => {
  if (row.itemType !== 'Medication' || !row.isDrugMixture) return null

  return (
    <div style={{ position: 'relative', top: 2 }}>
      <DrugMixtureInfo values={row.prescriptionDrugMixture} />
    </div>
  )
}

const packageDrawdownIndicator = row => {
  if (!row.isPackage) return null

  return (
    <div style={{ position: 'relative' }}>
      <PackageDrawdownInfo
        drawdownData={row}
        asAtDate={row.packageDrawdownAsAtDate}
      />
    </div>
  )
}

export const DataGridColExtensions = [
  {
    columnName: 'itemType',
    width: 300,
    render: row => {
      return (
        <div style={{ position: 'relative' }}>
          <div style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            paddingRight: row.isPreOrder ? 34 : 0
          }}>
            {row.itemType}
            {drugMixtureIndicator(row)}
            {row.isPreOrder && <Tooltip title='Pre-Order'><Tag color="#4255bd" style={{ position: 'absolute', top: 0, right: -10, borderRadius: 10 }}>Pre</Tag></Tooltip>}
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
          {packageDrawdownIndicator(row)}
          <div
            style={{
              position: 'relative',
              left: row.isPackage ? 22 : 0,
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
    render: (row) => <NumberInput value={(row.isPreOrder && !row.isChargeToday) ? 0 : row.totalAfterItemAdjustment} text currency />
  },
]
