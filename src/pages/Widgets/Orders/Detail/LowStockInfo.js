import numeral from 'numeral'
import { compose } from 'redux'
import Info from '@material-ui/icons/Info'
import { connect } from 'dva'
import { qtyFormat, currencyFormat, currencySymbol } from '@/utils/config'
import { IconButton, Popover, Tooltip } from '@/components'

const LowStockInfo = ({ sourceType, values = {}, codetable }) => {
  const {
    inventorymedication = [],
    inventoryconsumable = [],
    inventoryvaccination = [],
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

  if (!source) return ''

  const {
    criticalThreshold = 0.0,
    reOrderThreshold = 0.0,
    stock = 0.0,
    isChasAcuteClaimable,
    isChasChronicClaimable,
    isMedisaveClaimable,
    sellingPrice = 0,
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
            height: 110,
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
          <p>
            Unit Price: {currencySymbol}
            {numeral(sellingPrice).format(currencyFormat)}
          </p>
          <p>CHAS Acute Claimable: {isChasAcuteClaimable ? 'Yes' : 'No'}</p>
          <p>CHAS Chronic Claimable: {isChasChronicClaimable ? 'Yes' : 'No'}</p>
          <p>Medisave Claimable: {isMedisaveClaimable ? 'Yes' : 'No'}</p>
        </div>
      }
    >
      <Tooltip title={isLowStock ? 'Low Stock' : ''}>
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

export default compose(
  connect(({ codetable }) => ({
    codetable,
  })),
)(LowStockInfo)
