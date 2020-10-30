import { Table } from 'antd'
import moment from 'moment'
import { Popover, Tooltip, Button } from '@/components'
import tablestyles from '@/pages/Widgets/PatientHistory/PatientHistoryStyle.less'

const PackageDrawdownInfo = ({ drawdownData = {} }) => {
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

  const packageDrawdownDetails = (data) => {
    if (data) {
      let totalDrawdown = 0
      let totalQty = 0
      let balanceQty = 0
      let drawdownTransaction = []
      const todayQuantity = data.packageConsumeQuantity

      const { packageDrawdown } = data
      if (packageDrawdown) {        
        totalQty = packageDrawdown.totalQuantity
        balanceQty = packageDrawdown.remainingQuantity + todayQuantity
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
          {packageDrawdownDetails(drawdownData)}
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