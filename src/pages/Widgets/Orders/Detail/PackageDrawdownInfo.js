import { Popover, Tooltip, Button } from '@/components'

const PackageDrawdownInfo = ({ drawdownData = {} }) => {
  const parseToOneDecimalString = (value = 0.0) => value.toFixed(1)

  const drawdownTransactionDetails = (data) => {
    if (data.length > 0) {
      return data.map((row) => {
        return (
          <p>
            {row.consumeDate}  {row.consumeQuantity}
          </p>
        )
      })
    }
  }

  const packageDrawdownDetails = (data) => {
    if (data) {
      let totalDrawdown = 0
      let totalQty = 0
      let balanceQty = 0
      let drawdownTransaction = []

      const { packageDrawdown } = data
      if (packageDrawdown) {        
        totalQty = packageDrawdown.totalQuantity
        balanceQty = packageDrawdown.remainingQuantity
        totalDrawdown = totalQty - balanceQty
        drawdownTransaction = packageDrawdown.packageDrawdownTransaction
      }
      else {
        totalQty = data.quantity
        balanceQty = data.quantity
      }

      return (
        <div>
          <p>
            Package Drawdown (to-date: {parseToOneDecimalString(totalDrawdown)}/{parseToOneDecimalString(totalQty)} = {parseToOneDecimalString(balanceQty)} bal) 
            (today: {parseToOneDecimalString(data.packageConsumeQuantity)})
          </p>

          {drawdownTransactionDetails(drawdownTransaction)}
        </div>
      )
    }
    return null
  }

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      content={
        <div
          style={{
            fontSize: 14,
          }}
        >
          {packageDrawdownDetails(drawdownData)}
        </div>
      }
    >
      <Tooltip title='Package Drawdown'>        
        <Button
          style={{
              position: 'absolute',
              left: -5,
              top: -1,
            }}
          size='sm'
          color='rose'
          justIcon
        >
            PD
        </Button>        
      </Tooltip>
    </Popover>
  )
}

export default PackageDrawdownInfo