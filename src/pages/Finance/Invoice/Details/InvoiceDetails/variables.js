import numeral from 'numeral'
import config from '@/utils/config'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const { qtyFormat } = config

const drugMixtureIndicator = (row) => {
  if (row.itemType !== 'Medication' || !row.isDrugMixture) return null

  return (
    <div style={{ position: 'relative', top: 2 }}>
      <DrugMixtureInfo values={row.prescriptionDrugMixture} />
    </div>
  )
}

const packageDrawdownIndicator = (row) => {
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
    columnName: 'itemName',
    render: (row) => {
      return (
        <div style={wrapCellTextStyle}>
          {packageDrawdownIndicator(row)}
          <div style={{
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

