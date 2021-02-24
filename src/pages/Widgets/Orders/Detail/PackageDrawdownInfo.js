import { Table } from 'antd'
import moment from 'moment'
import { Popover, Tooltip, Button } from '@/components'
import tablestyles from '@/pages/Widgets/PatientHistory/PatientHistoryStyle.less'

const PackageDrawdownInfo = ({ drawdownData = {}, asAtDate }) => {
  const drawdownButtonStyle = {
    position: 'absolute',
    left: -5,
    top: -2,
    backgroundColor: '#9932CC',
  }

  const parseToOneDecimalString = (value = 0.0) => value.toFixed(1)

  const drawdownTransactionDetails = (data) => {
    if (data.length > 0) {
      return (
        <div style={{
          fontSize: 14,
        }}
        >
          <Table
            size='small'
            bordered
            pagination={false}
            columns={[
              {
                dataIndex: 'consumeDate',
                title: 'Consume Date',
                align: 'left',
                render: (text, row) => (
                  <span>{moment(row.consumeDate).format('DD MMM YYYY HH:mm')}</span>
                ),
              },
              {
                dataIndex: 'consumeQuantity',
                title: 'Consumed Quantity',
                align: 'right',
                width: 140,
                render: (text, row) => (
                  <span>
                    {parseToOneDecimalString(row.consumeQuantity)}
                  </span>
                ),
              },
            ]}
            dataSource={data || []}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )
    }
    return null
  }

  const packageDrawdownDetails = () => {
    if (drawdownData) {
      let totalDrawdown = 0
      let totalQty = 0
      let balanceQty = 0
      let drawdownTransaction = []
      const todayQuantity = drawdownData.packageConsumeQuantity

      const { packageDrawdown } = drawdownData
      if (packageDrawdown) {       
        if (packageDrawdown.packageDrawdownTransaction && packageDrawdown.packageDrawdownTransaction.length > 0) { 
          drawdownTransaction = packageDrawdown.packageDrawdownTransaction.filter(t => t.consumeDate < asAtDate && t.consumeQuantity > 0)
        }

        // Transferred quantity
        let transferredQty = 0
        const { packageDrawdownTransfer } = packageDrawdown
        if (packageDrawdownTransfer && packageDrawdownTransfer.length > 0) {
          const drawdownTransfer = packageDrawdownTransfer.filter(t => t.transferDate < asAtDate)
          drawdownTransfer.forEach(transfer => {
            transferredQty += transfer.quantity
          })
        }

        // Received (Transfer back) quantity
        let receivedQty = 0
        const { packageDrawdownReceive } = packageDrawdown
        if (packageDrawdownReceive && packageDrawdownReceive.length > 0) {
          const drawdownReceive = packageDrawdownReceive.filter(t => t.transferDate < asAtDate)
          drawdownReceive.forEach(receive => {
            receivedQty += receive.quantity
          })
        }

        totalQty = packageDrawdown.totalQuantity - transferredQty + receivedQty
        drawdownTransaction.forEach(txn => {
          totalDrawdown += txn.consumeQuantity
        })       
        balanceQty = totalQty - totalDrawdown 
      }
      else {
        totalQty = drawdownData.quantity
        balanceQty = drawdownData.quantity
      }

      return (
        <div>
          <p>
            Package Drawdown (to-date: {parseToOneDecimalString(totalDrawdown)}/{parseToOneDecimalString(totalQty)} = {parseToOneDecimalString(balanceQty)} bal) 
            (today: {parseToOneDecimalString(todayQuantity)})
          </p>
          <br />
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
          {packageDrawdownDetails()}
        </div>
      }
    >
      <Tooltip title='Package Drawdown'>        
        <Button
          style={drawdownButtonStyle}
          size='sm'
          justIcon
        >
          PD
        </Button>        
      </Tooltip>
    </Popover>
  )
}

export default PackageDrawdownInfo