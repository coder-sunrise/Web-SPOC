import numeral from 'numeral'
import { Info } from '@material-ui/icons'
import { qtyFormat } from '@/utils/config'
import { IconButton, Popover, Tooltip } from '@/components'

const LowStockInfo = ({ sourceType, values, codetable }) => {
  const {
    inventorymedication,
    inventoryconsumable,
    inventoryvaccination,
  } = codetable
  let source = {}

  if (sourceType === 'medication' && values.inventoryMedicationFK) {
    source = inventorymedication.find(
      (m) => m.id === values.inventoryMedicationFK,
    )
  } else if (sourceType === 'consumable' && values.inventoryConsumableFK)
    source = inventoryconsumable.find(
      (m) => m.id === values.inventoryConsumableFK,
    )
  else if (sourceType === 'vaccination' && values.inventoryVaccinationFK) {
    source = inventoryvaccination.find(
      (m) => m.id === values.inventoryVaccinationFK,
    )
  } else return ''

  const {
    criticalThreshold = 0.0,
    reOrderThreshold = 0.0,
    stock = 0.0,
    isChasAcuteClaimable,
    isChasChronicClaimable,
  } = source

  const isLowStock = stock <= criticalThreshold
  const isReOrder = stock <= reOrderThreshold

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      content={
        <div
          style={{
            fontSize: 14,
            height: 70,
          }}
        >
          <p>
            Current Stock: {numeral(stock).format(qtyFormat)}
            {isLowStock || isReOrder ? (
              <font color={isLowStock ? 'red' : 'black'}> (Low Stock)</font>
            ) : (
              ''
            )}
          </p>
          <p>CHAS Acute Claimable: {isChasAcuteClaimable ? 'Yes' : 'No'}</p>
          <p>CHAS Chronic Claimable: {isChasChronicClaimable ? 'Yes' : 'No'}</p>
        </div>
      }
    >
      <Tooltip title='Low Stock'>
        <IconButton
          style={{
            position: 'absolute',
            bottom: 2,
            right: -5,
          }}
          size='medium'
        >
          <Info color={isLowStock ? 'error' : 'primary'} />
        </IconButton>
      </Tooltip>
    </Popover>
  )
}

export default LowStockInfo
