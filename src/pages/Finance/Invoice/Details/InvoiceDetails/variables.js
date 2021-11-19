import numeral from 'numeral'
import { NumberInput, Tooltip } from '@/components'
import { qtyFormat } from '@/utils/config'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const drugMixtureIndicator = (row, right) => {
  if (row.itemType !== 'Medication' || !row.isDrugMixture) return null

  return <DrugMixtureInfo values={row.prescriptionDrugMixture} right={right} />
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
      let paddingRight = 0
      if (row.isPreOrder) {
        paddingRight = 24
      }
      if (row.isDrugMixture) {
        paddingRight = 10
      }
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
            <div style={{ position: 'relative', top: 2 }}>
              {drugMixtureIndicator(row, -20)}
              {row.isPreOrder && (
                <Tooltip title='New Pre-Order'>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: -30,
                      borderRadius: 4,
                      backgroundColor: '#4255bd',
                      fontWeight: 500,
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '2px 3px',
                      height: 20,
                    }}
                  >
                    {' '}
                    Pre
                  </div>
                </Tooltip>
              )}
            </div>
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
    render: row => (
      <NumberInput
        value={
          row.isPreOrder && !row.isChargeToday
            ? 0
            : row.totalAfterItemAdjustment
        }
        text
        currency
      />
    ),
  },
]
