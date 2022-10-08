import numeral from 'numeral'
import { compose } from 'redux'
import moment from 'moment'
import Info from '@material-ui/icons/Info'
import { connect } from 'dva'
import { qtyFormat, currencyFormat, currencySymbol } from '@/utils/config'
import { IconButton, Popover, Tooltip } from '@/components'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'

const LowStockInfo = ({
  sourceType,
  values = {},
  codetable,
  visitRegistration = {},
  patient = {},
  corVitalSign = [],
  right = -5,
  style = {
    position: 'absolute',
    bottom: 2,
    right: right,
  },
}) => {
  const { inventoryconsumable = [] } = codetable
  let source = {}
  if (sourceType === 'consumable' && values.inventoryConsumableFK)
    source = inventoryconsumable.find(
      m => m.id === values.inventoryConsumableFK,
    )
  else return ''

  if (!source) return ''

  const {
    criticalThreshold = 0.0,
    reOrderThreshold = 0.0,
    excessThreshold,
    stock = 0.0,
    sellingPrice = 0,
  } = source

  let isLowStock
  let isReOrder
  let isExcessStock
  let stockIconTooltip = ''
  if (sourceType !== 'prescriptionSet') {
    isLowStock = stock <= criticalThreshold
    isReOrder = stock <= reOrderThreshold
    isExcessStock = excessThreshold && stock >= excessThreshold
    if (isLowStock) stockIconTooltip = 'Low Stock'
    if (isExcessStock) stockIconTooltip = 'Excess Stock'
  }

  const details = () => {
    return (
      <div
        style={{
          fontSize: 14,
          height: 110,
        }}
      >
        <p>
          Current Stock: {numeral(stock).format(qtyFormat)}
          {isLowStock || isReOrder || isExcessStock ? (
            <font color={isLowStock ? 'red' : 'black'}>
              {' '}
              {isExcessStock ? '(Excess Stock)' : '(Low Stock)'}
            </font>
          ) : (
            ''
          )}
        </p>
        <p>
          Unit Price: {currencySymbol}
          {numeral(sellingPrice).format(currencyFormat)}
        </p>
      </div>
    )
  }
  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      content={details()}
    >
      <Tooltip title={stockIconTooltip}>
        <IconButton style={{ ...style }} size='medium'>
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
